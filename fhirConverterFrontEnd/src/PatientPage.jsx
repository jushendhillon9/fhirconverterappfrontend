import React, {useState} from 'react'
import ViewPatientData from "./components/ViewPatientData"
import AddPatientData from "./components/AddPatientData"
import { User, Database, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';

function PatientPage() {
  const [projectId, setProjectId] = useState(null);
  const [region, setRegion] = useState(null);
  const [datasetName, setDatasetName] = useState(null);
  const [fhirStoreName, setFhirStoreName] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [render, setRender] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    if (projectId && region && datasetName && fhirStoreName && patientId) {
      setRender(true);
    }
  }

  const isFormValid = projectId && region && datasetName && fhirStoreName && patientId;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-emerald-50/30 dark:from-slate-950 dark:via-background dark:to-slate-900">
      {/* Header */}
      <header className="border-b border-sky-200/50 dark:border-sky-800/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-xl shadow-lg">
                <Database className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-600 dark:from-sky-400 dark:to-emerald-400 bg-clip-text text-transparent">
                FhirConverter App
              </h1>
            </div>
          </div>
          <p className="text-muted-foreground mt-2">Edit & View Patient Data in Google FHIR Dataset ✏️</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Configuration Form */}
        <div className="max-w-3xl mx-auto mb-8">
          <Card className="border-sky-200/50 dark:border-sky-800/50 shadow-xl bg-gradient-to-br from-white to-sky-50/30 dark:from-slate-900 dark:to-slate-800/30">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-sky-800 dark:text-sky-200">
                <div className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                Patient Data Configuration
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-2">
                Enter your Google Cloud FHIR store details and patient ID to view or add patient data
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectId">Project ID</Label>
                    <Input
                      id="projectId"
                      onChange={(e) => setProjectId(e.target.value)}
                      placeholder="your-project-id"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Region</Label>
                    <Input
                      id="region"
                      onChange={(e) => setRegion(e.target.value)}
                      placeholder="us-central1"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="datasetName">Dataset Name</Label>
                    <Input
                      id="datasetName"
                      onChange={(e) => setDatasetName(e.target.value)}
                      placeholder="my-dataset"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fhirStoreName">FHIR Store Name</Label>
                    <Input
                      id="fhirStoreName"
                      onChange={(e) => setFhirStoreName(e.target.value)}
                      placeholder="my-fhir-store"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="patientId">Patient ID</Label>
                  <Input
                    id="patientId"
                    onChange={(e) => setPatientId(e.target.value)}
                    placeholder="patient-12345"
                    className="mt-1"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleClick}
                  disabled={!isFormValid}
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg"
                  size="lg"
                >
                  <User className="mr-2 h-4 w-4" />
                  Connect to Patient Data
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Patient Data Components */}
        {render && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <ViewPatientData 
              projectId={projectId} 
              region={region} 
              datasetName={datasetName} 
              fhirStoreName={fhirStoreName} 
              patientId={patientId}
            />
            <AddPatientData 
              projectId={projectId} 
              region={region} 
              datasetName={datasetName} 
              fhirStoreName={fhirStoreName} 
              patientId={patientId}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default PatientPage;