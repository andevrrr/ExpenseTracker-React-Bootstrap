import React, { useState } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

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
    formData.append("file", selectedFile);

    axios
      .post("http://localhost:3000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        onFileSelectSuccess(selectedFile);
      })
      .catch((error) => {
        onFileSelectError(error.message);
      });
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
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
        className="btn btn-success"
        style={{ backgroundColor: "#48bb78", borderColor: "#48bb78" }}
      >
        Upload
      </Button>
    </div>
  );
};

export default FileUploader;
