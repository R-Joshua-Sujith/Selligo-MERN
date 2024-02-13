import React from "react";
import Navigation from "../RepeatableComponents/Navigation";
import CategoryIcon from "@mui/icons-material/Category";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import BigLoader from "../Loader/BigLoader";
const Home = () => {
  const [Loading, setLoading] = useState(false);
  const [Count, setCount] = useState({
    category: 0,
    brand: 0,
    product: 0,
    order: 0,
    user: 0,
  });
  const getCount = async () => {
    setLoading(true);
    await axios
      .get("https://api.selligo.in/statistic/documentCounts")
      .then((res) => {
        setLoading(false);
        setCount(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    getCount();
  }, []);
  const navigate = useNavigate();
  return (
    <div className="home-container">
      <Navigation />
      {Loading ? (
        <BigLoader />
      ) : (
        <div className="home-main-container">
          <div className="home-main-cards-container">
            <div
              className="home-main-card"
              onClick={() => {
                navigate("/category");
              }}
            >
              <div className="home-main-card-heading-container">
                <h2 className="home-main-card-heading">Categories</h2>
                <CategoryIcon />
              </div>

              <h2 className="home-main-card-count">{Count.category}</h2>
            </div>

            <div
              className="home-main-card"
              onClick={() => {
                navigate("/brand");
              }}
            >
              <div className="home-main-card-heading-container">
                <h2 className="home-main-card-heading">Brands</h2>
                <BrandingWatermarkIcon />
              </div>

              <h2 className="home-main-card-count">{Count.brand}</h2>
            </div>
            <div
              className="home-main-card"
              onClick={() => {
                navigate("/product");
              }}
            >
              <div className="home-main-card-heading-container">
                <h2 className="home-main-card-heading">Products</h2>
                <InventoryIcon />
              </div>

              <h2 className="home-main-card-count">{Count.product}</h2>
            </div>
            <div
              className="home-main-card"
              onClick={() => {
                navigate("/view-orders");
              }}
            >
              <div className="home-main-card-heading-container">
                <h2 className="home-main-card-heading">Orders</h2>

                <LocalShippingIcon />
              </div>

              <h2 className="home-main-card-count">{Count.order}</h2>
            </div>
            <div
              className="home-main-card"
              onClick={() => {
                navigate("/users");
              }}
            >
              <div className="home-main-card-heading-container">
                <h2 className="home-main-card-heading">Users</h2>
                <PersonIcon />
              </div>

              <h2 className="home-main-card-count">{Count.user}</h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
