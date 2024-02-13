import React from "react";
import { useState, useEffect } from "react";
import "./Section2.css";
import Nav from "../repeatable-components/Nav";
import HeadsetIcon from "@mui/icons-material/Headset";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BigLoader from "../repeatable-components/BigLoader";
const Section2 = () => {
  const navigate = useNavigate();
  const { id, type } = useParams();
  const [productData, setProductData] = useState({});
  const [accessories, setAccessories] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [Loading, setLoading] = useState(false);

  const [displayOptions, setDisplayOptions] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const categoryOptions = localStorage.getItem("categoryOptions");
    const productName = localStorage.getItem("productName");
    const parsedProductName = JSON.parse(productName);
    setProductData(parsedProductName);
    const parsedCategoryOptions = JSON.parse(categoryOptions);
    setAccessories(parsedCategoryOptions.sections[0]);
    setOptions(parsedCategoryOptions.sections[0].options);

    const storedOptions = localStorage.getItem("storage");
    if (storedOptions) {
      const parsedOptions = JSON.parse(storedOptions);
      setSelectedOptions(parsedOptions);
      setDisplayOptions(parsedOptions);
    } else {
      // If "storage" is not present, create it with an empty array
      localStorage.setItem("storage", JSON.stringify([]));
    }
  }, []);

  const handleOptionClick = (item) => {
    const isSelected = selectedOptions.some(
      (option) => option.optionHeading === item.optionHeading
    );

    if (isSelected) {
      setSelectedOptions((prevSelected) =>
        prevSelected.filter(
          (selected) => selected.optionHeading !== item.optionHeading
        )
      );
    } else {
      const valueToAdd =
        item.optionType === "add" ? item.optionValue : -item.optionValue;
      setSelectedOptions((prevSelected) => [
        ...prevSelected,
        {
          attributeHeading: item.attributeHeading,
          optionHeading: item.optionHeading,
          optionType: item.optionType,
        },
      ]);
    }
  };
  return (
    <div>
      <Nav />
      {Loading ? (
        <BigLoader />
      ) : (
        <div className="section-two-container">
          <div className="section-two-heading-container">
            <div className="section-two-heading">
              <span
                className="section-two-heading-black"
                onClick={() => {
                  navigate(`/${type}/section-1/${id}`);
                }}
              >
                Attributes &gt;{" "}
              </span>
              <span className="section-two-heading-purple">
                {accessories.pageHeading}
              </span>
            </div>
            <div className="section-two-button-container">
              <button
                onClick={() => {
                  localStorage.setItem(
                    "storage",
                    JSON.stringify(selectedOptions)
                  );
                  navigate(`/${type}/section-3/${id}`);
                  console.log(selectedOptions);
                }}
                className="section-two-button-proceed"
              >
                Proceed
              </button>
              <button
                className="section-two-button-reset"
                onClick={() => {
                  localStorage.removeItem("storage");
                  navigate(`/${type}/section-1/${id}`);
                }}
              >
                Reset
              </button>
            </div>
          </div>
          <div className="mobile-questions-container-2">
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
          <div className="section-two-device-name">
            {productData.model} {productData.variant}
          </div>
          {/* <div className="section-two-device-description">
            We currently only accept devices that switch on without any issues
          </div> */}
          <div className="section-two-main-container">
            <div className="section-two-sub-container">
              <div className="section-two-device-option-main-heading">
                Select Items you have along with mobile
              </div>
              <div className="section-two-device-option-container">
                {options.map((item) => (
                  <div
                    key={item.optionHeading}
                    className={` section-two-device-option${
                      selectedOptions.some(
                        (option) => option.optionHeading === item.optionHeading // Update this line
                      )
                        ? " section-two-device-option-selected" // Add a space before this class
                        : ""
                    }`}
                    onClick={() => handleOptionClick(item)}
                  >
                    {item.optionHeading}
                  </div>
                ))}
              </div>
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

export default Section2;
