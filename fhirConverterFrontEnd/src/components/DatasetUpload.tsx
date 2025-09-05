import React from "react";
import { useConverted } from "../contexts/ConvertedContext";
import { useFile } from "../contexts/FileContext";
import { Upload, Database, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";

type UploadResult = "success" | "error" | null;

function DatasetUpload() {
  const { isConverted } = useConverted();
  const { file } = useFile();

  const [projectID, setProjectID] = React.useState<string>("");
  const [region, setRegion] = React.useState<string>("");
  const [datasetName, setDatasetName] = React.useState<string>("");
  const [storeName, setStoreName] = React.useState<string>("");
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const [uploadResult, setUploadResult] = React.useState<UploadResult>(null);

  const uploadToFhirStore = async () => {
    if (!file) {
      setUploadResult("error");
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    const formData = new FormData();

    if (file instanceof File) {
      formData.append("file", file);
    } else {
      formData.append("file", file, "convertedResource.json");
    }

    formData.append("projectId", projectID);
    formData.append("region", region);
    formData.append("datasetName", datasetName);
    formData.append("storeName", storeName);

    try {
      const res = await fetch(
        "https://fhirconverterbackend-46baa901ea5d.herokuapp.com/api/upload-fhir-bundle",
        { method: "POST", body: formData }
      );
      setUploadResult(res.ok ? "success" : "error");
    } catch {
      setUploadResult("error");
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = Boolean(
    projectID.trim() && region.trim() && datasetName.trim() && storeName.trim() && file
  );

  return (
    <div>
      {isConverted && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Database className="h-5 w-5" />
                Upload to FHIR Store
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Complete these fields to upload your converted FHIR resource to your Google FHIR
                Store
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projectId">Project ID</Label>
                  <Input
                    id="projectId"
                    value={projectID}
                    onChange={(e) => setProjectID(e.target.value)}
                    placeholder="your-project-id"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="region">Region</Label>
                  <Input
                    id="region"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    placeholder="us-central1"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="datasetName">Dataset Name</Label>
                  <Input
                    id="datasetName"
                    value={datasetName}
                    onChange={(e) => setDatasetName(e.target.value)}
                    placeholder="my-dataset"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="storeName">FHIR Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="my-fhir-store"
                    className="mt-1"
                  />
                </div>
              </div>

              {uploadResult === "success" && (
                <Alert className="border-green-200 dark:border-green-800">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    File successfully uploaded to your FHIR store! Thanks for using our service!
                  </AlertDescription>
                </Alert>
              )}

              {uploadResult === "error" && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Upload failed. Please check your credentials and try again.
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={uploadToFhirStore}
                disabled={!isFormValid || isUploading}
                className="w-full"
                size="lg"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload to Store
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default DatasetUpload;
