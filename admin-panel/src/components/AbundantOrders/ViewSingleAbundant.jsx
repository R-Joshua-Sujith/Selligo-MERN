import React from "react";
import "./ViewSingleAbundant.css";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navigation from "../RepeatableComponents/Navigation";

const ViewSingleAbundant = () => {
  const { id, phone } = useParams();
  const [orderData, setOrderData] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [options, setOptions] = useState([]);
  const [userData, setUserData] = useState({});
  const getOrderData = async () => {
    await axios
      .get(`https://sellify-backend.onrender.com/abundant/single-orders/${id}`)
      .then((res) => {
        console.log(res.data);
        setOrderData(res.data);
        setProductDetails(res.data.productDetails);
        setOptions(res.data.options);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getProfileData = async (req, res) => {
    await axios
      .get(`https://sellify-backend.onrender.com/user/api/users/${phone}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getOrderData();
    getProfileData();
  }, []);
  return (
    <div>
      <div className="view-single-order-container">
        <Navigation />
        <div className="view-single-order-sub-container">
          <h1 className="view-heading">View Abundant Order</h1>

          <div className="view-single-order-sub-sub-container">
            <div className="single-order-card">
              <h2>Customer Details</h2>
              <div className="single-order-card-details">
                {" "}
                <div>
                  <b>Phone</b> : {orderData.phone}
                </div>
                <div>
                  <b>City</b> :{orderData.city}
                </div>
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
              </div>
            </div>
          </div>
          <div className="view-single-order-sub-sub-container">
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

            <div className="single-order-card">
              <h2>Customer Details from profile</h2>
              <div className="single-order-card-details">
                {" "}
                <div>
                  <b>FirstName</b> : {userData.firstName}{" "}
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <br />
                  <b>LastName</b> :{userData.lastName}
                </div>
                <div>
                  <b>Email</b> : {userData.email}
                </div>
                <div>
                  <b>Phone</b> :{userData.phone}
                  <br /> <b>Additional Phone</b> :{userData.addPhone}
                </div>
                <div>
                  <b>Address</b>: {userData.address}
                </div>
                <div>
                  <b>Pincode</b>: {userData.zipCode}
                  <br /> <b>City</b> :{userData.city}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewSingleAbundant;
