import React, {useState, useEffect} from 'react';
import fileIcon from '../assets/fileIcon.png';
import downloadIcon from '../assets/downloadIcon.png'
import arrow from '../assets/Arrow.webp'
import "./DragAndDrop.css"

function DragAndDrop() {
    const [file, setFile] = useState(null);
    const [statusCode, setStatusCode] = useState(null);
    const [uploadedStatus, setUploadedStatus] = useState(false);
    const [convertedURL, setConvertedURL] = useState("");

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    } //key and value pairs, value is the file

    const onFileUpload = () => {
        if (!file) {
            return;
        } else {
            const formData = new FormData();
            formData.append("fileToConvert", file);
            fetch("http://localhost:8080/api/convertingFile", {
                method: "POST",
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.blob(); // blob = binary large object, if response.blob() is called it makes a promise that is resolved when blob is returned, which is the file!
            })
            .then(blob => {
                // Create a temporary link to trigger download
                setUploadedStatus(true); //if the response was successful, set the uploaded status to true
                setConvertedURL(URL.createObjectURL(blob));
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
        }
    };

    const downloadFile = (event) => { 
        event.preventDefault();
    
        // Ensure convertedURL is not empty
        if (!convertedURL) {
            console.error('Converted URL is empty. File has not been converted yet.');
            return;
        }
    
        // Create a downloadable link
        const downloadLink = document.createElement('a');
        downloadLink.href = convertedURL;
    
        // Specify the default file name, necessary
        downloadLink.download = 'convertedResource.json';
    
        // Append the link to the DOM
        document.body.appendChild(downloadLink);
        // Programmatically click the link to start the download
        downloadLink.click();
    
        // Clean up by removing the link from the DOM
        document.body.removeChild(downloadLink);
    }
    
    

    useEffect(() => {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            fetch("http://localhost:8080/api/uploadingFile", {
                method: "POST",
                body: formData
            }).then(response => {
                if (response.ok) {
                    setStatusCode(200);
                } else {
                    setStatusCode(400);
                }
            return response.text();  // or response.json() if your API returns JSON
        }).then(data => {
            console.log(data);
        }).catch(error => {
            console.error('Error:', error);
        });
        }
    }, [file])
    

    return (
        <div className="drop-area">
            <div className = "linebreak"></div>
            <div className = "secondWrapper">
                <div className = "headerOne">
                    <h2>Convert individual files here</h2>
                </div>
                <div className = "linebreak"></div>
                <div className = "fileBox">
                    <input className = "fileInput" type = "file" name = "image" onChange = {onFileChange}/>
                    <div className = "linebreak"></div>
                    {statusCode === 200 && <button className = "convertButton" onClick = {onFileUpload}>Convert</button>}
                    {statusCode === 200 && <div className = "linebreak"></div>}
                </div>
            </div>
            {uploadedStatus === true  && 
                <div className = "convertedFileWrapper">
                    {uploadedStatus === true && <img src={arrow} className="arrow2" alt="JSON logo" /> }
                    <div className = "viewFile">
                        <h1>View File</h1>
                        <a href = {convertedURL}>
                        <img className = "fileIcon" src = {fileIcon}></img>
                        </a>
                    </div>
                    <div className = "downloadFile">
                        <h1>Download File</h1>
                        <div onClick = {downloadFile}>
                            <img className = "downloadIcon" src = {downloadIcon} alt = "Download"></img>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default DragAndDrop;