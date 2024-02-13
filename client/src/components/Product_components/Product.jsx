import React from "react";
import "./Product.css";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../repeatable-components/Nav";
import { useEffect, useState } from "react";
import BigLoader from "../repeatable-components/BigLoader";
import Modal from "../repeatable-components/Modal";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import Footer2 from "../repeatable-components/Footer2";
import ProductTemplate from "./ProductTemplate";
const Product = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [productData, setProductData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [seriesName, setSeriesName] = useState("");
  const [modelData, setModelData] = useState([]);
  const [model, setModel] = useState("");
  const [Loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { type, brand } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    localStorage.removeItem("storage");
    localStorage.removeItem("categoryOptions");
    localStorage.removeItem("productName");
    const getProductData = async () => {
      const storedData = sessionStorage.getItem(`${type}${brand}`);
      if (storedData) {
        const data = JSON.parse(storedData);
        setProductData(data);
      } else {
        try {
          setLoading(true);
          await axios
            .get(`http://api.selligo.in/product/get-products/${type}/${brand}`)
            .then((response) => {
              setProductData(response.data);
              sessionStorage.setItem(
                `${type}${brand}`,
                JSON.stringify(response.data)
              );
              setLoading(false);
            });
        } catch (err) {
          setLoading(false);
          console.log(err.response.data.error);
        }
      }
    };
    getProductData();
  }, [brand]);

  useEffect(() => {
    // Filter the data based on seriesName, model, and search term
    const filteredData = productData.filter((item) => {
      const combinedName = (item.series + " " + item.model).toLowerCase();

      // If seriesName, model, and search term are selected, filter by all
      if (seriesName && model && searchTerm) {
        return (
          item.seriesName === seriesName &&
          item.model === model &&
          combinedName.includes(searchTerm.toLowerCase())
        );
      }
      // If seriesName and search term are selected, filter by both
      else if (seriesName && searchTerm) {
        return (
          item.seriesName === seriesName &&
          combinedName.includes(searchTerm.toLowerCase())
        );
      }
      // If model and search term are selected, filter by both
      else if (model && searchTerm) {
        return (
          item.model === model &&
          combinedName.includes(searchTerm.toLowerCase())
        );
      }
      // If only seriesName is selected, filter by seriesName
      else if (seriesName) {
        return item.seriesName === seriesName;
      }
      // If only model is selected, filter by model
      else if (model) {
        return item.model === model;
      }
      // If only search term is entered, filter by it
      else if (searchTerm) {
        return combinedName.includes(searchTerm.toLowerCase());
      }
      // If none is selected, include all items
      return true;
    });

    // Set displayData based on the filter result or show all products if none selected
    setDisplayData(
      seriesName || model || searchTerm
        ? filteredData.length > 0
          ? filteredData
          : []
        : productData
    );
  }, [seriesName, model, searchTerm, productData]);

  useEffect(() => {
    axios
      .get(`http://api.selligo.in/brand/series/${brand}/${type}`)
      .then((response) => {
        console.log(response.data);
        setSeriesData(response.data);
      })
      .catch((error) => {
        setSeriesData([]);
        console.log(error.response.data.error);
      });
  }, [brand, type]);

  useEffect(() => {
    axios
      .get(`http://api.selligo.in/brand/models/${type}/${brand}/${seriesName}`)
      .then((response) => {
        console.log(response.data);
        setModelData(response.data);
      })
      .catch((error) => {
        setModelData([]);
        console.log(error.response.data.error);
      });
  }, [type, brand, seriesName]);

  const handleSeriesChange = async (event) => {
    const selectedSeries = event.target.value;
    setSeriesName(selectedSeries === "All" ? "" : selectedSeries);
    setModel("");
    setSearchTerm("");
  };
  const handleModelChange = async (event) => {
    const selectedModel = event.target.value;
    setModel(selectedModel === "All" ? "" : selectedModel);
    setSearchTerm("");
  };

  useEffect(() => {
    // Filter the data based on seriesName and model
    const filteredData = productData.filter((item) => {
      // If seriesName and model are selected, filter by both
      if (seriesName && model) {
        return item.seriesName === seriesName && item.model === model;
      }
      // If only seriesName is selected, filter by seriesName
      else if (seriesName) {
        return item.seriesName === seriesName;
      }
      // If only model is selected, filter by model
      else if (model) {
        return item.model === model;
      }
      // If none is selected, include all items
      return true;
    });

    // Set displayData based on the filter result or show all products if none selected
    setDisplayData(
      seriesName || model
        ? filteredData.length > 0
          ? filteredData
          : []
        : productData
    );
  }, [seriesName, model, productData]);

  // const filteredBrandData = productData.filter((product) =>
  //   product.productName.toLowerCase().includes(searchTerm.toLowerCase())
  // );

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
      navigate(`/${type}/section-1/${selectedProduct._id}`);
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
    <div className="product-main-main-section">
      <Nav />
      <div className="product-main-section">
        <div className="product-container">
          {/* <div className="product-heading">{brand}</div> */}
          <div className="section-one-heading">
            <span
              className="section-two-heading-black"
              onClick={() => {
                navigate(`/${type}`);
              }}
            >
              {type}&gt;{" "}
            </span>
            <span className="section-two-heading-purple">{brand}</span>
          </div>
          <div className="product-search-container">
            <SearchIcon className="product-search-container-search-icon" />
            <input
              type="text"
              placeholder="Search Product"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="product-container-sub-heading">
          <FormControl
            fullWidth
            sx={{
              ml: 2,
              width: 200,
              maxWidth: { xs: 100, md: 200 },
            }}
            size="small"
          >
            <InputLabel id="demo-simple-select-label"> Series</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={seriesName}
              label="Category"
              onChange={handleSeriesChange}
            >
              <MenuItem value="All">All</MenuItem>
              {seriesData.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl
            fullWidth
            sx={{ ml: 2, width: 200, maxWidth: { xs: 100, md: 200 } }}
            size="small"
          >
            <InputLabel id="demo-simple-select-label">Model</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={model}
              label="Category"
              onChange={handleModelChange}
            >
              <MenuItem value="All">All</MenuItem>
              {modelData.map((item) => (
                <MenuItem value={item}>{item}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {Loading ? (
          <ProductTemplate />
        ) : (
          <div className="product-container-list">
            {displayData.map((item) => (
              <div
                className="product-container-items"
                onClick={() => handleCalculatePrice(item)}
              >
                <div
                  className="product-container-items-image"
                  style={{
                    backgroundImage: `url(http://api.selligo.in/uploads/${encodeURIComponent(
                      item.productImage
                    )})`,
                  }}
                ></div>
                <div className="product-container-items-name">
                  {item.model} {item.variant}
                </div>
                <div className="product-container-items-estd">
                  Rs {item.estimatedPrice} estd price
                </div>
                <button className="product-container-items-btn">
                  Calculate Price
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Modal for device turn on question */}
        {isModalOpen && (
          <Modal onClose={handleModalClose} onYesClick={handleYesClick} />
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Product;
