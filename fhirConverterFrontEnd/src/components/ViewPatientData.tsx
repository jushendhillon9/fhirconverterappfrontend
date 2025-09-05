import React from "react";
import { FileText, Heart, AlertTriangle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

type TabValue = "Diagnoses" | "Allergies";

type ViewPatientDataProps = {
  projectId: string;
  region: string;
  datasetName: string;
  fhirStoreName: string;
  patientId: string;
};

function ViewPatientData({
  projectId,
  region,
  datasetName,
  fhirStoreName,
  patientId,
}: ViewPatientDataProps) {
  const [selected, setSelected] = React.useState<TabValue>("Diagnoses");
  const [conditions, setConditions] = React.useState<string[]>([]);
  const [allergies, setAllergies] = React.useState<string[]>([]);
  const [isLoadingConditions, setIsLoadingConditions] = React.useState<boolean>(false);
  const [isLoadingAllergies, setIsLoadingAllergies] = React.useState<boolean>(false);

  const onTabChange = (v: string) => setSelected(v as TabValue);

  const fetchConditions = () => {
    setIsLoadingConditions(true);
    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("requestedResource", "Conditions");
    formData.append("projectId", projectId);
    formData.append("region", region);
    formData.append("datasetName", datasetName);
    formData.append("fhirStoreName", fhirStoreName);

    fetch("https://fhirconverterbackend-46baa901ea5d.herokuapp.com/api/get-conditions", {
      method: "POST",
      body: formData,
    })
      .then((r) => r.json())
      .then((data: any) => {
        const conditionsArray: string[] = [];
        if (data?.entry?.length) {
          for (let i = 0; i < data.entry.length; i++) {
            const codeText = data.entry[i]?.resource?.code?.text;
            const noteText = data.entry[i]?.resource?.note?.[0]?.text;
            if (typeof codeText === "string") conditionsArray.push(codeText);
            if (typeof noteText === "string") conditionsArray.push(noteText);
          }
        }
        setConditions(conditionsArray.length ? conditionsArray : ["No conditions found"]);
      })
      .catch(() => {
        setConditions(["Error loading conditions"]);
      })
      .then(() => setIsLoadingConditions(false));
  };

  const fetchAllergies = () => {
	const requestedResource = "AllergyIntolerances";
    setIsLoadingAllergies(true);
    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("requestedResource", requestedResource)
    formData.append("projectId", projectId);
    formData.append("region", region);
    formData.append("datasetName", datasetName);
    formData.append("fhirStoreName", fhirStoreName);

    fetch("https://fhirconverterbackend-46baa901ea5d.herokuapp.com/api/get-conditions", {
      method: "POST",
      body: formData,
    })
      .then((r) => r.json())
      .then((data: any) => {
        const allergiesArray: string[] = [];
        if (data?.entry?.length) {
          for (let i = 0; i < data.entry.length; i++) {
            const codeText = data.entry[i]?.resource?.code?.text;
            if (typeof codeText === "string") allergiesArray.push(codeText);
          }
        }
        setAllergies(allergiesArray.length ? allergiesArray : ["No allergies found"]);
      })
      .catch(() => {
        setAllergies(["Error loading allergies"]);
      })
      .then(() => setIsLoadingAllergies(false));
  };

  const handleDiagnosesClick = () => {
    fetchConditions();
    setSelected("Diagnoses");
  };

  const handleAllergiesClick = () => {
    fetchAllergies();
    setSelected("Allergies");
  };

  return (
    <Card className="border-emerald-200/50 dark:border-emerald-800/50 shadow-xl bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-950/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
          <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg">
            <FileText className="h-5 w-5 text-white" />
          </div>
          View Patient Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selected} onValueChange={onTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="Diagnoses"
              onClick={handleDiagnosesClick}
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-teal-600 data-[state=active]:text-white"
            >
              <Heart className="h-4 w-4" />
              Diagnoses
            </TabsTrigger>
            <TabsTrigger
              value="Allergies"
              onClick={handleAllergiesClick}
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
            >
              <AlertTriangle className="h-4 w-4" />
              Allergies
            </TabsTrigger>
          </TabsList>

          <TabsContent value="Diagnoses" className="mt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Patient Diagnoses</h3>
                <Badge variant="secondary">{conditions.length} items</Badge>
              </div>

              {isLoadingConditions ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading diagnoses...</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {conditions.map((condition, index) => (
                    <div key={`condition-${index}`} className="p-3 bg-muted rounded-lg border">
                      <p className="text-sm">{condition}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="Allergies" className="mt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Patient Allergies</h3>
                <Badge variant="secondary">{allergies.length} items</Badge>
              </div>

              {isLoadingAllergies ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading allergies...</span>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allergies.map((allergy, index) => (
                    <div key={`allergy-${index}`} className="p-3 bg-muted rounded-lg border">
                      <p className="text-sm">{allergy}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default ViewPatientData;
