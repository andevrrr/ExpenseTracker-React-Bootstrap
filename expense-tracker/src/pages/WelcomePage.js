import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import { Modal, Button } from "react-bootstrap";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const onFileUpload = (uploadedFile) => {
    const categorizedData = [];
    navigate("/main", { state: { categorizedData } });
  };

  const onFileUploadError = (message) => {
    setShowErrorModal(true);
    setIsLoading(false);
  };

  const onFileUploadStart = () => {
    setIsLoading(true);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      {isLoading ? (
        <div className="text-center my-4">
          <h3 className="mb-4">Please wait, AI is analyzing your data...</h3>
          <div
            className="spinner-border text-success"
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

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          The file format is not supported. Please ensure your file is in .csv
          format and try again.
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default WelcomePage;
