import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./ViewCategory.css";
import { useNavigate } from "react-router-dom";
import Navigation from "../RepeatableComponents/Navigation";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { Modal, Typography } from "@mui/material";
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

const ViewCategory = () => {
  const navigate = useNavigate("");
  const [data, setData] = useState([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    categoryId: null,
  });
  const columns = [
    {
      field: "category_type",
      headerName: "Category",
      width: 200,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (params) => (
        <div className="icon-container">
          <VisibilityIcon
            onClick={() => {
              navigate(`/view-category/${params.row._id}`);
            }}
          />
          <EditIcon
            onClick={() => {
              navigate(`/edit-category/${params.row._id}`);
            }}
          />
          <DeleteIcon
            onClick={() => {
              deleteCategory(params.row._id);
            }}
          />
        </div>
      ),
    },
  ];
  const getCategoryData = async () => {
    await axios
      .get(
        "https://sellify-backend.onrender.com/category/get-all-category-types"
      ) // replace with your actual API endpoint
      .then((response) => {
        // Set the data
        setData(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    getCategoryData();
    // Fetch data and columns from your MongoDB collection
  }, []);

  const deleteCategory = (id) => {
    setDeleteConfirmation({ isOpen: true, categoryId: id });
  };

  const confirmDelete = async () => {
    try {
      const id = deleteConfirmation.categoryId;
      await axios
        .delete(
          `https://sellify-backend.onrender.com/category/delete-category/${id}`
        )
        .then((res) => {
          toast.info(res.data.message);
          getCategoryData();
          setDeleteConfirmation({ isOpen: false, categoryId: null });
        });
    } catch (err) {
      setDeleteConfirmation({ isOpen: false, categoryId: null });
      toast.error(err.response.data.error);
    }
  };

  return (
    <div className="view-category-container">
      <Navigation />
      <div className="view-categeory-sub-container">
        <div>
          <h1>Categories</h1>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              navigate("/add-category");
            }}
            sx={{
              backgroundColor: "#5644c4",
              padding: 2,
              "&:hover": {
                backgroundColor: "white",
                color: "#5644c4",
              },
            }}
          >
            Create new entry
          </Button>
        </div>

        <Box sx={{ height: 400, width: "100%", mt: 3 }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
            disableRowSelectionOnClick
            getRowId={(row) => row._id}
          />
        </Box>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        handleClose={() =>
          setDeleteConfirmation({ isOpen: false, brandId: null })
        }
        handleDelete={confirmDelete}
      />
      <ToastContainer />
    </div>
  );
};

export default ViewCategory;
