import React, {useState} from 'react'
import ViewPatientData from "./components/ViewPatientData"
import AddPatientData from "./components/AddPatientData"
import "./PatientPage.css"

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

  return (
    <>
      <nav className="navbar">
        <div className="navbarText">FhirConverter App</div>
        <div className="linebreak"></div>
        <div className="conversionExplained">Edit & View Patient Data in Google Fhir Dataset ✏️</div>
        <div className="linebreak"></div>
      </nav>
      <div className = "projectInfoWrapper">
        <div className = "inputInstructions">Input the following fields and submit to view or add Patient data</div>
        <form className = "projectInfoForm" onSubmit={handleSubmit}>
          <div className = "projectInput">
            <label className = "projectLabel">Project ID: </label>
            <input
              className = "projectInfoInput"
              onChange = {(e) => setProjectId(e.target.value)}
            />
          </div>
          <div className = "projectInput">
            <label className = "projectLabel regionLabel">Region: </label>
            <input
              className = "projectInfoInput"
              onChange = {(e) => setRegion(e.target.value)}
            />
          </div>
          <div className = "projectInput">
            <label className = "projectLabel datasetLabel">Dataset Name: </label>
            <input
              className = "projectInfoInput"
              onChange = {(e) => setDatasetName(e.target.value)}
            />
          </div>
          <div className = "projectInput">
            <label className = "projectLabel">Fhir Store: </label>
            <input
              className = "projectInfoInput"
              onChange = {(e) => setFhirStoreName(e.target.value)}
            />
          </div>
          <div className = "projectInput">
            <label className = "projectLabel">Patient ID: </label>
            <input
              className = "projectInfoInput"
              onChange = {(e) => setPatientId(e.target.value)}
            />
          </div>
          <button
            className = "projectInfoSubmitButton"
            onClick = {handleClick}
          >
            Submit
            </button>
        </form>
      </div>
      <div className = "pageWrapper">
        {render &&
          <>
            <ViewPatientData projectId = {projectId} region = {region} datasetName = {datasetName} fhirStoreName = {fhirStoreName} patientId = {patientId}/>
            <AddPatientData projectId = {projectId} region = {region} datasetName = {datasetName} fhirStoreName = {fhirStoreName} patientId = {patientId}/>
          </>
        }
        
      </div>
    </>
  )
}

export default PatientPage;