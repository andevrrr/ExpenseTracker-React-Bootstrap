import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onFileUpload = (uploadedFile) => {
    setFile(uploadedFile);
    const categorizedData = [];
    navigate("/main", { state: { categorizedData } });
  };

  const onFileUploadError = (errorMessage) => {
    console.error(errorMessage);
    setIsLoading(false);
  };

  const onFileUploadStart = () => {
    setIsLoading(true);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {isLoading ? (
        <div className="text-center my-4">
          <h3 className="mb-4">Please wait, AI is analyzing your data...</h3>{" "}
          <div
            className="spinner-border text-success"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-xl">
          <p className="text-lg md:text-2xl lg:text-3xl font-bold text-green-600 mb-4">
            Hello, Welcome!
          </p>
          <p className="text-sm md:text-base lg:text-lg text-gray-600 mb-6">
            Please upload your bank statement file.
          </p>
          <FileUploader
            onFileSelectSuccess={onFileUpload}
            onFileSelectError={onFileUploadError}
            onFileUploadStart={onFileUploadStart}
          />
        </div>
      )}
    </div>
  );
};

export default WelcomePage;
