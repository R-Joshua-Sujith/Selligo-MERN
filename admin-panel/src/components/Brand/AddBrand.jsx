import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import { FormControlLabel, FormControl } from "@mui/material";
import Navigation from "../RepeatableComponents/Navigation";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddBrand = () => {
  const [brandName, setBrandName] = useState("");
  const [brandImage, setBrandImage] = useState("");
  const [options, setOptions] = useState([]);
  const [checkedItems, setCheckedItems] = useState([]);
  const [series, setSeries] = useState({}); // Object to hold series for each category
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("https://api.selligo.in/category/get-all-category-types")
      .then((response) => {
        const initialSeriesState = {};
        response.data.forEach((category) => {
          initialSeriesState[category.category_type] = [];
        });
        setSeries(initialSeriesState);
        setOptions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleChange = (category) => {
    setCheckedItems((prevCheckedItems) => {
      const index = prevCheckedItems.indexOf(category);

      if (index === -1) {
        return [...prevCheckedItems, category];
      } else {
        const updatedItems = [...prevCheckedItems];
        updatedItems.splice(index, 1);
        return updatedItems;
      }
    });

    // Initialize the series array for the selected category
    setSeries((prevSeries) => ({
      ...prevSeries,
      [category]: prevSeries[category] || [],
    }));
  };

  const handleAddSeries = (category) => {
    setSeries((prevSeries) => ({
      ...prevSeries,
      [category]: [...prevSeries[category], { seriesName: "", models: [] }],
    }));
  };

  const handleDeleteSeries = (category, seriesIndex) => {
    setSeries((prevSeries) => ({
      ...prevSeries,
      [category]: prevSeries[category].filter(
        (_, index) => index !== seriesIndex
      ),
    }));
  };

  const handleAddModel = (category, seriesIndex) => {
    setSeries((prevSeries) => ({
      ...prevSeries,
      [category]: prevSeries[category].map((series, index) =>
        index === seriesIndex
          ? { ...series, models: [...series.models, ""] }
          : series
      ),
    }));
  };

  const handleDeleteModel = (category, seriesIndex, modelIndex) => {
    setSeries((prevSeries) => ({
      ...prevSeries,
      [category]: prevSeries[category].map((series, index) =>
        index === seriesIndex
          ? {
              ...series,
              models: series.models.filter((_, i) => i !== modelIndex),
            }
          : series
      ),
    }));
  };

  const handleSeriesChange = (category, index, value) => {
    setSeries((prevSeries) => ({
      ...prevSeries,
      [category]: prevSeries[category].map((item, i) =>
        i === index ? { ...item, seriesName: value } : item
      ),
    }));
  };

  const handleModelChange = (category, seriesIndex, modelIndex, value) => {
    setSeries((prevSeries) => ({
      ...prevSeries,
      [category]: prevSeries[category].map((series, index) =>
        index === seriesIndex
          ? {
              ...series,
              models: series.models.map((item, i) =>
                i === modelIndex ? value : item
              ),
            }
          : series
      ),
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!brandName.trim() || !brandImage.trim()) {
        toast.warning("Brand Name and Brand Image are required");
        return;
      }

      const selectedCategories = Object.values(checkedItems).filter(Boolean);
      if (selectedCategories.length === 0) {
        toast.warning("Select at least one category");
        return;
      }

      const isValid = selectedCategories.every((category) => {
        const categoryData = series[category];
        return (
          categoryData &&
          categoryData.length > 0 &&
          categoryData.every(
            (seriesItem) =>
              seriesItem.seriesName.trim() !== "" &&
              seriesItem.models.length > 0 &&
              seriesItem.models.every((model) => model.trim() !== "")
          )
        );
      });

      if (!isValid) {
        toast.warning("Please fill all series and model fields");
        return;
      }
      setLoading(true);

      // Rest of your submit logic
      await axios
        .post("https://api.selligo.in/brand/add-brand", {
          brandName,
          brandImage,
          series,
        })
        .then((response) => {
          setLoading(false);
          setBrandName("");
          setBrandImage("");
          setSeries({});
          setCheckedItems([]);
          toast.success(response.data.message);
        });
    } catch (err) {
      setLoading(false);
      toast.warning(err.response?.data?.error || "Error submitting the form");
    }
  };

  return (
    <div className="add-brand-container">
      <Navigation />
      <div>
        <h1>Create an entry</h1>
        <TextField
          id="outlined-search"
          label="Brand Name"
          type="text"
          size="small"
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
        />
        <br />
        <TextField
          id="outlined-search"
          label="Brand Image Link"
          type="text"
          size="small"
          value={brandImage}
          sx={{ mt: 2 }}
          onChange={(e) => setBrandImage(e.target.value)}
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
                    onChange={() => handleChange(option.category_type)}
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
                        onChange={(e) =>
                          handleSeriesChange(
                            option.category_type,
                            index,
                            e.target.value
                          )
                        }
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
                            onChange={(e) =>
                              handleModelChange(
                                option.category_type,
                                index,
                                modelIndex,
                                e.target.value
                              )
                            }
                          />
                          <IconButton
                            onClick={() =>
                              handleDeleteModel(
                                option.category_type,
                                index,
                                modelIndex
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </div>
                      ))}
                      <IconButton
                        onClick={() =>
                          handleAddModel(option.category_type, index)
                        }
                      >
                        <AddIcon />
                      </IconButton>
                      <Button
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                          handleDeleteSeries(option.category_type, index)
                        }
                      >
                        Delete Series
                      </Button>
                    </div>
                  ))}
                  <IconButton
                    onClick={() => handleAddSeries(option.category_type)}
                  >
                    <AddIcon />
                  </IconButton>
                </div>
              )}
            </div>
          ))}
          <Button variant="contained" onClick={handleSubmit} disabled={Loading}>
            {Loading ? "Loading..." : "Submit"}
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddBrand;
