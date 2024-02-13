import React, { useState } from "react";
import axios from "axios";

const ExcelUploadForm = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please choose a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "https://sellify-backend.onrender.com/upload",
        formData
      );

      if (response.status === 200) {
        alert("File uploaded successfully!");
      } else {
        alert("File upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(
        "https://sellify-backend.onrender.com/download"
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "items.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading Excel file:", error);
    }
  };

  return (
    <div>
      <h1>Excel Upload Form</h1>
      <input type="file" onChange={handleFileChange} accept=".xlsx, .xls" />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleDownload}>Download Excel</button>
    </div>
  );
};

export default ExcelUploadForm;
