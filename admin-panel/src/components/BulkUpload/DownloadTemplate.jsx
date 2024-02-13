import React from "react";
import { useState } from "react";
import axios from "axios";

const DownloadTemplate = () => {
  const [categoryType, setCategoryType] = useState("");
  const [loading, setLoading] = useState(false);

  const generateExcelTemplate = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `https://sellify-backend.onrender.com/generate-excel/${categoryType}`,
        {
          responseType: "arraybuffer",
        }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "excel_template.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setLoading(false);
    } catch (error) {
      console.error("Error generating Excel template:", error.message);
      setLoading(false);
    }
  };
  return (
    <div>
      <label>
        Category Type:
        <select
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="tablet">Tablet</option>
          <option value="watch">Watch</option>
          <option value="mobile">Mobile</option>
        </select>
      </label>
      <button onClick={generateExcelTemplate} disabled={loading}>
        {loading ? "Generating..." : "Generate Excel Template"}
      </button>
    </div>
  );
};

export default DownloadTemplate;
