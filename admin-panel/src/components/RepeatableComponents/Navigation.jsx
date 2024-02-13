import React from "react";
import CategoryIcon from "@mui/icons-material/Category";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PersonIcon from "@mui/icons-material/Person";
import "./Navigation.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LogoutIcon from "@mui/icons-material/Logout";
const Navigation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className="navigation-container">
      <h2
        className="nav-heading"
        onClick={() => {
          navigate("/");
        }}
      >
        SelliGo
      </h2>
      <div className="nav-items-container">
        <div
          className="nav-items"
          onClick={() => {
            navigate("/category");
          }}
        >
          <CategoryIcon />
          Categories
        </div>
        <div
          className="nav-items"
          onClick={() => {
            navigate("/brand");
          }}
        >
          <BrandingWatermarkIcon />
          Brands
        </div>
        <div
          className="nav-items"
          onClick={() => {
            navigate("/product");
          }}
        >
          <InventoryIcon />
          Products
        </div>
        <div
          className="nav-items"
          onClick={() => {
            navigate("/view-orders");
          }}
        >
          <LocalShippingIcon />
          Orders
        </div>
        <div
          className="nav-items"
          onClick={() => {
            navigate("/users");
          }}
        >
          <PersonIcon />
          Users
        </div>
        <div
          className="nav-items"
          onClick={() => {
            navigate("/view-pincode");
          }}
        >
          <PersonIcon />
          PinCode
        </div>
        <div
          className="nav-items"
          onClick={() => {
            navigate("/view-abundant-orders");
          }}
        >
          <LocalShippingIcon />
          Abandoned Orders
        </div>
        <div
          className="nav-items"
          onClick={() => {
            navigate("/promoCode");
          }}
        >
          <LocalShippingIcon />
          Promo Code
        </div>
        <div
          className="nav-items"
          onClick={() => {
            dispatch({ type: "logout" });
          }}
        >
          <LogoutIcon />
          Log Out
        </div>
      </div>
    </div>
  );
};

export default Navigation;
