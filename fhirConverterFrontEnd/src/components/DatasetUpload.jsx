import React, {useContext, useState} from 'react'
import { ConvertedContext } from '../Contexts/ConvertedContext';
import { FileContext } from '../Contexts/FileContext';
import "./DatasetUpload.css"

function DatasetUpload() {
    const {isConverted} = useContext(ConvertedContext);
    const [projectID, setProjectID] = useState("");
    const [region, setRegion] = useState("");
    const [datasetName, setDatasetName] = useState("");
    const [storeName, setStoreName] = useState("")
    const {file} = useContext(FileContext);

    const uploadToFhirStore = () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("projectId", projectID);
        formData.append("region", region);
        formData.append("datasetName", datasetName);
        formData.append("storeName", storeName);
        fetch("http://localhost:8080/api/upload-fhir-bundle", {
            method: "POST",
            body: formData,
        }) 
        .then((response) => {
            if (response.ok) {
                alert("File successfully uploaded to your store! Thanks for using!")
            }
            else {
                alert("Failed upload, likely incorrect credentials");
            }
        })
    }

    return (
        <div>
            {isConverted && (
            <div className = "uploadToStoreWrapper">
                <div className = "headieOne">
                    Now, complete these fields to upload converted Fhir Resource to your Google FHIR Store!
                </div>
                <div className = "inputBox">
                    <div className = "inputtedWrapper">
                        <div>Project ID:</div>
                        <input 
                            className = "specificationInput"
                            value = {projectID}
                            onChange={(e) => setProjectID(e.target.value)}
                        />
                    </div>
                    <div className = "linebreak"></div>
                    <div className = "inputtedWrapper">
                        <div>Region:</div>
                        <input 
                            className = "specificationInput"
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        />
                    </div>
                    <div className = "linebreak"></div>
                    <div className = "inputtedWrapper">
                        <div>Dataset Name:</div>
                        <input 
                            className = "specificationInput"
                            value={datasetName}
                            onChange={(e)=> setDatasetName(e.target.value)}
                        />
                    </div>
                    <div className = "inputtedWrapper">
                        <div>Fhir Store Name:</div>
                        <input 
                            className = "specificationInput"
                            value={storeName}
                            onChange={(e) => setStoreName(e.target.value)}
                        />
                    </div>
                </div>
                <button className = "uploadToStoreButton" onClick = {uploadToFhirStore}>Upload to Store</button>
            </div>)}
        </div>
    )
}

export default DatasetUpload;