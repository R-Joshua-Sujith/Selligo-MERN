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
            From the list of available options select product which you want to
            sell us
          </div>
          <button
            className="how-component-btn"
            onClick={() => {
              navigate("/mobile");
            }}
          >
            Show Products
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
            wait for a guy who comes like this and asks to show your old mobile.
            don’t worry he is our pickup partner!
          </div>
          <button
            className="how-component-btn"
            onClick={() => {
              navigate("/mobile");
            }}
          >
            Show Products
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
