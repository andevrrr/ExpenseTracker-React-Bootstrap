import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUploader from "../components/FileUploader";
import { Modal, Button } from "react-bootstrap";

const WelcomePage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onFileUpload = (uploadedFile) => {
    const categorizedData = [];
    navigate("/");
  };

  const onFileUploadError = (message) => {
    setErrorMessage(message);
    setShowErrorModal(true);
    setIsLoading(false);
  };

  const onFileUploadStart = () => {
    setIsLoading(true);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      {isLoading ? (
        <div className="text-center">
          <h3>Please wait, AI is analyzing your data...</h3>
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="text-center p-4 bg-white rounded-lg shadow">
          <h1 className="h3 mb-3 font-weight-bold primary-color">
            Hello, Welcome!
          </h1>
          <p>Please upload your bank statement file.</p>
          <FileUploader
            onFileSelectSuccess={onFileUpload}
            onFileSelectError={onFileUploadError}
            onFileUploadStart={onFileUploadStart}
          />
        </div>
      )}

      <Modal
        size="md"
        show={showErrorModal}
        onHide={() => setShowErrorModal(false)}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Upload Error
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            The file format is not supported. Please ensure your file is in .csv
            format and try again.
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default WelcomePage;
