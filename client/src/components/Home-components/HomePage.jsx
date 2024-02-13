import React, { useEffect, useState } from "react";
import Home from "./Home";
import Best_Selling from "./Best_Selling";
import Footer2 from "../repeatable-components/Footer2";
import Contact from "../repeatable-components/Contact";
import FAQ from "./FAQ";
import Banner from "./Banner";
import How from "./How";
import Blogs from "./Blogs";
import "./HomePage.css";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
import ReplaceLoader from "../repeatable-components/ReplaceLoader";
import { useSelector, useDispatch } from "react-redux";
import GoogleAdsTag from "../repeatable-components/GoogleAdsTag";

const HomePage = () => {
  const phone = useSelector((state) => state.phone);
  const reduxCity = useSelector((state) => state.city);
  const [isCityModalOpen, setCityModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("");
  const dispatch = useDispatch();
  const [Loading, setLoading] = useState(false);
  const cities = ["City1", "City2", "City3", "City4"];
  const [city, setCity] = useState([]);

  const handleSelectCity = (city) => {
    if (city === "") {
      toast.warning("Please select a city");
    } else {
      dispatch({ type: "changeCity", newCity: city });
      setCityModalOpen(false);
      if (phone) {
        axios.put(`http://api.selligo.in/user/api/users/${phone}/city`, {
          city,
        });
      }
    }
    // Do something with the selected city
  };
  const getCityData = async () => {
    setLoading(true);
    await axios
      .get("http://api.selligo.in/pincode/api/cityNames")
      .then((res) => {
        setLoading(false);
        setCity(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  useEffect(() => {
    getCityData();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const hasSkippedModal = sessionStorage.getItem("hasSkippedModal");
    const getCity = async () => {
      try {
        if (phone) {
          const response = await axios.get(
            `http://api.selligo.in/user/api/users/${phone}/city`
          );
          if (response.data.city === "") {
            setTimeout(() => {
              if (selectedCity === "" && !hasSkippedModal) {
                setCityModalOpen(true);
              }
            }, 10000);
          }
        } else {
          setTimeout(() => {
            if (selectedCity === "" && !hasSkippedModal) {
              setCityModalOpen(true);
            }
          }, 10000);
        }
      } catch (err) {}
    };
    getCity();
  }, [selectedCity]);

  return (
    <div>
      <div className={`modal-city ${isCityModalOpen ? "modal-city-open" : ""}`}>
        <div className="modal-city-content">
          <h2>Please select your city</h2>
          {Loading ? (
            <ReplaceLoader />
          ) : (
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="" disabled>
                Select your city
              </option>

              {city.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          )}

          <br />
          <button
            onClick={() => {
              handleSelectCity(selectedCity);
            }}
          >
            Confirm
          </button>
          <button
            onClick={async () => {
              sessionStorage.setItem("hasSkippedModal", "true");
              setCityModalOpen(false);
            }}
          >
            Skip
          </button>
        </div>
      </div>

      <Home />
      <Banner />
      <Best_Selling />
      <How />
      <Blogs />
      <FAQ />
      <Contact />
      <Footer2 />
      <ToastContainer />
    </div>
  );
};

export default HomePage;
