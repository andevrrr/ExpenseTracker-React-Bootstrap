import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const FileUploader = ({ onFileSelectSuccess, onFileSelectError }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            onFileSelectSuccess(file);
        } else {
            onFileSelectError('Please select a file to upload');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <Button onClick={() => onFileSelectSuccess(selectedFile)}>Upload</Button>
        </div>
    );
};

export default FileUploader;
