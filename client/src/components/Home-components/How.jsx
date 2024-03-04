import React from "react";
import "./How.css";
import { useNavigate } from "react-router-dom";
const How = () => {
  const navigate = useNavigate();
  return (
    <div className="how-container">
      <div className="how-component-container">
        <div className="how-component-sub-container">
          <div className="how-component-heading">How It Works ?</div>
          <div className="how-component-sub-heading">
            Select Your Product which you want to sell{" "}
          </div>
          <div className="how-component-description">
            Select the condition, age of your device, and choose your pick up
            date and time and exact location to place the order .
          </div>
          <button
            className="how-component-btn"
            onClick={() => {
              navigate("/mobile");
            }}
          >
            Sell Now
          </button>
        </div>
        <div className="how-component-image"></div>
      </div>

      <div className="how-component-container how-component-container-two">
        <div className="how-component-arrow-one"></div>
        <div className="how-component-image-2"></div>
        <div className="how-component-sub-container">
          <div className="how-component-sub-heading">
            Partner pickup in less time{" "}
          </div>
          <div className="how-component-description">
            Selligo tries to get the pickup done with in the next 2 hours after
            placing the order, except sunday or public holidays . We offer you a
            free pickup at your your door step to sell your old / used device to
            us and choose a convenient pickup date and time.
          </div>
          <button
            className="how-component-btn"
            onClick={() => {
              navigate("/mobile");
            }}
          >
            Sell Now
          </button>
        </div>
      </div>

      <div className="how-component-container how-component-container-three">
        <div className="how-component-arrow-two"></div>
        <div className="how-component-sub-container">
          <div className="how-component-sub-heading">Get Instant Payment</div>
          <div className="how-component-description">
            You Will Receive instant payment as soon as our pickup partner
            verifies the device and approves.
          </div>
          <button
            className="how-component-btn"
            onClick={() => {
              navigate("/mobile");
            }}
          >
            Sell Now
          </button>
        </div>
        <div className="how-component-image-3"></div>
      </div>
    </div>
  );
};

export default How;
