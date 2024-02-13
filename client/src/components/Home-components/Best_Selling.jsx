import React from "react";
import "./Best_Selling.css";
import axios from "axios";
import { useState, useEffect } from "react";
import Modal from "../repeatable-components/Modal";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import BigLoader from "../repeatable-components/BigLoader";
const Best_Selling = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryType, setCategoryType] = useState("");
  const [Loading, setLoading] = useState(false);
  const getCategoryData = async () => {
    try {
      setLoading(true);
      await axios
        .get(`http://localhost:5000/category/get-all-category-types`)
        .then((response) => {
          console.log(response.data);
          setCategoryType(response.data[0].category_type);
          setCategoryData(response.data);
        });
    } catch (err) {
      alert(err.response.data.error);
    }
  };
  const getProductData = async () => {
    await axios
      .get(
        `http://localhost:5000/product/best-selling-products/${categoryType}`
      )
      .then((res) => {
        setLoading(false);
        setProductData(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      await getCategoryData();
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Check if categoryData has been set before calling getProductData
    if (categoryData.length > 0) {
      getProductData();
    }
  }, [categoryData, categoryType]);

  const handleCalculatePrice = (item) => {
    console.log("hi");
    // Set the selected product and show the modal
    setSelectedProduct(item);
    setIsModalOpen(true);
  };

  const handleYesClick = () => {
    // Check if a product is selected
    if (selectedProduct) {
      // Navigate to the next page using the selected product's ID
      navigate(`/${categoryType}/section-1/${selectedProduct._id}`);
    }

    // Close the modal
    setIsModalOpen(false);
  };

  const handleModalClose = () => {
    // Close the modal
    setIsModalOpen(false);

    // Show alert message for devices that don't turn on
    toast.warning("Oops! We accept only devices which turn on.");
  };

  return (
    <div className="Best-Selling-section">
      <h1 className="Best-Selling-Heading">Best Selling</h1>
      <p className="Best-Selling-description">
        Check out the best selling mobiles based on the market price. feel free
        to check the price if you have the mobile
      </p>
      {Loading ? (
        <BigLoader />
      ) : (
        <div>
          <div className="best-selling-options-container">
            {categoryData.map((item) => (
              <div
                className={`best-selling-option ${
                  categoryType === item.category_type ? "selected" : ""
                }`}
                onClick={() => {
                  setCategoryType(item.category_type);
                }}
              >
                {item.category_type}
              </div>
            ))}
          </div>
          <div className="best-selling-products-container">
            {productData.map((item) => (
              <div
                className="best-selling-products"
                onClick={() => handleCalculatePrice(item)}
              >
                <div
                  className="best-selling-product-image-container"
                  style={{
                    backgroundImage: `url(http://localhost:5000/uploads/${encodeURIComponent(
                      item.productImage
                    )})`,
                  }}
                ></div>
                <div className="best-selling-product-description-container">
                  <div className="best-selling-product-description-name">
                    {item.model} {item.variant}
                  </div>
                  <div className="best-selling-product-description-price">
                    GET UPTO {item.estimatedPrice}
                  </div>
                  <button className="best-selling-product-description-btn">
                    Check Price
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={handleModalClose} onYesClick={handleYesClick} />
      )}
      <ToastContainer />
    </div>
  );
};

export default Best_Selling;
