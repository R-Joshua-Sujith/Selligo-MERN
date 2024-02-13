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
import { Modal, Typography } from "@mui/material";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DeleteConfirmationModal = ({ isOpen, handleClose, handleDelete }) => {
  return (
    <Modal open={isOpen} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="div" gutterBottom>
          Are you sure you want to delete?
        </Typography>
        <Button onClick={handleDelete} variant="contained" sx={{ mr: 2 }}>
          Yes
        </Button>
        <Button onClick={handleClose} variant="contained">
          No
        </Button>
      </Box>
    </Modal>
  );
};

const ViewUser = () => {
  const params = new URLSearchParams(window.location.search);
  const initialPage = parseInt(params.get("page"), 10) || 1;
  const initialSize = parseInt(params.get("pageSize"), 10) || 10;
  const navigate = useNavigate();
  const location = useLocation();
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [totalRows, setTotalRows] = useState(0);
  const [categoryType, setCategoryType] = useState("");
  const [categoryType2, setCategoryType2] = useState("");
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  // Add this to your existing state variables
  const [searchQuery, setSearchQuery] = useState("");
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    userId: null,
  });
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
        `http://localhost:5000/user/get-all-userss?page=${currentPage}&pageSize=${pageSize}&search=${searchQuery}`
      );
      setData(response.data.data);
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

  const columns = [
    {
      field: "email",
      headerName: "Email",
      width: 150,
    },
    {
      field: "firstName",
      headerName: "First Name",
      width: 150,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      width: 150,
    },
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "addPhone",
      headerName: "Additional Phone",
      width: 150,
    },
    {
      field: "address",
      headerName: "Address",
      width: 150,
    },
    {
      field: "zipCode",
      headerName: "Pincode",
      width: 150,
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="icon-container">
          <DeleteIcon
          // onClick={() => {
          //   navigate(`/view-product/${params.row._id}`);
          // }}
          />
        </div>
      ),
    },
  ];

  const exportDataToExcel = async () => {
    try {
      setExportLoading(true);
      const response = await axios.get(
        `http://localhost:5000/user/get-all-users?page=1&pageSize=${totalRows}&search=${searchQuery}`
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

  const deleteUser = (id) => {
    setDeleteConfirmation({ isOpen: true, userId: id });
  };

  const confirmDelete = async () => {
    try {
      const id = deleteConfirmation.userId;
      await axios
        .delete(`http://localhost:5000/user/delete/users/${id}`)
        .then((res) => {
          fetchData();
          setDeleteConfirmation({ isOpen: false, userId: null });
          toast.info(res.data.message);
        });
    } catch (err) {
      setDeleteConfirmation({ isOpen: false, userId: null });
      toast.info(err.response.data.error);
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
            sx={{ mb: 2 }}
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
          />
          <Button
            size="small"
            variant="contained"
            onClick={exportDataToExcel}
            disabled={exportLoading}
            sx={{ backgroundColor: "#5644c4", ml: 2, mt: 2 }}
          >
            {exportLoading ? "Exporting" : "Export Data"}
          </Button>
        </div>

        <Box>
          <div className="table-container">
            <table className="responsive-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column.field}>{column.headerName}</th>
                  ))}
                </tr>
              </thead>
              <TableBody>
                {data.map((row) => (
                  <tr key={row._id}>
                    <td>{row.email}</td>
                    <td>{row.firstName}</td>
                    <td>{row.lastName}</td>
                    <td>{row.phone}</td>
                    <td>{row.addPhone}</td>
                    <td>{row.address}</td>
                    <td>{row.zipCode}</td>
                    <td>{row.city}</td>
                    <td>
                      <div className="icon-container">
                        <DeleteIcon
                          sx={{
                            height: "15px", // Adjust the height as needed
                          }}
                          onClick={() => {
                            deleteUser(row._id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </TableBody>
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
        </Box>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        handleClose={() =>
          setDeleteConfirmation({ isOpen: false, userId: null })
        }
        handleDelete={confirmDelete}
      />
      <ToastContainer />
    </div>
  );
};

export default ViewUser;
