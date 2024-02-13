import React, { useState } from "react";
import Navigation from "../RepeatableComponents/Navigation";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import DeleteIcon from "@mui/icons-material/Delete";
import "./AddProduct.css";
import { useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useParams } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import "./ViewSingleProduct.css";
const ViewSingleProduct = () => {
  const { id } = useParams();
  const [productName, setProductName] = useState("");
  const [productImage, setProductImage] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [seriesData, setSeriesData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [brandName, setBrandName] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [seriesName, setSeriesName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [variant, setVariant] = useState("");
  const [modelData, setModelData] = useState([]);
  const [model, setModel] = useState("");
  const [options, setOptions] = useState([]);
  useEffect(() => {
    const getProductData = async () => {
      try {
        await axios
          .get(`http://localhost:5000/product/products/${id}`)
          .then((response) => {
            setBasePrice(response.data.basePrice);
            setProductImage(response.data.productImage);
            setVariant(response.data.variant);
            setCategoryType(response.data.categoryType);
            setBrandName(response.data.brandName);
            setSeriesName(response.data.seriesName);
            setModel(response.data.model);
            setOptions(response.data.dynamicFields);
          });
      } catch (err) {
        console.log(err);
        alert(err.response.data.error);
      }
    };
    getProductData();
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:5000/get-all-category-types")
      .then((response) => {
        console.log(response.data);
        setCategoryData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/brands-category/${categoryType}`)
      .then((response) => {
        console.log(response.data);
        setBrandData(response.data);
      })
      .catch((error) => {
        setBrandData([]);
        console.log(error.response.data.error);
      });
  }, [categoryType]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/series/${brandName}/${categoryType}`)
      .then((response) => {
        console.log(response.data);
        setSeriesData(response.data);
      })
      .catch((error) => {
        setSeriesData([]);
        console.log(error.response.data.error);
      });
  }, [categoryType, brandName]);

  return (
    <div className="view-single-product-container">
      <Navigation />
      <div>
        <h1>View Product</h1>
        <div className="add-product-main-container">
          <FormControl fullWidth sx={{ mt: 2, width: 200 }} size="small">
            <TextField
              type="text"
              label="Category"
              value={categoryType}
              disabled
              size="small"
              sx={{ ml: 2, width: 200 }}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2, ml: 2, width: 200 }} size="small">
            <TextField
              type="text"
              label="Brand"
              value={brandName}
              disabled
              size="small"
              sx={{ ml: 2, width: 200 }}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2, ml: 2, width: 200 }} size="small">
            <TextField
              type="text"
              label="Brand"
              value={seriesName}
              disabled
              size="small"
              sx={{ ml: 2, width: 200 }}
            />
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2, ml: 2, width: 200 }} size="small">
            <TextField
              type="text"
              label="Brand"
              value={model}
              disabled
              size="small"
              sx={{ ml: 2, width: 200 }}
            />
          </FormControl>
          <TextField
            sx={{ mt: 2, ml: 4 }}
            size="small"
            label="Variant"
            value={variant}
            onChange={(e) => setVariant(e.target.value)}
            disabled
          />
          <br />
          <br />

          <TextField
            type="number"
            label="Base Price"
            value={basePrice}
            size="small"
            sx={{ ml: 2, width: 200 }}
            onChange={(e) => setBasePrice(e.target.value)}
            disabled
          />
          <TextField
            id="outlined-search"
            label="Product Image"
            type="text"
            size="small"
            sx={{ ml: 2, width: 200 }}
            value={productImage}
            onChange={(e) => setProductImage(e.target.value)}
            disabled
          />

          <br />
          <br />
          {categoryType && (
            <div className="add-product-options-container">
              {options.map((item, index) => (
                <div className="single-option-container" key={index}>
                  <TextField
                    size="small"
                    label={item.optionHeading}
                    type="text"
                    placeholder="value"
                    value={item.optionValue}
                    disabled
                  />
                </div>
              ))}
            </div>
          )}

          <br />
        </div>
      </div>
    </div>
  );
};

export default ViewSingleProduct;
