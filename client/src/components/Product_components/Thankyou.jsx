import React from "react";
import "./Success.css";
import { useNavigate } from "react-router-dom";
import image from "../../assets/Products/success.jpg";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Thankyou = () => {
  const navigate = useNavigate();
  useEffect(() => {
    toast.info("Page will be redirected in 5 seconds");
    setTimeout(() => {
      navigate("/orders");
    }, 5000);
  }, []);
  return (
    <div className="success-page-container">
      <div className="success-image-container">
        <img
          src={image}
          className="success-image"
          loading="lazy"
          alt="success-image"
        ></img>
      </div>

      <p>Thank you for placing the order</p>
      <p>Our Pickup partner will reach out to you at the given time</p>
      <div className="success-page-sub-container">
        <button
          onClick={() => {
            navigate("/orders");
          }}
        >
          My Orders
        </button>
        <p>Check your order Status in orders section</p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Thankyou;
