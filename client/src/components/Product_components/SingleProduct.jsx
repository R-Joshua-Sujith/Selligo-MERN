import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./SingleProduct.css";
import Nav from "../repeatable-components/Nav";
import BigLoader from "../repeatable-components/BigLoader";
import { useSelector } from "react-redux";
import TextField from "@mui/material/TextField";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SectionTemplate from "../Question-components/SectionTemplate";
const SingleProduct = () => {
  const phone = useSelector((state) => state.phone);
  const navigate = useNavigate();
  const [productData, setProductData] = useState({});
  const [totalOptionValue, setTotalOptionValue] = useState(0);
  const { id, type } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [promoPrice, setPromoPrice] = useState(0);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const existingOrders = JSON.parse(localStorage.getItem("orders")) || {};
    setOrderDetails(existingOrders);
    const getProductData = async () => {
      try {
        setLoading(true);
        await axios
          .get(`https://sellify-backend.onrender.com/product/products/${id}`)
          .then((response) => {
            setLoading(false);
            setProductData(response.data);
            const deviceOptions = response.data.dynamicFields;
            const storedOptions = localStorage.getItem("storage");
            const selectedOptions = JSON.parse(storedOptions);

            // Function to find optionValue for a given optionHeading
            const findOptionValue = (optionHeading) => {
              const foundOption = deviceOptions.find(
                (option) => option.optionHeading === optionHeading
              );
              return foundOption ? foundOption.optionValue : null;
            };

            // Map selectedOptions to include optionValue
            const result = selectedOptions.map((option) => {
              const optionValue = findOptionValue(option.optionHeading);
              return { ...option, optionValue };
            });

            const totalValue = result.reduce((accumulator, option) => {
              const optionValue = parseInt(option.optionValue, 10);
              if (option.optionType === "add") {
                return accumulator + optionValue;
              } else if (option.optionType === "sub") {
                return accumulator - optionValue;
              }
              return accumulator;
            }, 0);
            setTotalOptionValue(totalValue);
            const city = localStorage.getItem("selectedCity") || "";

            console.log("Total Value:", totalValue);
            axios.post(
              "https://sellify-backend.onrender.com/abundant/create-abundant-order",
              {
                phone,
                city: city,
                options: selectedOptions,
                productDetails: {
                  productName: `${response.data.model} ${response.data.variant}`,
                  price: totalValue + response.data.basePrice,
                },
              }
            );
            if (city) {
              axios.put(
                `https://sellify-backend.onrender.com/user/api/users/${email}/city`,
                {
                  city,
                }
              );
            }
          });
      } catch (err) {
        setLoading(false);
        alert(err.response.data.error);
      }
    };
    getProductData();

    // }
  }, []);

  useEffect(() => {
    const handlePopstate = () => {
      // Use pushState to navigate forward instead of backward
      window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopstate);

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const handlePlaceOrder = () => {
    if (productData.basePrice + totalOptionValue <= 0) {
      toast.warning("Oops! the price is very low you can't place your order");
      return;
    }
    // Attach order details to the orders object in localStorage
    let promo = "false";
    if (promoPrice) {
      promo = "true";
    }
    const updatedOrders = {
      ...orderDetails,
      productDetails: {
        productName: `${productData.model} ${productData.variant}`,
        price: productData.basePrice + totalOptionValue,
        // Add any other relevant order details here
      },
      promoPrice: promoPrice,
      promoName: code,
      promoStatus: promo,
    };

    // Update the state and localStorage
    setOrderDetails(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    // Navigate to the form
    navigate(`/form/${id}`);
  };

  if (Object.keys(productData).length === 0) {
    return <SectionTemplate />;
  }

  const verifyPromoCode = async () => {
    if (code === "") {
      toast.warning("Please enter a promo code");
      return;
    }

    try {
      setVerifyLoading(true);
      const response = await axios.post(
        "https://sellify-backend.onrender.com/promo/check/promocode",
        {
          enteredCode: code,
          phone: phone,
        }
      );
      setVerifyLoading(false);
      if (response.data.valid) {
        toast.success(`Promo code applied`);
        setPromoPrice(response.data.value);
        setStatus(true);
      } else {
        setCode("");
        toast.error(response.data.message);
      }
    } catch (error) {
      setVerifyLoading(false);
      console.error("Error verifying promo code:", error);
      toast.error("Failed to verify promo code. Please try again.");
    }
  };

  return (
    <div>
      <Nav />
      <div className="single-product-container">
        <div className="single-product-sub-container">
          <div
            className="single-product-sub-container-one"
            style={{
              backgroundImage: `url(https://sellify-backend.onrender.com/uploads/${encodeURIComponent(
                productData.productImage
              )})`,
            }}
          ></div>
          <div className="single-product-sub-container-two">
            <div className="single-product-sub-container-two-name">
              {productData.model} {productData.variant}
            </div>
            <div>
              <div className="single-product-sub-container-variant-price">
                Rs {Math.max(0, productData.basePrice + totalOptionValue)}{" "}
                {status ? `+  Rs ${promoPrice}` : ""}
              </div>

              <div>
                <TextField
                  size="small"
                  sx={{ mb: 2, mr: 2 }}
                  label="Promo code"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                  }}
                />
                {!status ? (
                  <button
                    className="promo-verify-button"
                    onClick={verifyPromoCode}
                    disabled={verifyLoading}
                  >
                    {verifyLoading ? "Verifying" : "Verify Promo Code"}
                  </button>
                ) : (
                  <button className="promo-verify-button">
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    Verified
                  </button>
                )}
                {status ? (
                  <button
                    className="promo-verify-button"
                    onClick={() => {
                      setStatus(false);
                      setCode("");
                      setPromoPrice("");
                    }}
                  >
                    Clear Promo Code
                  </button>
                ) : (
                  ""
                )}
              </div>

              <br />
              <button
                className="single-product-sub-container-variant-accurate-btn"
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
              <div className="single-product-order-description">
                Not satisfied with our price?
              </div>
              <div
                className="single-product-recalculate-price"
                onClick={() => {
                  localStorage.removeItem("storage");
                  navigate(`/${type}/section-1/${id}`);
                }}
              >
                Recalculate Price
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SingleProduct;
