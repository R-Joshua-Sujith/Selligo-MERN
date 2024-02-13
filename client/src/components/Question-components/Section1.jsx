import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Nav from "../repeatable-components/Nav";
import "./Section1.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Switch from "@mui/material/Switch";
import { alpha, styled } from "@mui/material/styles";
import { purple } from "@mui/material/colors";
import BigLoader from "../repeatable-components/BigLoader";
import Footer2 from "../repeatable-components/Footer2";
import SectionTemplate from "./SectionTemplate";

const Section1 = () => {
  const PinkSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: purple[600],
      "&:hover": {
        backgroundColor: alpha(purple[600], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: purple[600],
    },
  }));
  const navigate = useNavigate();
  const [productData, setProductData] = useState({});
  const [attributes, setAttributes] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [displayOptions, setDisplayOptions] = useState([]);

  const { type, id } = useParams();
  const getProductData = async () => {
    const productName = localStorage.getItem("productName");
    const parsedProductName = JSON.parse(productName);
    if (parsedProductName) {
      setProductData(parsedProductName);
    } else {
      try {
        setLoading(true);
        await axios
          .get(`https://api.selligo.in/product/products/${id}`)
          .then((response) => {
            setLoading(false);
            setProductData(response.data);
          });
      } catch (err) {
        setLoading(false);
        alert(err.response.data.error);
      }
    }
  };
  const getCategoryData = async () => {
    const categoryOptions = localStorage.getItem("categoryOptions");
    const parsedCategoryOptions = JSON.parse(categoryOptions);
    if (parsedCategoryOptions) {
      setAttributes(parsedCategoryOptions.attributes);
    } else {
      try {
        setLoading(true);
        await axios
          .get(`https://api.selligo.in/category/api/category/${type}`)
          .then((response) => {
            setLoading(false);
            localStorage.setItem(
              "categoryOptions",
              JSON.stringify(response.data)
            );
            setAttributes(response.data.attributes);
          });
      } catch (err) {
        setLoading(false);
        alert("Server Error");
      }
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);

    getProductData();

    getCategoryData();
    const storedOptions = localStorage.getItem("storage");
    if (storedOptions) {
      const parsedOptions = JSON.parse(storedOptions);
      setDisplayOptions(parsedOptions);
      setSelectedOptions(parsedOptions);
    } else {
      // If "storage" is not present, create it with an empty array
      localStorage.setItem("storage", JSON.stringify([]));
    }
  }, []);

  const handleSwitchToggle = (attributeHeading, option) => {
    const existingOptionIndex = selectedOptions.findIndex(
      (selected) =>
        selected.attributeHeading === attributeHeading &&
        selected.optionHeading === option.optionHeading
    );

    if (existingOptionIndex !== -1) {
      // If the option exists, remove it from the selectedOptions array
      setSelectedOptions((prevSelected) => {
        const updatedSelected = [...prevSelected];
        updatedSelected.splice(existingOptionIndex, 1);
        return updatedSelected;
      });
    } else {
      // If the option doesn't exist, add it to the selectedOptions array
      setSelectedOptions((prevSelected) => [
        ...prevSelected,
        {
          attributeHeading: attributeHeading,
          optionHeading: option.optionHeading,
          optionType: option.optionType,
        },
      ]);
    }
  };

  return (
    <div>
      <Nav />
      {Loading ? (
        <SectionTemplate />
      ) : (
        <div className="section-one-container">
          <div className="section-one-heading-container">
            <div className="section-one-heading">
              <span
                className="section-two-heading-black"
                onClick={() => {
                  navigate(`/${type}/${productData.brandName}`);
                }}
              >
                Products &gt;{" "}
              </span>
              <span className="section-two-heading-purple">Attributes</span>
            </div>
            <div className="section-one-btn-container">
              <button
                className="section-one-proceed-btn"
                onClick={() => {
                  if (selectedOptions.length > 0) {
                    // Save the selected options to localStorage
                    localStorage.setItem(
                      "storage",
                      JSON.stringify(selectedOptions)
                    );
                  }

                  const productObject = {
                    model: productData.model,
                    variant: productData.variant,
                    brandName: productData.brandName,
                  };
                  localStorage.setItem(
                    "productName",
                    JSON.stringify(productObject)
                  );
                  navigate(`/${type}/section-2/${id}`);
                }}
              >
                Proceed
              </button>
              <button
                className="section-one-reset-btn"
                onClick={() => {
                  localStorage.removeItem("storage");
                  navigate(`/${type}/section-1/${id}`);
                  setSelectedOptions([]);
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <div className="section-two-device-name">
            {productData.model} {productData.variant}
          </div>
          <div className="section-one-description">
            Please select the options below which matches your device
          </div>
          <div className="section-one-main-container">
            <div className="section-one-main-sub-container">
              {attributes.map((attribute) => (
                <div
                  key={attribute.attributeHeading}
                  className="section-one-attribute-container"
                >
                  <div className="section-one-attribute-heading">
                    {attribute.attributeHeading}
                  </div>
                  <div className="section-one-attribute-options-container">
                    {attribute.options.map((option) => (
                      <div
                        key={option.optionHeading}
                        className="section-one-attribute-option"
                      >
                        <div className="section-one-attribute-option-heading">
                          {option.optionHeading}
                          <PinkSwitch
                            size="large"
                            checked={selectedOptions.some(
                              (selected) =>
                                selected.attributeHeading ===
                                  attribute.attributeHeading &&
                                selected.optionHeading === option.optionHeading
                            )}
                            onChange={() =>
                              handleSwitchToggle(
                                attribute.attributeHeading,
                                option
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mobile-questions-container">
              <div className="mobile-questions-content">
                {displayOptions.map((option) => (
                  <li>
                    {option.optionType === "add" ? (
                      <span>
                        <div className="questions-tick-mark"></div>
                      </span>
                    ) : (
                      <span className="questions-cross-mark"></span>
                    )}
                    {option.optionHeading}{" "}
                  </li>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Section1;
