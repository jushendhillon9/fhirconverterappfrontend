import React, {useState} from 'react'
import { Plus, Heart, Pill, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';

type SubmitResult =
  | { type: 'success'; message: string }
  | { type: 'error'; message: string }
  | null;

type TabValue = 'Diagnoses' | 'Prescription';

function AddPatientData({projectId, region, datasetName, fhirStoreName, patientId}) {
  const [clinicalStatus, setClinicalStatus] = React.useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = React.useState<string | null>(null);
  const [code, setCode] = React.useState<string | null>(null);
  const [description, setDescription] = React.useState<string | null>(null);

  const [medicationName, setMedicationName] = React.useState<string | null>(null);
  const [medicationCode, setMedicationCode] = React.useState<string | null>(null);

  const [selected, setSelected] = React.useState<string>('Diagnoses');

  const [isSubmittingDiagnosis, setIsSubmittingDiagnosis] = React.useState(false);
  const [isSubmittingPrescription, setIsSubmittingPrescription] = React.useState(false);

  const [submitResult, setSubmitResult] = React.useState<SubmitResult>(null);

  const handleDiagnosisSubmission = () => {
    const formData = new FormData();
    if (!verificationStatus || !clinicalStatus || !code || !description) {
      setSubmitResult({ type: 'error', message: 'Please fill out all fields' });
      return;
    }
    
    setIsSubmittingDiagnosis(true);
    setSubmitResult(null);
    
    formData.append("projectId", projectId);
    formData.append("region", region);
    formData.append("datasetName", datasetName);
    formData.append("fhirStoreName", fhirStoreName);
    formData.append("clinicalStatus", clinicalStatus);
    formData.append("verificationStatus", verificationStatus);
    formData.append("code", code);
    formData.append("description", description);
    formData.append("patientId", patientId);
    
    fetch ("https://fhirconverterbackend-46baa901ea5d.herokuapp.com/api/create-condition", {
      method: "POST", 
      body: formData
    })
    .then((response) => {
      setIsSubmittingDiagnosis(false);
      if (response.ok) {
        setSubmitResult({ type: 'success', message: 'Condition successfully created!' });
        // Clear form
        setClinicalStatus(null);
        setVerificationStatus(null);
        setCode(null);
        setDescription(null);
      } else {
        setSubmitResult({ type: 'error', message: 'Error creating condition. Please check all fields and try again.' });
      }
    })
    .catch(() => {
      setIsSubmittingDiagnosis(false);
      setSubmitResult({ type: 'error', message: 'Network error. Please try again.' });
    });
  }

  const handlePrescriptionSubmission = () => {
    const formData = new FormData();
    if (!medicationCode || !medicationName) {
      setSubmitResult({ type: 'error', message: 'Please fill out all fields' });
      return;
    }
    
    setIsSubmittingPrescription(true);
    setSubmitResult(null);
    
    formData.append("projectId", projectId);
    formData.append("region", region);
    formData.append("datasetName", datasetName);
    formData.append("fhirStoreName", fhirStoreName);
    formData.append("medicationName", medicationName);
    formData.append("medicationCode", medicationCode);
    formData.append("patientId", patientId)
    
    fetch ("https://fhirconverterbackend-46baa901ea5d.herokuapp.com/api/create-medication", {
      method: "POST", 
      body: formData
    })
    .then((response) => {
      setIsSubmittingPrescription(false);
      if (response.ok) {
        setSubmitResult({ type: 'success', message: 'Medication successfully created!' });
        // Clear form
        setMedicationName(null);
        setMedicationCode(null);
      } else {
        setSubmitResult({ type: 'error', message: 'Error creating medication. Please check all fields and try again.' });
      }
    })
    .catch(() => {
      setIsSubmittingPrescription(false);
      setSubmitResult({ type: 'error', message: 'Network error. Please try again.' });
    });
  }

  return (
    <Card className="border-sky-200/50 dark:border-sky-800/50 shadow-xl bg-gradient-to-br from-white to-sky-50/30 dark:from-slate-900 dark:to-sky-950/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sky-800 dark:text-sky-200">
          <div className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-lg">
            <Plus className="h-5 w-5 text-white" />
          </div>
          Add Patient Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={selected} onValueChange={setSelected} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Diagnoses" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <Heart className="h-4 w-4" />
              Diagnoses
            </TabsTrigger>
            <TabsTrigger value="Prescription" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-600 data-[state=active]:text-white">
              <Pill className="h-4 w-4" />
              Prescription
            </TabsTrigger>
          </TabsList>

          {submitResult && (
            <Alert 
              className={`mt-4 ${submitResult.type === 'success' ? 'border-green-200 dark:border-green-800' : ''}`}
              variant={submitResult.type === 'error' ? 'destructive' : 'default'}
            >
              {submitResult.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription className={submitResult.type === 'success' ? 'text-green-700 dark:text-green-300' : ''}>
                {submitResult.message}
              </AlertDescription>
            </Alert>
          )}

          <TabsContent value="Diagnoses" className="mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="clinicalStatus">Clinical Status</Label>
                <Select onValueChange={(value) => setClinicalStatus(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="verificationStatus">Verification Status</Label>
                <Select onValueChange={(value) => setVerificationStatus(value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="unconfirmed">Unconfirmed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  type="text"
                  value={code || ''}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter diagnosis code"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  type="text"
                  value={description || ''}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter diagnosis description"
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handleDiagnosisSubmission}
                disabled={isSubmittingDiagnosis || !clinicalStatus || !verificationStatus || !code || !description}
                className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-lg"
              >
                {isSubmittingDiagnosis ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Upload Diagnosis
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="Prescription" className="mt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="medicationCode">Code</Label>
                <Input
                  id="medicationCode"
                  type="text"
                  value={medicationCode || ''}
                  onChange={(e) => setMedicationCode(e.target.value)}
                  placeholder="Enter medication code"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="medicationName">Description</Label>
                <Input
                  id="medicationName"
                  type="text"
                  value={medicationName || ''}
                  onChange={(e) => setMedicationName(e.target.value)}
                  placeholder="Enter medication description"
                  className="mt-1"
                />
              </div>

              <Button
                onClick={handlePrescriptionSubmission}
                disabled={isSubmittingPrescription || !medicationCode || !medicationName}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 shadow-lg"
              >
                {isSubmittingPrescription ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Pill className="mr-2 h-4 w-4" />
                    Upload Medication
                  </>
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default AddPatientData