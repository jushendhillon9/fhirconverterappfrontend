import React, {useState} from 'react'
import "./AddPatientData.css"
function AddPatientData({projectId, region, datasetName, fhirStoreName, patientId}) {
  const [clinicalStatus, setClinicalStatus] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [code, setCode] = useState(null);
  const [description, setDescription] = useState(null);
  const [medicationName, setMedicationName] = useState(null);
  const [medicationCode, setMedicationCode] = useState(null);
  const [selected, setSelected] = useState("")

  const handleDiagnosisSubmission = () => {
    const formData = new FormData();
    if (!verificationStatus || !clinicalStatus || !code || !description) {
      alert("Please fill out all fields");
      return;
    }
    formData.append("projectId", projectId);
    formData.append("region", region);
    formData.append("datasetName", datasetName);
    formData.append("fhirStoreName", fhirStoreName);
    formData.append("clinicalStatus", clinicalStatus);
    formData.append("verificationStatus", verificationStatus);
    formData.append("code", code);
    formData.append("description", description);
    formData.append("patientId", patientId);
    fetch ("http://localhost:8080/api/create-condition", {
      method: "POST", 
      body: formData
    })
    .then((response) => {
      if (response.ok) {
        alert("Condition Successfully Created!")
      }
      else {
        alert("Error creating condition. Please fill out all required fields and enter valid code and description")
      }
    })
  }

  const handlePrescriptionSubmission = () => {
    const formData = new FormData();
    if (!medicationCode || !medicationName) {
      alert("Please fill out all fields");
      return;
    }
    formData.append("projectId", projectId);
    formData.append("region", region);
    formData.append("datasetName", datasetName);
    formData.append("fhirStoreName", fhirStoreName);
    formData.append("medicationName", medicationName);
    formData.append("medicationCode", medicationCode);
    formData.append("patientId", patientId)
    fetch ("http://localhost:8080/api/create-medication", {
      method: "POST", 
      body: formData
    })
    .then((response) => {
      if (response.ok) {
        alert("Condition Successfully Created!")
      }
      else {
        alert("Error creating condition. Please fill out all required fields and enter valid code and description")
      }
    })
  }

  const handleSelection = (event) => {
    setSelected(event.target.value)
  }

  return (
    <div className = "wrapperAddPatientData">
      <div className = "addPatientDataHeader">Add Patient Data</div>
      <button
            onClick = {handleSelection} 
            value = "Diagnoses" 
            className= {selected === "Diagnoses" ? "diagnosesButtonSelected" : "diagnosesButton"}
        >
            Diagnoses
      </button>
      <button
          onClick = {handleSelection}
          value = "Prescription" 
          className = {selected === "Prescription" ? "prescriptionButtonSelected" : "prescriptionsButton"}
      >
        Prescription
      </button>
      {selected === "Diagnoses" && (
        <>
          <div className = "addPatientOption">
            <label>Clinical Status:</label>
            <select 
              name="clinicalStatus"
              onChange = {(e) => setClinicalStatus(e.target.value)}
              className = "selectOption"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          <div className = "addPatientOption">
            <label>Verification Status:</label>
            <select 
              name="verificationStatus"
              onChange = {(e) => setVerificationStatus(e.target.value)}
              className = "selectOption"
            >
              <option value="">Select Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="unconfirmed">Unconfirmed</option>
            </select>
          </div>
          <div className = "addPatientOption">
            <label>Code:</label>
            <input 
              type="text" 
              name="code"
              onChange = {(e) => setCode(e.target.value)}
              className = "inputDataOption"
            />
          </div>
          <div className = "addPatientOption">
            <label>Description:</label>
            <input 
              type="text" 
              name="description"
              onChange = {(e) => setDescription(e.target.value)}
              className = "inputDataOption"
              />
          </div>
          <button
            onClick = {handleDiagnosisSubmission}
          >
            Upload Diagnosis
          </button>
        </>
      )}
      {selected === "Prescription" && (
        <>
          <div className = "addPatientOption">
            <label>Code:</label>
            <input 
              type="text" 
              name="medicationName"
              onChange = {(e) => setMedicationCode(e.target.value)}
              className = "inputDataOption"
            />
          </div>
          <div className = "addPatientOption">
            <label>Description:</label>
            <input 
              type="text" 
              name="medicationDescription"
              onChange = {(e) => setMedicationName(e.target.value)}
              className = "inputDataOption"
              />
          </div>
          <button
            onClick = {handlePrescriptionSubmission}
          >
            Upload Medication
          </button>
        </>
      )}
    </div>
  )
}

export default AddPatientData