import React from "react";
import { useConverted } from "../contexts/ConvertedContext";
import { useFile } from "../contexts/FileContext";
import { Folder, File as FileIcon, ChevronLeft, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

type DropdownMenuProps = {
  givenProjectId: string;
  bucketsAndObjects: string;
};

function findIndexSafe<T>(arr: T[], predicate: (x: T) => boolean): number {
  for (let i = 0; i < arr.length; i++) {
    if (predicate(arr[i])) return i;
  }
  return -1;
}

// Safe startsWith without relying on lib.es2015 typings
const sw = (s: string, pre: string) => s.slice(0, pre.length) === pre;

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  givenProjectId,
  bucketsAndObjects,
}) => {
  const [isBucketOrObject, setIsBucketOrObject] =
    React.useState<"Bucket" | "Object">("Bucket");
  const [objects, setObjects] = React.useState<string[]>([]);
  const [selectedBucketName, setSelectedBucketName] = React.useState<string>("");
  const [selectedObjectName, setSelectedObjectName] = React.useState<string>("");
  const [selectedObject, setSelectedObject] = React.useState<string | null>(null);

  const { setIsConverted } = useConverted();
  const { setFile } = useFile();

  const projectId = givenProjectId;

  const lines = React.useMemo<string[]>(
    () => bucketsAndObjects.split("\n"),
    [bucketsAndObjects]
  );

  const buckets = React.useMemo<string[]>(
    () =>
      lines
        .filter((line) => sw(line, "Bucket:"))
        .map((line) => {
          const idx = line.indexOf(":");
          return idx >= 0 ? line.slice(idx + 1).trim() : line.trim();
        }),
    [lines]
  );

  const handleBucketClick = (bucket: string) => {
    setSelectedBucketName(bucket);

    const header = `Objects in ${bucket}:`;
    const bucketIndex = findIndexSafe(lines, (line) =>
  sw(line, `Objects in ${bucket}:`)
);

    const objectsForBucket: string[] = [];
    if (bucketIndex !== -1) {
      for (let i = bucketIndex + 1; i < lines.length; i++) {
        const cur = lines[i];
        if (sw(cur, "Bucket:") || sw(cur, "Objects in ")) break;
        if (cur.trim()) objectsForBucket.push(cur.trim());
      }
    }

    setObjects(objectsForBucket);
    setIsBucketOrObject("Object");
  };

  const handleObjectClick = (object: string) => {
    setSelectedObject(object);
    setSelectedObjectName(object);
  };

  const handleBackToBuckets = () => {
    setIsBucketOrObject("Bucket");
    setSelectedObject(null);
    setObjects([]);
  };

  const convertObjectToFhir = () => {
    const accessToken = localStorage.getItem("accessToken") ?? "";
    const requestBody = `${projectId},${selectedObjectName},${selectedBucketName},${accessToken}`;

    fetch(
      "https://fhirconverterbackend-46baa901ea5d.herokuapp.com/api/objectToConvert",
      {
        method: "POST",
        body: requestBody,
      }
    )
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch buckets");
        return response.blob();
      })
      .then((blob) => {
        setFile(blob);

        const convertedURL = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = convertedURL;
        downloadLink.download = "convertedResource.json";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(convertedURL);

        setIsConverted(true);
      })
      .catch((error: unknown) => {
        const msg = error instanceof Error ? error.message : String(error);
        console.error("Error fetching buckets:", msg);
      });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isBucketOrObject === "Bucket" ? (
              <>
                <Folder className="h-5 w-5" />
                Available Buckets
              </>
            ) : (
              <>
                <FileIcon className="h-5 w-5" />
                Files in {selectedBucketName}
                <Badge variant="secondary" className="ml-auto">
                  {objects.length} files
                </Badge>
              </>
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {isBucketOrObject === "Object" && (
            <Button variant="outline" onClick={handleBackToBuckets} className="w-full">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Buckets
            </Button>
          )}

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {isBucketOrObject === "Bucket" ? (
              buckets.map((bucket, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => handleBucketClick(bucket)}
                  className="w-full justify-start h-auto p-4"
                >
                  <Folder className="mr-3 h-4 w-4 text-blue-500" />
                  <div className="text-left">
                    <p className="font-medium">{bucket}</p>
                    <p className="text-xs text-muted-foreground">
                      Google Cloud Storage Bucket
                    </p>
                  </div>
                </Button>
              ))
            ) : objects.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileIcon className="mx-auto h-8 w-8 mb-2" />
                <p>No files found in this bucket</p>
              </div>
            ) : (
              objects.map((object, index) => (
                <Button
                  key={index}
                  variant={selectedObject === object ? "default" : "ghost"}
                  onClick={() => handleObjectClick(object)}
                  className="w-full justify-start h-auto p-4"
                >
                  <FileIcon className="mr-3 h-4 w-4 text-green-500" />
                  <div className="text-left flex-1">
                    <p className="font-medium truncate">{object}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedObject === object
                        ? "Selected for conversion"
                        : "Click to select"}
                    </p>
                  </div>
                  {selectedObject === object && (
                    <Badge variant="secondary" className="ml-2">
                      Selected
                    </Badge>
                  )}
                </Button>
              ))
            )}
          </div>

          {isBucketOrObject === "Object" && selectedObject && (
            <Button onClick={convertObjectToFhir} className="w-full" size="lg">
              <Download className="mr-2 h-4 w-4" />
              Convert &amp; Download {selectedObject}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DropdownMenu;
