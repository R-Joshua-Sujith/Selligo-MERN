import React from "react";
import { useState, useEffect } from "react";
import "./Section4.css";
import Nav from "../repeatable-components/Nav";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import BigLoader from "../repeatable-components/BigLoader";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { Toast } from "bootstrap";
const Section4 = () => {
  const userStatus = useSelector((state) => state.user);
  console.log(userStatus);
  const { id, type } = useParams();
  const [productData, setProductData] = useState({});
  const [currentpageHeading, setCurrentPageHeading] = useState([]);
  const [previouspageHeading, setPreviousPageHeading] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [displayOptions, setDisplayOptions] = useState([]);

  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate("");
  const [Loading, setLoading] = useState(false);
  const getCategoryData = () => {
    const categoryOptions = localStorage.getItem("categoryOptions");
    const parsedCategoryOptions = JSON.parse(categoryOptions);
    setPreviousPageHeading(parsedCategoryOptions.sections[1].pageHeading);
    setCurrentPageHeading(parsedCategoryOptions.sections[2].pageHeading);
    setOptions(parsedCategoryOptions.sections[2].options);
    const storedOptions = localStorage.getItem("storage");
    if (storedOptions) {
      const parsedOptions = JSON.parse(storedOptions);
      setDisplayOptions(parsedOptions);
      setSelectedOptions(parsedOptions);

      // Check if there is an option with the pageHeading of currentPageHeading
      const selectedOptionOnLoad = parsedOptions.find(
        (option) => option.pageHeading === "Device condition"
      );

      // If found, set it as the selectedOption
      if (selectedOptionOnLoad) {
        setSelectedOption(selectedOptionOnLoad);
      }
    } else {
      // If "storage" is not present, create it with an empty array
      localStorage.setItem("storage", JSON.stringify([]));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    const productName = localStorage.getItem("productName");
    const parsedProductName = JSON.parse(productName);
    setProductData(parsedProductName);

    getCategoryData();
  }, []);

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
        <div className="section-four-container">
          <div className="section-four-heading-container">
            <div className="section-four-heading">
              <span
                className="section-four-heading-black"
                onClick={() => {
                  navigate(`/${type}/section-3/${id}`);
                }}
              >
                {previouspageHeading} &gt;{" "}
              </span>
              <span className="section-four-heading-purple">
                {currentpageHeading}
              </span>
            </div>
            <div className="section-four-button-container">
              <button
                className="section-four-button-proceed"
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

                  if (userStatus) {
                    navigate(`/${type}/placeOrder/${id}`);
                  } else {
                    navigate(`/login/${id}/${type}`);
                  }
                }}
              >
                Proceed
              </button>
              <button
                className="section-four-button-reset"
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
          <div className="section-four-device-name">
            {productData.model} {productData.variant}
          </div>
          {/* <div className="section-four-device-description">
            We currently only accept devices that switch on without any issues
          </div> */}

          <div className="section-three-main-container">
            <div>
              <div className="section-four-device-option-main-heading">
                Select Overall condition of your device ?
              </div>
              <div className="section-four-option-container">
                {options.map((item) => (
                  <div
                    className={`section-four-option ${
                      selectedOption?.optionHeading === item.optionHeading
                        ? "section-four-option-selected"
                        : ""
                    }`}
                    key={item.optionHeading}
                    onClick={() => handleOptionClick(item)}
                  >
                    <div className="section-four-option-heading">
                      {item.optionHeading}
                    </div>
                    <div className="section-four-option-description">
                      {item.optionDescription
                        .split(",")
                        .map((option, index) => (
                          <li key={index}>{option.trim()}</li>
                        ))}
                    </div>
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

export default Section4;
