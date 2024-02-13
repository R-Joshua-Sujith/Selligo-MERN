import React, { useEffect, useState, useRef } from "react";
import "./Orders.css";
import Nav from "../repeatable-components/Nav";
import axios from "axios";
import { useSelector } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Footer from "../repeatable-components/Footer";
import Footer2 from "../repeatable-components/Footer2";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import BigLoader from "../repeatable-components/BigLoader";

const Orders = () => {
  const [orders, setOrderData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState("");
  const [orderID, setOrderID] = useState("");
  const phone = useSelector((state) => state.phone);
  const [Loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const invoiceContainerRef = useRef(null);
  const [bigLoading, setBigLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [invoiceDownloading, setInvoiceDownloading] = useState(false);

  const getOrdersData = async () => {
    setBigLoading(true);
    await axios
      .get(`https://api.selligo.in/order/user-orders/${phone}`)
      .then((res) => {
        setBigLoading(false);
        setOrderData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        setBigLoading(false);
        console.log(err);
      });
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getOrdersData();
  }, []);
  const handleCancelConfirmation = async () => {
    if (cancellationReason === "") {
      toast.warning("Please enter  a cancellation reason");
      return;
    }
    setCancelLoading(true);
    await axios
      .put(`https://api.selligo.in/order/${orderID}/cancel`, {
        cancellationReason,
      })
      .then((res) => {
        setCancelLoading(false);
        toast.success(res.data.message);
        setCancellationReason("");
        setOrderID("");
        getOrdersData();
        setShowModal(false);
      })
      .catch((err) => {
        setCancelLoading(false);
        alert("Server error");
        setCancellationReason("");
        setOrderID("");
        console.log(err);
        setShowModal(false);
      });
  };

  const handleDownloadInvoice = async (orderId) => {
    try {
      setLoading(true);
      setInvoiceDownloading(true);

      // Fetch JSON data from the backend
      const response = await fetch(
        `https://api.selligo.in/order/api/get-invoice-data/${orderId}`
      );
      const invoiceData = await response.json();
      setInvoice(invoiceData);
      console.log(invoiceData);

      setTimeout(() => {
        const element = invoiceContainerRef.current;
        html2canvas(element).then((canvas) => {
          const pdf = new jsPDF();
          pdf.addImage(
            canvas.toDataURL("image/png"),
            "PNG",
            0,
            0,
            pdf.internal.pageSize.getWidth(),
            pdf.internal.pageSize.getHeight()
          );
          pdf.save("invoice.pdf");
          setInvoiceDownloading(false);
        });
        setInvoice(null);
      }, 1000);

      setLoading(false);
    } catch (error) {
      setInvoiceDownloading(false);
      console.error("Error downloading invoice:", error);
      // Handle the error as needed
    } finally {
      setInvoiceDownloading(false);
      setLoading(false);
    }
  };

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

  return (
    <div className="orders-main-container">
      <Nav />
      <h1 className="order-heading">Your Orders</h1>
      {bigLoading ? (
        <BigLoader />
      ) : (
        <div>
          {orders.length === 0 ? (
            <h1 className="no-orders">You have not placed any orders yet</h1>
          ) : (
            <div className="orders-container">
              {orders.map((item) => (
                <div className="order">
                  <div>Order ID: {item.orderID}</div>
                  <div>Product Name : {item.productDetails.productName}</div>
                  <div>
                    {item.promoPrice > 0 ? (
                      <div>
                        Price : Rs {item.productDetails.price}+ Rs{" "}
                        {item.promoPrice}
                        <br />
                        Promo Code : {item.promoName}
                      </div>
                    ) : (
                      <div>Price: Rs {item.productDetails.price}</div>
                    )}
                  </div>

                  <div>
                    Status
                    <span
                      style={{
                        backgroundColor: getStatusColor(item.status),
                        color: "white",
                        padding: "5px",
                        marginLeft: "10px",
                        borderRadius: "10px",
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  {item.status === "new" && (
                    <button
                      className="cancel-order-btn"
                      onClick={() => {
                        setOrderID(item._id);
                        setShowModal(true);
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                  {item.status === "complete" && (
                    <button
                      disabled={invoiceDownloading}
                      className="cancel-order-btn"
                      onClick={() => {
                        handleDownloadInvoice(item._id);
                      }}
                    >
                      {invoiceDownloading ? "Downloading" : "Download Invoice"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {showModal && (
            <div className="modall">
              <div className="modal-content">
                <div className="cancel-order-close-container">
                  {" "}
                  <CloseIcon
                    className="cancel-order-close"
                    onClick={() => {
                      setCancellationReason("");
                      setOrderID("");
                      setShowModal(false);
                    }}
                  />
                </div>

                <h2>Cancel Order</h2>
                {/* <p>Are you sure you want to cancel this order?</p> */}
                <textarea
                  placeholder="Enter cancellation reason"
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  className="cancel-order-reason"
                />
                <br />
                <button
                  onClick={() => {
                    handleCancelConfirmation();
                  }}
                  disabled={cancelLoading}
                  className="cancel-order-btn"
                >
                  {cancelLoading ? "Cancelling..." : "Confirm Cancellation"}
                </button>
              </div>
            </div>
          )}

          {invoice && (
            <section className="invoice-main-container">
              <div class="invoice" ref={invoiceContainerRef}>
                <div class="top_line"></div>
                <div class="header">
                  <div class="i_row">
                    <div class="i_logo"></div>
                    <div class="i_title">
                      <h2>INVOICE</h2>
                    </div>
                  </div>
                  <div class="i_row">
                    <div class="i_number">
                      <p class="p_title">Order ID:{invoice.orderID}</p>
                    </div>
                  </div>
                  <div class="footer">
                    <div class="i_row">
                      <div class="i_col w_50 seller-bg">
                        <p class="p_title">Seller</p>
                        <p>
                          {invoice.firstName} {invoice.lastName}
                          <br />
                          Phone : {invoice.phone}
                          <br />
                          Email: {invoice.email}
                          <br />
                          Address : {invoice.address},
                          <br />
                          {invoice.city} {invoice.zipCode}
                          <br />
                          <br />
                        </p>
                      </div>
                      <div class="i_col w_50 text_right buyer-bg">
                        <p class="p_title">Buyer</p>
                        <p>
                          Selligo Private Limited,
                          <br />
                          1st main road Jayanagar,
                          <br />
                          Bangalore 560096
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="body">
                  <div class="i_table">
                    <div class="i_table_head">
                      <div class="i_row">
                        <div class="i_col w_15">
                          <p class="p_title">QTY</p>
                        </div>
                        <div class="i_col w_55">
                          <p class="p_title">DESCRIPTION</p>
                        </div>
                        <div class="i_col w_15">
                          <p class="p_title">PRICE</p>
                        </div>
                      </div>
                    </div>
                    <div class="i_table_body">
                      <div class="i_row">
                        <div class="i_col w_15">
                          <p>1</p>
                        </div>
                        <div class="i_col w_55">
                          <p>{invoice.productDetails.productName}</p>
                          <p>Promo Code : {invoice.promoName}</p>
                          <p>IMEI Number : {invoice.imeiNumber}</p>

                          {/* <div>
                            {item.promoPrice > 0 ? (
                              <p>Promo Code : {invoiceData.promoName}</p>
                            ) : (
                              <p>Promo Code : Not Applicable</p>
                            )}
                          </div> */}
                        </div>
                        <div class="i_col w_15">
                          <p>Rs {invoice.finalPrice}</p>
                          <p>Rs {invoice.promoPrice}</p>
                        </div>
                      </div>
                    </div>
                    <div class="i_table_foot">
                      <div class="i_row grand_total_wrap">
                        <div class="i_col w_50"></div>
                        <div class="i_col w_50 grand_total">
                          <p>
                            <span>GRAND TOTAL:</span>
                            <span>
                              {`${
                                parseFloat(invoice.finalPrice) +
                                parseFloat(invoice.promoPrice)
                              }`}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bottom_line"></div>
              </div>
            </section>
          )}

          <Footer2 />
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Orders;
