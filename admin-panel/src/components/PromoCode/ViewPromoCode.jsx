import React from "react";
import Navigation from "../RepeatableComponents/Navigation";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import "./ViewPromoCode.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Pagination } from "@mui/material";
import { Modal, Typography } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";

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

const ViewPromoCode = () => {
  const navigate = useNavigate("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalRows, setTotalRows] = useState(0);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    categoryId: null,
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        `https://sellify-backend.onrender.com/promo/get-all-promocode?page=${currentPage}&pageSize=${pageSize}`
      );
      console.log(response.data);
      setData(response.data.data);
      setTotalRows(response.data.totalRows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };
  const handlePageSizeSelectChange = (event) => {
    const newPageSize = parseInt(event.target.value, 10);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to page 1 when changing page size
  };

  const columns = [
    {
      field: "code",
      headerName: "Promo Code",
      width: 150,
    },
    {
      field: "discountAmount",
      headerName: "Price",
      width: 150,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => (
        <div className="icon-container">
          <VisibilityIcon
          // onClick={() => {
          //   navigate(`/view-product/${params.row._id}`);
          // }}
          />
          <EditIcon
            onClick={() => {
              navigate(`/edit-pincode/${params.row._id}`);
            }}
          />
          <DeleteIcon
            onClick={() => {
              deletePincode(params.row._id);
            }}
          />
        </div>
      ),
    },
  ];

  const deletePincode = (id) => {
    setDeleteConfirmation({ isOpen: true, pincodeId: id });
  };

  const confirmDelete = async () => {
    try {
      const id = deleteConfirmation.pincodeId;
      await axios
        .delete(
          `https://sellify-backend.onrender.com/promo/delete/promocode/${id}`
        )
        .then((res) => {
          toast.info(res.data.message);
          setDeleteConfirmation({ isOpen: false, pincodeId: null });
          fetchData();
        });
    } catch (err) {
      setDeleteConfirmation({ isOpen: false, pincodeId: null });
      toast.error(err.response.data.error);
    }
  };

  return (
    <div className="view-promocode-main-container">
      <Navigation />
      <div className="view-pincode-sub-container">
        <h1 className="view-heading">Promo Code Section</h1>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            navigate("/add-promo-code");
          }}
          sx={{
            mr: 2,
            mb: 2,
            backgroundColor: "#5644c4",
            padding: 1,
            fontSize: 10,
            "&:hover": {
              backgroundColor: "white",
              color: "#5644c4",
            },
          }}
        >
          Create new entry
        </Button>
        <div>
          <div className="table-product-container">
            <table className="responsive-product-table">
              <thead>
                {columns.map((column) => (
                  <th
                    key={column.field}
                    sx={{
                      fontSize: 14, // Adjust the font size as needed
                    }}
                  >
                    {column.headerName}
                  </th>
                ))}
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row._id}>
                    <td>{row.code}</td>
                    <td>{row.discountAmount}</td>

                    <td>
                      <div className="icon-container">
                        {/* <VisibilityIcon /> */}
                        <EditIcon
                          onClick={() => {
                            navigate(`/edit-promo-code/${row._id}`);
                          }}
                        />
                        <DeleteIcon
                          // onClick={async () => {
                          //   await axios
                          //     .delete(
                          //       `https://sellify-backend.onrender.com/delete-pincode/${row._id}`
                          //     )
                          //     .then((res) => {
                          //       toast.info("Deleted Successfully");
                          //       fetchData();
                          //     })
                          //     .catch((err) => {
                          //       alert("Server Error");
                          //     });
                          // }}
                          onClick={() => {
                            deletePincode(row._id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={25}>25</MenuItem>
              <MenuItem value={100}>100</MenuItem>
            </Select>
            <br />
            <span>Total Items {totalRows}</span>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        handleClose={() =>
          setDeleteConfirmation({ isOpen: false, pincodeId: null })
        }
        handleDelete={confirmDelete}
      />
      <ToastContainer />
    </div>
  );
};

export default ViewPromoCode;
