import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import banner1 from "../../assets/Home/banner-1.jpg";
import banner2 from "../../assets/Home/banner-2.jpg";
import banner3 from "../../assets/Home/banner-3.jpg";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import "./Banner.css";

const Banner = () => {
  const navigate = useNavigate();
  const images = [banner1, banner2, banner3];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentImageIndex]);

  const handleImageClick = () => {
    // Add a switch statement to handle different routes based on the current index
    switch (currentImageIndex) {
      case 0:
        navigate("/mobile");
        break;
      case 1:
        navigate("/tablet");
        break;
      case 2:
        navigate("/watch");
        break;
      default:
        break;
    }
  };

  const handleArrowClick = (direction) => {
    if (direction === "prev") {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    } else if (direction === "next") {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  return (
    <div className="Banner-container">
      <div className="Banner-arrow" onClick={() => handleArrowClick("prev")}>
        <ArrowBackIcon />
      </div>
      <div
        onClick={handleImageClick}
        className="Banner-image"
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      ></div>
      <div className="Banner-arrow" onClick={() => handleArrowClick("next")}>
        <ArrowForwardIcon />
      </div>
    </div>
  );
};

export default Banner;
