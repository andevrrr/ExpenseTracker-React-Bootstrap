import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const onFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    const categorizedData = [];
    navigate("/main", { state: { categorizedData } }); // Redirect to MainPage after processing
  };

  const onFileUploadError = (errorMessage) => {
    console.error(errorMessage);
  };

  return (
    <div class="flex justify-center items-center h-screen bg-gray-100">
      <div class="text-center p-8 bg-white rounded-lg shadow-xl">
        <p class="text-lg md:text-2xl lg:text-3xl font-bold text-green-600 mb-4">
          Hello, Welcome!
        </p>
        <p class="text-sm md:text-base lg:text-lg text-gray-600 mb-6">
          Please upload your bank statement file.
        </p>
        <FileUploader
          onFileSelectSuccess={onFileUpload}
          onFileSelectError={onFileUploadError}
        />
      </div>
    </div>
  );
};

export default WelcomePage;
