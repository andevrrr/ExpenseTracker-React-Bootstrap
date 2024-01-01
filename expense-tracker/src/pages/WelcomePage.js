import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";

const WelcomePage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);

    const onFileUpload = (uploadedFile) => {
        setFile(uploadedFile);
        // Process the file here (e.g., sending it to the backend)
        navigate('/main'); // Redirect to MainPage after processing
    };

    const onFileUploadError = (errorMessage) => {
        // Handle the error case
        console.error(errorMessage);
    };

    return (
        <div>
            <p>Hello, Welcome! Please upload your bank statement file.</p>
            <FileUploader
                onFileSelectSuccess={onFileUpload}
                onFileSelectError={onFileUploadError}
            />
        </div>
    );
};

export default WelcomePage;
