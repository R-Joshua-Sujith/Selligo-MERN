import React from "react";
import { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./Brand.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import Nav from "../repeatable-components/Nav";
import BigLoader from "../repeatable-components/BigLoader";
import Footer2 from "../repeatable-components/Footer2";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import ProductTemplate from "../Product_components/ProductTemplate";

const Brand = () => {
  const [Loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [brandData, setBrandData] = useState([]);
  const { categoryType } = useParams();
  const decodedUrl = decodeURIComponent(categoryType);
  console.log(categoryType);
  useEffect(() => {
    window.scrollTo(0, 0);
    const getBrandData = async () => {
      const storedData = sessionStorage.getItem(`${decodedUrl}`);
      if (storedData) {
        const data = JSON.parse(storedData);
        setBrandData(data);
      } else {
        try {
          setLoading(true);
          await axios
            .get(
              `https://sellify-backend.onrender.com/brand/brands-category/${decodedUrl}`
            )
            .then((response) => {
              setLoading(false);
              console.log(response.data);
              setBrandData(response.data);
              sessionStorage.setItem(
                `${decodedUrl}`,
                JSON.stringify(response.data)
              );
            });
        } catch (err) {
          setLoading(false);
          toast.info(err.response.data.error);
        }
      }
    };
    getBrandData();
  }, [categoryType]);

  const filteredBrandData = brandData.filter((brand) =>
    brand.brandName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayData = searchTerm === "" ? brandData : filteredBrandData;

  return (
    <div className="brand-main-main-section">
      <Nav />
      <div className="brand-main-section">
        <div className="brand-container">
          {/* <div className="brand-heading">Brands</div> */}
          <div className="section-one-heading">
            <span
              className="section-two-heading-black"
              onClick={() => {
                navigate(`/`);
              }}
            >
              Home &gt;{" "}
            </span>
            <span className="section-two-heading-purple">{decodedUrl}</span>
          </div>
          <div className="search-container">
            <SearchIcon className="search-container-search-icon" />
            <input
              type="text"
              placeholder="Search Brand"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {Loading ? (
          <ProductTemplate />
        ) : (
          <div className="brands-collection-container">
            {displayData.map((item) => (
              <div
                className="single-brand"
                onClick={() => {
                  const encodedBrandName = encodeURIComponent(item.brandName);
                  navigate(`/${categoryType}/${encodedBrandName}`);
                }}
              >
                <div
                  className="single-brand-image"
                  style={{ backgroundImage: `url(${item.brandImage})` }}
                ></div>
                <div className="single-brand-heading">{item.brandName}</div>
                {/* <div className="single-brand-count">
                  {item.productCount} Products
                </div> */}
                <div className="single-brand-bottom-container">
                  <ArrowForwardIcon />
                  <div className="single-brand-view">View all</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Brand;
