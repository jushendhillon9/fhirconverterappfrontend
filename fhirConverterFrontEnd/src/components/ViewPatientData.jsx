import React, {useState, useEffect} from 'react'
import "./ViewPatientData.css"

function ViewPatientData({projectId, region, datasetName, fhirStoreName, patientId}) {
  const [selected, setSelected] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [allergies, setAllergies] = useState([]);


  const handleSelection = (event) => {
    setSelected(event.target.value)
  }

  const fetchConditions = (() => {
    const requestedResource = "Conditions";
    const formData = new FormData();
    formData.append("patientId", patientId)
    formData.append("requestedResource", requestedResource)
    formData.append("projectId", projectId)
    formData.append("region", region)
    formData.append("datasetName", datasetName)
    formData.append("fhirStoreName", fhirStoreName)
    fetch("http://localhost:8080/api/get-conditions", {
        method: "POST",
        body: formData
    })
    .then((response) => response.json())
    .then((data) => {
        const conditionsArray = [];
        for (let i = 0; i < data.entry.length; i++) {
            if (data.entry[i].resource.code.text) {
                conditionsArray.push(data.entry[i].resource.code.text);
            }
            if (data.entry[i].resource.note) {
                conditionsArray.push(data.entry[i].resource.note[0].text);
            }
        }
        setConditions(conditionsArray);
        if (conditionsArray.length == 0) {
            setConditions(["None"]);
        }
    })
  })
  //retrieve patient data on load of component, Conditions

  const fetchAllergies = (() => {
    const requestedResource = "AllergyIntolerances";
    const formData = new FormData();
    formData.append("patientId", patientId)
    formData.append("requestedResource", requestedResource)
    formData.append("projectId", projectId)
    formData.append("region", region)
    formData.append("datasetName", datasetName)
    formData.append("fhirStoreName", fhirStoreName)
    fetch("http://localhost:8080/api/get-conditions", {
        method: "POST",
        body: formData
    })
    .then((response) => response.json())
    .then((data) => {
        const allergiesArray = [];
        for (let i = 0; i < data.entry.length; i++) {
            if (data.entry[i].resource.code.text) {
                allergiesArray.push(data.entry[i].resource.code.text);
            }
        }
        setAllergies(allergiesArray);
        if (allergiesArray.length == 0) {
            setAllergies(["None"]);
        }
    })
  })
  //retrieve patient data on load of component, Allergies

  const handleDiagnosesClick = (event) => {
    fetchConditions();
    handleSelection(event);
  }

  const handleAllergiesClick = () => {
    fetchAllergies();
    handleSelection(event);
  }

  return (
    <div className = "patientDataWrapper">
        <div className = "patientDataHeader">View Patient Data</div>
        <div className = "viewOptions">
        <button
            onClick = {handleDiagnosesClick} 
            value = "Diagnoses" 
            className={selected === "Diagnoses" ? "conditionsButtonSelected" : "conditionsButton"}
        >
            Diagnoses
        </button>
        <button
            onClick = {handleAllergiesClick}
            value = "Allergies" 
            className = {selected === "Allergies" ? "allergiesButtonSelected" : "allergiesButton"}
        >
            Allergies
        </button>
        </div>
        {selected === "Diagnoses" && (
            <div className="conditionsList">
                {conditions.map((condition, index) => (
                    <React.Fragment key={`condition-${index}`}>
                    <div className="linebreak"></div>
                    <li key={index} className="conditionItem">
                        {condition}
                    </li>
                    </React.Fragment>
                ))}
            </div>
        )
        }
        {selected === "Allergies" && (
            <div className="allergiesList">
                {allergies.map((allergy, index) => (
                    <React.Fragment key={`allergy-${index}`}>
                    <div className="linebreak"></div>
                    <li key={index} className="allergiesItem">
                        {allergy}
                    </li>
                    </React.Fragment>
                ))}
            </div>
        )
        }
    </div>
  )
}

export default ViewPatientData