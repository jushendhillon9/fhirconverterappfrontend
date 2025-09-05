import React from "react";
import { Upload, FileText, Download, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";

type StatusCode = 200 | 400 | null;

function DragAndDrop() {
  const [file, setFile] = React.useState<File | null>(null);
  const [statusCode, setStatusCode] = React.useState<StatusCode>(null);
  const [uploadedStatus, setUploadedStatus] = React.useState<boolean>(false);
  const [convertedURL, setConvertedURL] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0] ?? null;
    setFile(f);
    setStatusCode(null); // reset badge on new selection
    setUploadedStatus(false);
    setConvertedURL("");
  };

  const onFileUpload = () => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("fileToConvert", file);

    fetch("https://fhirconverterbackend-46baa901ea5d.herokuapp.com/api/convertingFile", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Network response was not ok");
        return response.blob();
      })
      .then((blob) => {
        setUploadedStatus(true);
        setConvertedURL(URL.createObjectURL(blob));
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      })
      .finally(() => setIsLoading(false));
  };

  const downloadFile = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!convertedURL) {
      console.error("Converted URL is empty. File has not been converted yet.");
      return;
    }

    const downloadLink = document.createElement("a");
    downloadLink.href = convertedURL;
    downloadLink.download = "convertedResource.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  React.useEffect(() => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    fetch("https://fhirconverterbackend-46baa901ea5d.herokuapp.com/api/uploadingFile", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        setStatusCode(response.ok ? 200 : 400);
        return response.text();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        setStatusCode(400);
      });
  }, [file]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="border-orange-200/50 dark:border-orange-800/50 shadow-xl bg-gradient-to-br from-white to-orange-50/30 dark:from-slate-900 dark:to-orange-950/30">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-orange-800 dark:text-orange-200">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
              <Upload className="h-5 w-5 text-white" />
            </div>
            Convert Individual Files
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div className="relative">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-orange-300/50 dark:border-orange-700/50 rounded-lg cursor-pointer bg-orange-50/30 dark:bg-orange-950/20 hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">CSV, JSON files only</p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={onFileChange}
                  accept=".csv,.json,application/json,text/csv"
                />
              </label>
            </div>

            {file && (
              <div className="mt-4 flex items-center gap-3 p-3 bg-muted rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{file.name}</span>
                {statusCode === 200 && (
                  <Badge variant="secondary" className="ml-auto">
                    Ready
                  </Badge>
                )}
                {statusCode === 400 && (
                  <Badge variant="destructive" className="ml-auto">
                    Error
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Convert Button */}
          {statusCode === 200 && (
            <Button
              onClick={onFileUpload}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Converting...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Convert to FHIR
                </>
              )}
            </Button>
          )}

          {/* Status Messages */}
          {statusCode === 400 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to upload file. Please check the file format and try again.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Conversion Results */}
      {uploadedStatus && (
        <Card className="border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              Conversion Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="text-center">
                <p className="font-medium mb-2">View File</p>
                <Button variant="outline" asChild>
                  <a href={convertedURL} target="_blank" rel="noopener noreferrer">
                    <FileText className="mr-2 h-4 w-4" />
                    Open
                  </a>
                </Button>
              </div>

              <div className="text-center">
                <p className="font-medium mb-2">Download File</p>
                <Button onClick={downloadFile}>
                  <Download className="mr-2 h-4 w-4" />
                  Download JSON
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default DragAndDrop;
