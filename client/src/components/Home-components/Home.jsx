import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import Nav from "../repeatable-components/Nav";
import axios from "axios";
import ReplaceLoader from "../repeatable-components/ReplaceLoader";
import banner1 from "../../assets/Home/banner-1.jpg";
import banner2 from "../../assets/Home/banner-2.jpg";
import banner3 from "../../assets/Home/banner-3.jpg";
import Video from "./Video";

const Home = () => {
  const navigate = useNavigate();
  const images = [banner1, banner2, banner3];

  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);
  const [isSwipeInProgress, setIsSwipeInProgress] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isSwipeInProgress) {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [currentImageIndex, isSwipeInProgress]);

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

  // useEffect(() => {
  //   localStorage.removeItem("storage");
  //   const getCategoryData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await axios.get(
  //         "https://api.selligo.in/get-all-category-types"
  //       );
  //       setLoading(false);
  //       setCategoryData(response.data);
  //       sessionStorage.setItem("categoryData", JSON.stringify(response.data));
  //     } catch (err) {
  //       setLoading(false);
  //       alert(err.response?.data?.error || "An error occurred");
  //     }
  //   };
  //   getCategoryData();
  // }, []);

  useEffect(() => {
    localStorage.removeItem("storage");
    const getCategoryData = async () => {
      const storedData = sessionStorage.getItem("categoryData");
      if (storedData) {
        const data = JSON.parse(storedData);
        setCategoryData(data);
      } else {
        try {
          setLoading(true);
          const response = await axios.get(
            "https://api.selligo.in/category/get-all-category-types"
          );
          setLoading(false);
          setCategoryData(response.data);
          sessionStorage.setItem("categoryData", JSON.stringify(response.data));
        } catch (err) {
          setLoading(false);
          alert(err.response?.data?.error || "An error occurred");
        }
      }
    };
    getCategoryData();
  }, []);

  const goToCategory = (categoryType) => {
    navigate(`/${categoryType}`);
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setIsSwipeInProgress(true);
  };

  const handleTouchMove = (e) => {
    if (isSwipeInProgress) {
      const touchEndX = e.touches[0].clientX;
      const deltaX = touchEndX - touchStartX;

      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          handleSwipeRight();
        } else {
          handleSwipeLeft();
        }

        setIsSwipeInProgress(false); // Reset swipe flag after image change
      }
    }
  };

  const handleSwipeLeft = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleSwipeRight = () => {
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleTouchEnd = () => {
    setIsSwipeInProgress(false);
  };

  return (
    <div
      className="Home-section"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Video />
      <div className="phone-one"></div>
      <div className="phone-two"></div>
      <div className="phone-three"></div>
      <div className="phone-four"></div>
      <Nav />
      <div
        onClick={handleImageClick}
        className="home-banner"
        style={{ backgroundImage: `url(${images[currentImageIndex]})` }}
      />
      <div className="Home-main-heading Home-main-heading-mt">
        Sell Old Mobile, Tablet,
      </div>
      <div className="Home-main-heading">& Watch for Cash</div>
      <div className="Home-main-description">
        Instant Quote | Assured sale | Doorstep pickup
      </div>

      {loading ? (
        <ReplaceLoader />
      ) : (
        <div className="Home-main-option-container">
          {categoryData.map((item) => (
            <button
              key={item.category_type}
              className="Home-main-option"
              onClick={() => goToCategory(item.category_type)}
            >
              {item.category_type}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
