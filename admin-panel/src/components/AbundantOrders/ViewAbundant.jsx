import React from "react";
import Navigation from "../RepeatableComponents/Navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate, useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Pagination } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { PDFDocument } from "pdf-lib";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ViewOrder.css";

const ViewAbundant = () => {
  const params = new URLSearchParams(window.location.search);
  const initialPage = parseInt(params.get("page"), 10) || 1;
  const initialSize = parseInt(params.get("pageSize"), 10) || 10;
  const navigate = useNavigate();

  const [dateRange, setDateRange] = useState([null, null]);

  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialSize);
  const [totalRows, setTotalRows] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [IMEINumber, setIMEINumber] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [statusLoading, setStatusLoading] = useState(false);
  const [completeLoading, setCompleteLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [fileInputs, setFileInputs] = useState({
    deviceBill: null,
    idCard: null,
    deviceImage: null,
  });
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const updateUrl = ({ page, pageSize }) => {
    const newUrl = `?page=${page}&pageSize=${pageSize}`;
    window.history.pushState({}, "", newUrl);
  };

  useEffect(() => {
    // Read pagination data from URL on component mount
    const params = new URLSearchParams(window.location.search);
    const page = parseInt(params.get("page"), 10) || 1;
    const size = parseInt(params.get("pageSize"), 10) || 10;

    setCurrentPage(page);
    setPageSize(size);
  }, [window.location.search]);

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
    setCurrentPage(1);
    updateUrl({ page: 1, pageSize: newPageSize }); // Reset to page 1 when changing page size
  };

  const fetchData = async () => {
    try {
      const startDate = dateRange[0] ? `&startDate=${dateRange[0]}` : "";
      const endDate = dateRange[1] ? `&endDate=${dateRange[1]}` : "";

      const response = await axios.get(
        `http://api.selligo.in/abundant/get-all-orders?page=${currentPage}&pageSize=${pageSize}&search=${searchQuery}${startDate}${endDate}`
      );

      setData(response.data.data);
      setTotalRows(response.data.totalRows);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize, searchQuery, dateRange]);

  const handleModalOpen = (orderId) => {
    setSelectedOrderId(orderId); // Set the selected order's ID
    setModalOpen(true);
  };

  const handleModalClose = () => setModalOpen(false);

  const columns = [
    {
      field: "phone",
      headerName: "Phone",
      width: 150,
    },
    {
      field: "city",
      headerName: "City",
      width: 150,
    },
    {
      field: "productDetails.productName",
      headerName: "Device",
      width: 250,
      valueGetter: (params) => params.row.productDetails?.productName || "",
    },
    {
      field: "productDetails.price",
      headerName: "Price",
      width: 150,
      valueGetter: (params) => params.row.productDetails?.price || "",
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: 150,
      valueGetter: (params) => params.row?.status || "",
      renderCell: (params) => (
        <div className="icon-container">
          <button>Cancel</button>
        </div>
      ),
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
        </div>
      ),
    },
  ];

  const [orderDetailsModalOpen, setOrderDetailsModalOpen] =
    React.useState(false);
  const handleOrderDetailsModalOpen = () => setOrderDetailsModalOpen(true);
  const handleOrderDetailsModalClose = () => setOrderDetailsModalOpen(false);

  const [cancelOrderModalOpen, setCancelOrderModalOpen] = React.useState(false);
  const handleCancelOrderModalOpen = (orderId) => {
    setSelectedOrderId(orderId);
    setCancellationReason(""); // Reset the cancellation reason
    setCancelOrderModalOpen(true);
  };

  const handleCancelOrderModalClose = () => setCancelOrderModalOpen(false);
  const [cancellationReason, setCancellationReason] = useState("");

  const handleStatusChange = async (status) => {
    console.log("Selected Status:", status);

    if (status === "processing" && selectedOrderId) {
      try {
        setStatusLoading(true);
        // Send a PUT request to update the order status to 'processing'
        await axios.put(
          `http://api.selligo.in/order/api/orders/${selectedOrderId}/processing`
        );

        // Fetch updated data after the status change
        fetchData();

        // Close the modal
        handleModalClose();
        setStatusLoading(false);
      } catch (error) {
        setStatusLoading(false);
        console.error("Error updating status:", error);
      }
    } else if (status === "complete") {
      // Open "Order Details" modal
      handleOrderDetailsModalOpen();
    } else if (status === "cancel" && selectedOrderId) {
      // Open "Cancel Order" modal
      handleCancelOrderModalOpen(selectedOrderId);
    } else {
      // Additional logic for other status changes
      // ...
    }
    handleModalClose();
  };

  const handleCancelOrder = async () => {
    if (cancellationReason === "") {
      toast.warning("Please enter  a cancellation reason");
      return;
    }
    try {
      setCancelLoading(true);
      // Send a PUT request to update the order status to 'cancel' and provide the cancellation reason
      await axios.put(`http://api.selligo.in/order/${selectedOrderId}/cancel`, {
        cancellationReason,
      });

      // Fetch updated data after the status change
      fetchData();
      setCancelLoading(false);
      // Close the modal
      handleCancelOrderModalClose();
    } catch (error) {
      setCancelLoading(false);
      console.error("Error canceling order:", error);
      console.log(selectedOrderId);
    }
  };

  const handleFileInputChange = (name, event) => {
    const file = event.target.files[0];
    setFileInputs((prevInputs) => ({
      ...prevInputs,
      [name]: file,
    }));
  };
  const handleCompleteOrder = async () => {
    if (finalPrice === "") {
      toast.warning("Please fill final price");
      return;
    }
    if (IMEINumber === "") {
      toast.warning("Please fill the imei number");
      return;
    }

    if (
      !fileInputs.deviceBill ||
      !fileInputs.idCard ||
      !fileInputs.deviceImage
    ) {
      toast.warning("Please upload all required files");
      return;
    }

    const validateFileExtension = (file, allowedExtensions) => {
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (typeof allowedExtensions === "string") {
        return fileExtension === allowedExtensions.toLowerCase();
      } else if (Array.isArray(allowedExtensions)) {
        return allowedExtensions.includes(fileExtension);
      }

      return false;
    };
    const validateFileSize = (file, maxSizeInKB) => {
      return file && file.size <= maxSizeInKB * 1024; // Convert KB to bytes
    };

    const allowedImageExtensions = ["jpg", "jpeg", "png"];

    if (!validateFileExtension(fileInputs.deviceBill, allowedImageExtensions)) {
      toast.warning("Device bill image must be a JPG, JPEG, or PNG file");
      return;
    }
    if (!validateFileExtension(fileInputs.idCard, allowedImageExtensions)) {
      toast.warning("ID card image must be a JPG, JPEG, or PNG file");
      return;
    }
    if (
      !validateFileExtension(fileInputs.deviceImage, allowedImageExtensions)
    ) {
      toast.warning("Device image must be a JPG, JPEG, or PNG file");
      return;
    }

    if (!validateFileSize(fileInputs.deviceBill, 200)) {
      toast.warning("Device bill image size exceeds 200KB");
      return;
    }
    if (!validateFileSize(fileInputs.idCard, 200)) {
      toast.warning("ID card image size exceeds 200KB");
      return;
    }
    if (!validateFileSize(fileInputs.deviceImage, 200)) {
      toast.warning("Device image size exceeds 200KB");
      return;
    }
    // Check if all required files are uploaded

    // Create a FormData object to send the file data
    const formData = new FormData();
    formData.append("imeiNumber", IMEINumber); // Replace with actual values
    formData.append("finalPrice", finalPrice); //
    formData.append("deviceBill", fileInputs.deviceBill);
    formData.append("idCard", fileInputs.idCard);
    formData.append("deviceImage", fileInputs.deviceImage);

    try {
      setCompleteLoading(true);
      // Send a POST request to complete the order with file data
      await axios.put(
        `http://api.selligo.in/order/api/orders/${selectedOrderId}/complete`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Set content type to multipart/form-data
          },
        }
      );
      setIMEINumber("");
      setFinalPrice("");
      setFileInputs({
        deviceBill: null,
        idCard: null,
        deviceImage: null,
      });

      // Fetch updated data after completing the order
      fetchData();
      setCompleteLoading(false);
      toast.success("Order completed successfully!");
      handleOrderDetailsModalClose();
    } catch (error) {
      setCompleteLoading(false);
      console.error("Error completing order:", error);
    }
  };

  const [loading, setLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "blue";
      case "cancelled":
        return "red";
      case "complete":
        return "green";
      case "processing":
        return "orange";

      default:
        return "white"; // Set a default color or choose another color
    }
  };

  const exportDataToExcel = async () => {
    const startDate = dateRange[0] ? `&startDate=${dateRange[0]}` : "";
    const endDate = dateRange[1] ? `&endDate=${dateRange[1]}` : "";
    try {
      setExportLoading(true);
      const response = await axios.get(
        `http://api.selligo.in/order/get-all-orders?page=1&pageSize=${totalRows}&search=${searchQuery}${startDate}${endDate}`
      );

      const ordersData = response.data.data;
      console.log(ordersData);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Orders");

      worksheet.columns = [
        { header: "Order ID", key: "orderID", width: 15 },
        { header: "Customer Name", key: "firstName", width: 20 },
        { header: "Phone", key: "phone", width: 20 },
        { header: "Email", key: "email", width: 20 },
        {
          header: "Product",
          key: "productDetails.productName",
          width: 20,
        },
        { header: "Price", key: "productDetails.price", width: 20 },
        { header: "Pin Code", key: "zipCode", width: 20 },
        { header: "city", key: "city", width: 20 },
        { header: "Pickup Date", key: "scheduledPickup.pickupDate", width: 20 },
        { header: "Pickup Time", key: "scheduledPickup.pickupTime", width: 20 },
        // ... add other columns based on your data structure
      ];

      worksheet.addRows(
        ordersData.map((order) => ({
          orderID: order.orderID,
          firstName: order.firstName,
          phone: order.phone,
          email: order.email,
          "productDetails.productName": order.productDetails?.productName || "",
          "productDetails.price": order.productDetails?.price || "",
          zipCode: order.zipCode,
          city: order.city,
          "scheduledPickup.pickupDate": order.scheduledPickup?.pickupDate || "",
          "scheduledPickup.pickupTime": order.scheduledPickup?.pickupTime || "",
          // ... add other properties based on your data structure
        }))
      );

      const blob = await workbook.xlsx.writeBuffer();

      // Create a Blob object from the blob array
      const blobObject = new Blob([blob], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      // Save the blob as a file
      saveAs(blobObject, "orders.xlsx");
      setExportLoading(false);

      // Create a worksheet
    } catch (error) {
      setExportLoading(false);
      console.error("Error exporting data:", error);
    }
  };

  return (
    <div className="view-orders-container">
      <Navigation />
      <div className="view-order-sub-container">
        <h1 className="view-heading">Abandoned Orders Section</h1>
        <div>
          <div className="view-order-header-container">
            <TextField
              size="small"
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
              style={{ marginBottom: "16px", marginRight: "50px" }}
            />
            <div>
              <input
                className="order-Date"
                type="date"
                label="Start Date"
                value={dateRange[0] || ""}
                onChange={(e) => {
                  setCurrentPage(1);
                  setDateRange([e.target.value, dateRange[1]]);
                }}
                style={{ marginRight: "8px", fontSize: "14px" }}
              />

              <input
                className="order-Date"
                type="date"
                label="End Date"
                value={dateRange[1] || ""}
                onChange={(e) => {
                  setCurrentPage(1);
                  setDateRange([dateRange[0], e.target.value]);
                }}
                style={{ fontSize: "14px" }}
              />
              {/* <Button
                variant="contained"
                onClick={exportDataToExcel}
                disabled={exportLoading}
                size="small"
                sx={{ backgroundColor: "#5644c4", ml: 2 }}
              >
                {exportLoading ? "Loading..." : "Export Data"}
              </Button> */}
            </div>
          </div>

          <div className="table-order-container">
            <table className="responsive-order-table">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.field}
                      sx={{
                        fontSize: 12,
                        padding: 1, // Adjust the font size as needed
                      }}
                    >
                      {column.headerName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row._id}>
                    <td>{row.phone}</td>
                    <td>{row?.city || ""}</td>
                    <td>{row.productDetails?.productName || ""}</td>
                    <td>{row.productDetails?.price || ""}</td>

                    <td>
                      {new Date(row?.createdAt).toLocaleDateString() || ""}
                    </td>

                    <td
                      sx={{
                        fontSize: 12,
                        padding: 1, // Adjust the font size as needed
                      }}
                    >
                      <div>
                        <VisibilityIcon
                          sx={{
                            height: "18px", // Adjust the height as needed
                          }}
                          onClick={() => {
                            navigate(
                              `/view-abundant-order/${row._id}/${row.phone}`
                            );
                          }}
                        />
                      </div>
                    </td>
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
      </div>
      <Modal open={modalOpen} onClose={handleModalClose}>
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
          <Typography variant="h6" gutterBottom>
            Change Status
          </Typography>
          {!statusLoading ? (
            <Button
              variant="contained"
              size="small"
              onClick={() => handleStatusChange("processing")}
            >
              Processing
            </Button>
          ) : (
            ""
          )}

          {!statusLoading ? (
            <Button
              variant="contained"
              size="small"
              sx={{ ml: 1 }}
              onClick={() => handleStatusChange("complete")}
            >
              Complete
            </Button>
          ) : (
            ""
          )}

          {!statusLoading ? (
            <Button
              variant="contained"
              size="small"
              sx={{ ml: 1 }}
              onClick={() => handleStatusChange("cancel")}
            >
              Cancel
            </Button>
          ) : (
            ""
          )}

          {statusLoading ? (
            <Button disabled variant="contained" size="small" sx={{ ml: 1 }}>
              Loading....
            </Button>
          ) : (
            ""
          )}
        </Box>
      </Modal>

      <Modal
        open={orderDetailsModalOpen}
        onClose={handleOrderDetailsModalClose}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 8,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <TextField
            label="Final Price"
            fullWidth
            margin="normal"
            value={finalPrice}
            onChange={(e) => {
              setFinalPrice(e.target.value);
            }}
          />
          <TextField
            label="IMEI Number"
            fullWidth
            margin="normal"
            value={IMEINumber}
            onChange={(e) => {
              setIMEINumber(e.target.value);
            }}
          />
          <div style={{ margin: "16px 0" }}>
            <label htmlFor="deviceBill" style={{ marginRight: "8px" }}>
              Device Bill:
            </label>
            <input
              type="file"
              id="deviceBill"
              accept=".pdf, .jpg, .png"
              onChange={(e) => handleFileInputChange("deviceBill", e)}
              style={{ marginBottom: "8px" }}
            />
          </div>
          <div style={{ margin: "16px 0" }}>
            <label htmlFor="idCard" style={{ marginRight: "8px" }}>
              ID Card:
            </label>
            <input
              type="file"
              id="idCard"
              accept=".pdf, .jpg, .png"
              onChange={(e) => handleFileInputChange("idCard", e)}
              style={{ marginBottom: "8px" }}
            />
          </div>
          <div style={{ margin: "16px 0" }}>
            <label htmlFor="deviceImage" style={{ marginRight: "8px" }}>
              Device Image:
            </label>
            <input
              type="file"
              id="deviceImage"
              accept=".pdf, .jpg, .png"
              onChange={(e) => handleFileInputChange("deviceImage", e)}
              style={{ marginBottom: "16px" }}
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCompleteOrder}
            style={{ marginRight: "8px" }}
            disabled={completeLoading}
          >
            {completeLoading ? "Loading..." : "Save"}
          </Button>
          <Button
            variant="contained"
            onClick={handleOrderDetailsModalClose}
            disabled={completeLoading}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
      <Modal open={cancelOrderModalOpen} onClose={handleCancelOrderModalClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "white",
            boxShadow: 24,
            p: 4,
            borderRadius: 8,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Cancel Order
          </Typography>
          <TextField
            label="Cancellation Reason"
            multiline
            rows={4}
            fullWidth
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            margin="normal"
          />
          <Button
            disabled={cancelLoading}
            variant="contained"
            color="primary"
            onClick={handleCancelOrder}
            style={{ marginRight: "8px" }}
          >
            {cancelLoading ? "Loading..." : "Cancel Order"}
          </Button>

          <Button
            variant="contained"
            onClick={handleCancelOrderModalClose}
            disabled={cancelLoading}
          >
            Close
          </Button>
        </Box>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default ViewAbundant;
