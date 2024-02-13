import React from "react";
import "./ViewSingleBrand.css";
import Navigation from "../RepeatableComponents/Navigation";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
const ViewSingleBrand = () => {
  const { id } = useParams();
  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState("");
  const [options, setOptions] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [series, setSeries] = useState({});

  useEffect(() => {
    axios
      .get("https://api.selligo.in/category/get-all-category-types")
      .then((response) => {
        setOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const getBrandData = async () => {
      try {
        await axios
          .get(`https://api.selligo.in/brand/brands/${id}`)
          .then((response) => {
            setBrandName(response.data.brandName);
            setBrandImage(response.data.brandImage);
            setSeries(response.data.series);
            setCheckedItems(Object.keys(response.data.series));
          });
      } catch (err) {
        console.log(err);
        alert(err.response.data.error);
      }
    };
    getBrandData();
  }, []);

  return (
    <div className="view-single-brand-container">
      <Navigation />
      <div>
        <h1>View Brand Details</h1>
        <TextField
          id="outlined-search"
          label="Brand Name"
          type="text"
          size="small"
          value={brandName}
          disabled
        />
        <br />
        <TextField
          id="outlined-search"
          label="Brand Image Link"
          type="text"
          size="small"
          value={brandImage}
          sx={{ mt: 2 }}
          disabled
        />
        <br />
        <h4>Select Categories</h4>
        <div className="add-brand-main-container">
          {options.map((option) => (
            <div key={option._id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={checkedItems.includes(option.category_type)}
                    disabled
                  />
                }
                label={option.category_type}
              />
              {checkedItems.includes(option.category_type) && (
                <div>
                  {series[option.category_type].map((seriesItem, index) => (
                    <div key={index} className="add-brand-series">
                      <TextField
                        label="Enter series name"
                        type="text"
                        value={seriesItem.seriesName}
                        sx={{ mr: 2 }}
                        disabled
                      />
                      <br />
                      {seriesItem.models.map((model, modelIndex) => (
                        <div
                          key={modelIndex}
                          style={{
                            display: "inline",
                            // alignItems: "center",
                            // flexDirection: "row",
                          }}
                        >
                          <TextField
                            sx={{ mt: 1 }}
                            label="Enter model name"
                            type="text"
                            value={model}
                            disabled
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ViewSingleBrand;
