import React, { useEffect, useState, useRef } from "react";
import "./ViewSingleOrder.css";
import Navigation from "../RepeatableComponents/Navigation";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./ViewSingleOrder.css";
const ViewSingleOrder = () => {
  const [orderData, setOrderData] = useState({});
  const [scheduledPickup, setScheduledPickup] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [options, setOptions] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const invoiceContainerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const getOrderData = async () => {
    await axios
      .get(`http://api.selligo.in/order/single-orders/${id}`)
      .then((res) => {
        console.log(res.data);
        setOrderData(res.data);
        setScheduledPickup(res.data.scheduledPickup);
        setProductDetails(res.data.productDetails);

        setOptions(res.data.options);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getOrderData();
  }, []);

  const copyToClipboard = () => {
    const finalPrice =
      parseFloat(productDetails.price) + parseFloat(orderData.promoPrice);
    const optionsList = options.map((item) => `${item.optionHeading}`);
    let promoCode = "Not Applicable";
    if (orderData.promoPrice > 0) {
      promoCode = orderData.promoName;
    }
    const clipboardData = `
First Name: ${orderData.firstName}
Last Name: ${orderData.lastName}
Email: ${orderData.email}
Phone: ${orderData.phone}
Additional Phone: ${orderData.addPhone}
Address: ${orderData.address}
Pincode: ${orderData.zipCode}
City: ${orderData.city}
Product Name: ${productDetails.productName}
Product Price: ${productDetails.price}
Promo Code : ${promoCode}
Promo Price : ${orderData.promoPrice}
Final Price : ${finalPrice}
Pick up date: ${new Date(scheduledPickup.pickupDate).toLocaleDateString()}
Pick up time: ${scheduledPickup.pickupTime}
Status: ${orderData.status}
Mode of payment:${orderData.modeofpayment}
upiID:${orderData.upiID}
${
  orderData.status === "cancelled"
    ? `Cancellation Reason: ${orderData.cancellationReason}`
    : ""
}
${
  orderData.status === "complete"
    ? `IMEI Number :${orderData.imeiNumber} Final Price : ${orderData.finalPrice} \n`
    : ""
}
Options: ${optionsList.join(", ")}`;

    navigator.clipboard
      .writeText(clipboardData)
      .then(() => {
        alert("Copied");
      })
      .catch((err) => {
        console.error("Unable to copy to clipboard", err);
      });
  };

  const downloadBill = async () => {
    await axios
      .get(`http://api.selligo.in/order/api/orders/${id}/documents`)
      .then((res) => {
        console.log(res.data);
        const newWindow = window.open();

        // Display each document in the new window
        newWindow.document.write(
          `<img src="data:image/jpeg;base64,${res.data.deviceBill}" alt="Device Bill" />`
        );
        newWindow.document.write(
          `<img src="data:image/jpeg;base64,${res.data.idCard}" alt="ID Card" />`
        );
        newWindow.document.write(
          `<img src="data:image/jpeg;base64,${res.data.deviceImage}" alt="Device Image" />`
        );
      })
      .catch((err) => {
        console.log("Server Error");
      });
  };

  const handleDownloadInvoice = async () => {
    try {
      setLoading(true);

      // Fetch JSON data from the backend
      const response = await fetch(
        `http://api.selligo.in/order/api/get-invoice-data/${id}`
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
        });
        setInvoice(null);
      }, 1000);

      setLoading(false);
    } catch (error) {
      console.error("Error downloading invoice:", error);
      // Handle the error as needed
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="view-single-order-container">
        <Navigation />
        <div className="view-single-order-sub-container">
          <h1 className="view-heading">View Order</h1>
          <h3>
            Order ID : {orderData.orderID}{" "}
            <span className="Copy-button" onClick={copyToClipboard}>
              Copy
            </span>
            {orderData.status === "complete" && (
              <span className="Copy-button" onClick={downloadBill}>
                View Documents
              </span>
            )}
            {orderData.status === "complete" && (
              <span className="Copy-button" onClick={handleDownloadInvoice}>
                Download Invoice
              </span>
            )}
          </h3>
          <div className="view-single-order-sub-sub-container">
            <div className="single-order-card">
              <h2>Customer Details</h2>
              <div className="single-order-card-details">
                {" "}
                <div>
                  <b>FirstName</b> : {orderData.firstName}{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>LastName</b> :
                  {orderData.lastName}
                </div>
                <div>
                  <b>Email</b> : {orderData.email}
                </div>
                <div>
                  <b>Phone</b> :{orderData.phone} <b>Additional Phone</b> :
                  {orderData.addPhone}
                  {orderData.addPhone}
                </div>
                <div>
                  <b>Email</b>:{orderData.email}
                </div>
                <div>
                  <b>Address</b>: {orderData.address}
                </div>
                <div>
                  <b>Pincode</b>: {orderData.zipCode} <b>City</b> :
                  {orderData.city}
                </div>
                <div>
                  <b>Mode of Payment</b>: {orderData.modeofpayment}
                </div>
                {orderData.modeofpayment === "upi" && (
                  <div>
                    <b>UPI ID</b>:{orderData.upiID}
                  </div>
                )}
              </div>
            </div>
            <div className="single-order-card">
              <h2>Product Details</h2>
              <div className="single-order-card-details">
                <div>
                  <b>ProductName</b>: {productDetails.productName} <br />
                </div>
                <div>
                  <b>Product Price</b>: {productDetails.price}
                </div>
                <div>
                  <b>Promo Code </b>:
                  {orderData.promoPrice > 0
                    ? ` ${orderData.promoName}`
                    : `Not Applicable`}
                  <br />
                  <b>Promo Price</b>: {orderData.promoPrice}
                </div>
                <div>
                  <b>Final Price</b> :
                  {parseInt(productDetails.price) +
                    parseInt(orderData.promoPrice)}
                </div>
              </div>

              <h2>Order Details</h2>
              <div className="single-order-card-details">
                <div>
                  <b> Pick up date:</b>
                  {new Date(scheduledPickup.pickupDate).toLocaleDateString()}
                </div>
                <div>
                  <b>Pick up time:</b> {scheduledPickup.pickupTime}
                </div>
              </div>
            </div>
          </div>
          <div className="view-single-order-sub-sub-container">
            <div className="single-order-card">
              <h2>Order Status</h2>
              <div>
                <b>Status</b> : {orderData.status}
              </div>

              {orderData.status === "cancelled" ? (
                <div>
                  <b>Cancellation Reason</b> : {orderData.cancellationReason}
                </div>
              ) : (
                ""
              )}
              {orderData.status === "complete" ? (
                <div>
                  <div>
                    <b>Final Price</b> : {orderData.finalPrice}
                  </div>
                  <div>
                    <b>IMEI Number</b> : {orderData.imeiNumber}
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="single-order-card">
              <h2>Options Selected</h2>
              <div className="single-order-card-options-container">
                {options.map((item) => (
                  <div className="single-order-card-options">
                    {item.optionHeading}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {invoice && (
        // <section className="invoice-main-container">
        //   <div class="invoice" ref={invoiceContainerRef}>
        //     <div class="top_line"></div>
        //     <div class="header">
        //       <div class="i_row">
        //         <div class="i_logo"></div>
        //         <div class="i_title">
        //           <h2>INVOICE</h2>
        //         </div>
        //       </div>
        //       <div class="i_row">
        //         <div class="i_number">
        //           <p class="p_title">Order ID:{invoice.orderID}</p>
        //         </div>
        //       </div>
        //       <div class="footer">
        //         <div class="i_row">
        //           <div class="i_col w_50 seller-bg">
        //             <p class="p_title">Seller</p>
        //             <p>
        //               {invoice.firstName} {invoice.lastName}
        //               <br />
        //               Phone : {invoice.phone}
        //               <br />
        //               Email: {invoice.email}
        //               <br />
        //               Address : {invoice.address},
        //               <br />
        //               {invoice.city} {invoice.zipCode}
        //               <br />
        //               <br />
        //             </p>
        //           </div>
        //           <div class="i_col w_50 text_right buyer-bg">
        //             <p class="p_title">Buyer</p>
        //             <p>
        //               Sellify Private Limited,
        //               <br />
        //               1st main road Jayanagar,
        //               <br />
        //               Bangalore 560096
        //             </p>
        //           </div>
        //         </div>
        //       </div>
        //     </div>
        //     <div class="body">
        //       <div class="i_table">
        //         <div class="i_table_head">
        //           <div class="i_row">
        //             <div class="i_col w_15">
        //               <p class="p_title">QTY</p>
        //             </div>
        //             <div class="i_col w_55">
        //               <p class="p_title">DESCRIPTION</p>
        //             </div>
        //             <div class="i_col w_15">
        //               <p class="p_title">PRICE</p>
        //             </div>
        //           </div>
        //         </div>
        //         <div class="i_table_body">
        //           <div class="i_row">
        //             <div class="i_col w_15">
        //               <p>1</p>
        //             </div>
        //             <div class="i_col w_55">
        //               <p>{invoice.productDetails.productName}</p>
        //               <p>IMEI Number : {invoice.imeiNumber}</p>
        //             </div>
        //             <div class="i_col w_15">
        //               <p>{invoice.finalPrice}</p>
        //             </div>
        //           </div>
        //         </div>
        //         <div class="i_table_foot">
        //           <div class="i_row grand_total_wrap">
        //             <div class="i_col w_50"></div>
        //             <div class="i_col w_50 grand_total">
        //               <p>
        //                 <span>GRAND TOTAL:</span>
        //                 <span>Rs {invoice.finalPrice}</span>
        //               </p>
        //             </div>
        //           </div>
        //         </div>
        //       </div>
        //     </div>

        //     <div class="bottom_line"></div>
        //   </div>
        // </section>
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
    </div>
  );
};

export default ViewSingleOrder;
