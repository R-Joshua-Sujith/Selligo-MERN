import React, { useState } from "react";
import axios from "axios";

const GenerateTemplate = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
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
        "http://localhost:5000/api/products/bulk-upload",
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

  const handleBulkDownload = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/products/bulk-download/watch",
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "bulk_download.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Bulk Upload</h2>
      <input type="file" name="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <br />
      <br />
      <button onClick={handleBulkDownload}>Download Entire Product Data</button>
    </div>
  );
};

export default GenerateTemplate;
