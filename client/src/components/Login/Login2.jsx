import React, { useState } from "react";
import Nav from "../repeatable-components/Nav";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import "./Login.css";
import Loader from "../repeatable-components/Loader";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import GoogleAdsTag from "../repeatable-components/GoogleAdsTag";

const Login2 = () => {
  const { id } = useParams();
  const reduxCity = useSelector((state) => state.city);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Loading2, setLoading2] = useState(false);
  const [loginState, setLoginState] = useState(false);
  const phoneRegex = /^\d{10}$/;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const sendOTP = async () => {
    if (phone === "") {
      toast.warning("Please fill phone Number");
    } else if (!phoneRegex.test(phone)) {
      toast.warning("Invalid Phone Number");
    } else {
      setLoading(true);
      await axios
        .post("https://sellify-backend.onrender.com/user/send-sms", {
          mobileNumber: phone,
        })
        .then((res) => {
          setLoading(false);
          setLoginState(true);
          toast.success("OTP Sent");
        })
        .catch((error) => {
          setLoading(false);
          setLoginState(false);
          toast.error(error.response.data.message);
        });
    }
  };

  const login = async () => {
    if (otp === "" || phone === "") {
      toast.warning("Please Fill the necessary fields");
      return;
    } else {
      setLoading2(true);
      await axios
        .post("https://sellify-backend.onrender.com/user/sms-login", {
          phone: phone,
          otp,
        })
        .then((res) => {
          setLoading2(false);
          setTimeout(() => {
            if (res.data.user.city === "") {
              dispatch({
                type: "login",
                phone: phone,
                city: reduxCity,
              });
            } else {
              dispatch({
                type: "login",
                phone: phone,
                city: res.data.user.city,
              });
            }
            navigate("/");
          }, 1000);
        })
        .catch((error) => {
          setLoading2(false);
          toast.error("Invalid OTP or Phone");
        });
    }
  };
  return (
    <div className="Login-section">
      <Nav />
      <div className="login-section-container">
        <div className="login-email-container">
          <div className="login-email-label">Phone </div>
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        {loginState ? (
          <div className="login-email-container">
            <div className="login-email-label">OTP </div>
            <input
              type="text"
              placeholder="Please Enter your OTP"
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
            />
          </div>
        ) : (
          ""
        )}
        {loginState ? (
          <div className="login-button-container">
            {Loading2 ? <Loader /> : <button onClick={login}>Verify</button>}
          </div>
        ) : (
          <div className="login-button-container">
            {Loading ? <Loader /> : <button onClick={sendOTP}>Send OTP</button>}
          </div>
        )}
      </div>
      <ToastContainer />
      <GoogleAdsTag trackingId="AW-11482642479" />
    </div>
  );
};

export default Login2;
