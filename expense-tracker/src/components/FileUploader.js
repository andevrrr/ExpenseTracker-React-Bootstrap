import React, { useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

const FileUploader = ({
  onFileSelectSuccess,
  onFileSelectError,
  onFileUploadStart,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleFileUpload = () => {
    if (selectedFile) {
      onFileUploadStart();
      const formData = new FormData();
      formData.append("file", selectedFile);
      axios
        .post("http://localhost:3000/upload", formData, {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          onFileSelectSuccess(selectedFile);
        })
        .catch((error) => {
          const errorResponseMessage = error.response
            ? error.response.data
            : error.message;
          onFileSelectError(errorResponseMessage);
        });
    }
  };

  return (
    <div className="d-flex flex-column align-items-center justify-content-center p-2">
      <input
        type="file"
        onChange={handleFileChange}
        className="mb-4 file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100"
      />
      <Button
        onClick={handleFileUpload}
        className="btn-sm btn-success primary-background-color"
        style={{ borderColor: "#48bb78" }}
      >
        Upload
      </Button>
    </div>
  );
};

export default FileUploader;
