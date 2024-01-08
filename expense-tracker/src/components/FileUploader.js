import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from 'axios';

const FileUploader = ({ onFileSelectSuccess, onFileSelectError }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleFileUpload = () => {
        const formData = new FormData();
        formData.append('file', selectedFile);

        axios.post('http://localhost:3000/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            onFileSelectSuccess(selectedFile);
        })
        .catch(error => {
            onFileSelectError(error.message);
        });
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <Button onClick={handleFileUpload}>Upload</Button>
        </div>
    );
};

export default FileUploader;
