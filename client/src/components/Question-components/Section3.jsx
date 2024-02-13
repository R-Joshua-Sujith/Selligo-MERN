import React from "react";
import { useState, useEffect } from "react";
import "./Section3.css";
import Nav from "../repeatable-components/Nav";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import BigLoader from "../repeatable-components/BigLoader";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
const Section3 = () => {
  const { id, type } = useParams();
  const [productData, setProductData] = useState({});
  const [currentpageHeading, setCurrentPageHeading] = useState([]);
  const [previouspageHeading, setPreviousPageHeading] = useState([]);
  const [options, setOptions] = useState([]);
  const navigate = useNavigate("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [Loading, setLoading] = useState(false);
  const [displayOptions, setDisplayOptions] = useState([]);
  const [brand, setBrand] = useState("");

  const getCategoryData = async () => {
    const storedOptions = localStorage.getItem("storage");
    console.log("box", displayOptions);
    const parsedOptions = JSON.parse(storedOptions);
    console.log("bill", parsedOptions);
    setLoading(false);
    const categoryOptions = localStorage.getItem("categoryOptions");
    const parsedCategoryOptions = JSON.parse(categoryOptions);
    setPreviousPageHeading(parsedCategoryOptions.sections[0].pageHeading);
    setCurrentPageHeading(parsedCategoryOptions.sections[1].pageHeading);

    const filteredOptions = parsedCategoryOptions.sections[1].options.filter(
      (item) =>
        parsedOptions.some(
          (storedOption) =>
            storedOption.optionHeading === item.optionHeading &&
            storedOption.optionType === item.optionType
        ) || !["Bill", "Box"].includes(item.optionHeading)
    );

    const neitherBillNorBoxPresent = !parsedOptions.some((option) =>
      ["Bill", "Box"].includes(option.optionHeading)
    );

    if (neitherBillNorBoxPresent) {
      filteredOptions.splice(0, 3);
    }
    if (productData.brandName === "Apple") {
      setOptions(parsedCategoryOptions.sections[1].options);
    } else {
      setOptions(filteredOptions);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedOptions = localStorage.getItem("storage");
    if (storedOptions) {
      const parsedOptions = JSON.parse(storedOptions);
      setDisplayOptions(parsedOptions);
      setSelectedOptions(parsedOptions);
      console.log("hiparse", parsedOptions);
      const selectedOptionOnLoad = parsedOptions.find(
        (option) => option.pageHeading === "Device Age"
      );

      // If found, set it as the selectedOption
      if (selectedOptionOnLoad) {
        setSelectedOption(selectedOptionOnLoad);
      }
    } else {
      // If "storage" is not present, create it with an empty array
      localStorage.setItem("storage", JSON.stringify([]));
    }

    const productName = localStorage.getItem("productName");
    const parsedProductName = JSON.parse(productName);
    setProductData(parsedProductName);
    setBrand(parsedProductName.brandName);
    getCategoryData();
  }, [brand]);

  const handleOptionClick = (item) => {
    // Clear the previously selected option
    setSelectedOption(null);

    // Select the new option
    setSelectedOption({
      pageHeading: currentpageHeading,
      optionHeading: item.optionHeading,
      optionType: item.optionType,
    });
  };

  return (
    <div>
      <Nav />
      {Loading ? (
        <BigLoader />
      ) : (
        <div className="section-three-container">
          <div className="section-three-heading-container">
            <div className="section-three-heading">
              <span
                className="section-three-heading-black"
                onClick={() => {
                  navigate(`/${type}/section-2/${id}`);
                }}
              >
                {previouspageHeading} &gt;{" "}
              </span>
              <span className="section-three-heading-purple">
                {currentpageHeading}
              </span>
            </div>
            <div className="section-three-button-container">
              <button
                className="section-three-button-proceed"
                onClick={() => {
                  if (!selectedOption) {
                    toast.warning("Please select an option before proceeding.");
                    return;
                  }
                  // Check if selectedOptions already contains an option with the same pageHeading
                  const existingOptionIndex = selectedOptions.findIndex(
                    (option) =>
                      option.pageHeading === selectedOption.pageHeading
                  );

                  if (existingOptionIndex !== -1) {
                    // If an option with the same pageHeading exists, replace it
                    const updatedStoredOptions = [...selectedOptions];
                    updatedStoredOptions[existingOptionIndex] = selectedOption;
                    localStorage.setItem(
                      "storage",
                      JSON.stringify(updatedStoredOptions)
                    );
                  } else {
                    // If not, add the selectedOption to selectedOptions
                    const updatedStoredOptions = [
                      ...selectedOptions,
                      selectedOption,
                    ];
                    localStorage.setItem(
                      "storage",
                      JSON.stringify(updatedStoredOptions)
                    );
                  }

                  navigate(`/${type}/section-4/${id}`);
                }}
              >
                Proceed
              </button>
              <button
                className="section-three-button-reset"
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
          <div className="section-three-device-name">
            {productData.model} {productData.variant}
          </div>
          {/* <div className="section-three-device-description">
            Select the your device age
          </div> */}

          {/* <ul>
            <li>Bill Mandatory</li>
            <li>Warranty must be valid</li>
          </ul> */}
          <div className="section-three-main-container">
            <div>
              <div className="section-three-device-option-main-heading">
                How Old Is Your Device ?
              </div>
              <div className="section-three-device-option-container">
                {" "}
                {options.map((item) => (
                  <div
                    key={item.optionHeading}
                    className={`section-three-device-option ${
                      selectedOption?.optionHeading === item.optionHeading
                        ? "section-three-device-option-selected"
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
      <ToastContainer />
    </div>
  );
};

export default Section3;
