import React from "react";
import "./ViewUser.css";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";

import axios from "axios";
import { useState, useEffect } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Pagination } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Navigation from "../RepeatableComponents/Navigation";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const ViewUser2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRows, setTotalRows] = useState(0);
  const [categoryType, setCategoryType] = useState("");
  const [categoryType2, setCategoryType2] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  // Add this to your existing state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const updateUrl = ({ page, pageSize }) => {
    const newUrl = `?page=${page}&pageSize=${pageSize}`;
    window.history.pushState({}, "", newUrl);
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
    updateUrl({ page: 1, pageSize });
  };
  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
    updateUrl({ page: newPage, pageSize });
  };

  const handlePageSizeSelectChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to page 1 when changing page size
    updateUrl({ page: 1, pageSize: newPageSize });
  };
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://sellify-backend.onrender.com/user/get-all-userss?page=${currentPage}&pageSize=${pageSize}&search=${searchQuery}`
      );
      console.log(response.data);
      setData(response.data.data);
      setHeaders(response.data.headers);
      setTotalRows(response.data.totalRows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Read pagination data from URL on component mount
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page"), 10) || 1;
    const size = parseInt(params.get("pageSize"), 10) || 10;

    setCurrentPage(page);
    setPageSize(size);
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery]);

  const exportDataToExcel = async () => {
    try {
      setExportLoading(true);
      const response = await axios.get(
        `https://sellify-backend.onrender.com/user/get-all-users?page=1&pageSize=${totalRows}&search=${searchQuery}`
      );

      const usersData = response.data.data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders");

      worksheet.columns = [
        { header: "Email", key: "email", width: 15 },
        { header: "First Name", key: "firstName", width: 20 },
        { header: "Last Name", key: "lastName", width: 20 },
        { header: "Phone", key: "phone", width: 20 },
        {
          header: "Additional Phone",
          key: "addPhone",
          width: 20,
        },
        { header: "address", key: "address", width: 20 },
        { header: "Pin Code", key: "zipCode", width: 20 },
        { header: "city", key: "city", width: 20 },

        // ... add other columns based on your data structure
      ];

      worksheet.addRows(
        usersData.map((user) => ({
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          addPhone: user?.addPhone || "",
          address: user.address,
          zipCode: user.zipCode,
          city: user.city,
          // ... add other properties based on your data structure
        }))
      );

      const blob = await workbook.xlsx.writeBuffer();

      // Create a Blob object from the blob array
      const blobObject = new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Save the blob as a file
      saveAs(blobObject, "users.xlsx");
      setExportLoading(false);

      // Create a worksheet
    } catch (error) {
      setExportLoading(false);
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div className="view-user-container">
      <Navigation />
      <div className="view-user-sub-container">
        <h1 className="view-heading">Users Section</h1>
        <div className="view-user-header-container">
          <TextField
            size="small"
            sx={{ mt: 0 }}
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            style={{ marginBottom: "16px" }}
          />
          <Button
            size="small"
            variant="contained"
            sx={{ backgroundColor: "#5644c4" }}
            onClick={exportDataToExcel}
            disabled={exportLoading}
          >
            {exportLoading ? "Exporting" : "Export Data"}
          </Button>
        </div>

        <div className="table-container">
          <table className="responsive-table">
            <thead>
              <tr>
                {headers.map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  {headers.map((header) => (
                    <td key={header}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-container">
          <Pagination
            count={Math.ceil(totalRows / pageSize)}
            page={currentPage}
            onChange={handlePageChange}
            size="large"
            color="primary"
            showFirstButton
            showLastButton
            sx={{ mt: 2 }}
          />
          <div className="pagination-sub-container">
            {" "}
            <Select
              value={pageSize}
              onChange={handlePageSizeSelectChange}
              variant="outlined"
              style={{ marginLeft: "10px", height: "40px" }}
            >
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
            <br />
            <span>Total Items {totalRows}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUser2;
