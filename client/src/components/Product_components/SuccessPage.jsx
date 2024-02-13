import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Nav from "../repeatable-components/Nav";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { Toast } from "bootstrap";
import GoogleAdsTag from "../repeatable-components/GoogleAdsTag";
import GoogleAdsConversion from "../repeatable-components/GoogleAdsConversion";

const SuccessPage = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [productData, setProductData] = useState({});
  const [Loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    window.scrollTo(0, 0);
    toast.info(`Page will be redirected in 5 seconds`);
    const getProductData = async () => {
      try {
        setLoading(true);
        await axios
          .get(`https://api.selligo.in/product/products/${id}`)
          .then((response) => {
            setLoading(false);
            console.log(response.data);
            setProductData(response.data);
          });
      } catch (err) {
        setLoading(false);
        alert(err.response.data.error);
      }
    };
    getProductData();
    setTimeout(() => {
      navigate("/orders");
    }, 5000);

    // }
  }, []);

  return (
    <div>
      <Nav />
      <div className="single-product-container">
        <div className="single-product-sub-container">
          <div
            className="single-product-sub-container-one"
            style={{
              backgroundImage: `url(https://api.selligo.in/uploads/${encodeURIComponent(
                productData.productImage
              )})`,
            }}
          ></div>
          <div className="single-product-sub-container-two">
            <div className="single-product-sub-container-two-name">
              {productData.model} {productData.variant}
            </div>

            <div>
              <button className="single-product-sub-container-variant-accurate-btn">
                Order Placed Successfully
              </button>
            </div>
            <div className="success-image"></div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SuccessPage;
