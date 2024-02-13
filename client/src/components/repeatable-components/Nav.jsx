import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect } from "react";
import axios from "axios";
import ReplaceLoader from "../repeatable-components/ReplaceLoader";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useLocation } from "react-router-dom";
import "./Nav.css";

const Nav = ({ onNav }) => {
  const { id } = useParams();
  const location = useLocation();
  const [condition, setCondition] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const reduxCity = useSelector((state) => state.city);
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    if (
      location.pathname === "/about-us" ||
      location.pathname === "/sellify-login" ||
      location.pathname === `/login/${id}/mobile` ||
      location.pathname === "/faq"
    ) {
      setCondition(true);
    }
  }, []);

  const phone = useSelector((state) => state.phone);
  const [isCityModalOpen, setCityModalOpen] = useState(false);
  const [city, setCity] = useState([]);
  const [responsiveMenu, setResponvieMenu] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOptions, setMobileOptions] = useState([]);
  const [navAnimation, setNavAnimation] = useState(false);
  const [showMobileOptions, setShowMobileOptions] = useState(false);
  const [Loading, setLoading] = useState(false);

  const open = Boolean(anchorEl);
  const openLogoutModal = () => {
    setLogoutModalOpen(true);
  };

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

  const getMobileOptions = async () => {
    setLoading(true);
    await axios
      .get("http://api.selligo.in/brand/brands-category-menu/mobile")
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        setMobileOptions(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };
  useEffect(() => {
    getMobileOptions();
    getCityData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccountProfileHover = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDocumentClick = (event) => {
    if (responsiveMenu && !event.target.closest(".Home-main-responsive-menu")) {
      setResponvieMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [responsiveMenu]);

  const userStatus = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div>
      <div className="Home-menu-icon">
        {!responsiveMenu && (
          <MenuIcon
            onClick={() => {
              event.stopPropagation();
              setResponvieMenu(true);
              setNavAnimation(true);
            }}
          />
        )}
      </div>
      <div className="Home-main-nav">
        {!condition && (
          <div
            className="sellify-nav-logo"
            onClick={() => {
              navigate("/");
            }}
          ></div>
        )}
        {condition && (
          <div
            className="sellify-nav-logo-2"
            onClick={() => {
              navigate("/");
            }}
          ></div>
        )}

        <div
          className="Home-main-nav-items"
          onClick={() => {
            navigate("/");
          }}
        >
          Home
        </div>
        <div
          className="Home-main-nav-items sell-your-phone"
          onMouseEnter={() => setShowMobileOptions(true)}
          onMouseLeave={() => setShowMobileOptions(false)}
        >
          Sell your phone
          {showMobileOptions && (
            <div className="sell-your-phone-options">
              {mobileOptions.map((item) => (
                <div
                  className="sell-your-phone-options-item"
                  onClick={() => {
                    const ecodedBrandName = encodeURIComponent(item);
                    navigate(`/mobile/${ecodedBrandName}`);
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>
        <div
          className="Home-main-nav-items"
          onClick={() => {
            navigate("/about-us");
          }}
        >
          About Us{" "}
        </div>
        <div
          className="Home-main-nav-items"
          onClick={() => {
            navigate("/contact");
          }}
        >
          Contact Us{" "}
        </div>
        <div
          className="Home-main-nav-items"
          onClick={() => {
            setCityModalOpen(true);
          }}
        >
          <LocationOnIcon />
          {reduxCity ? `${reduxCity}` : "Select City"}
        </div>
        <div className="Home-main-nav-sub-container">
          {/* <div className="Home-main-nav-sub-container-search-icon">
            <SearchIcon />
          </div> */}
          {userStatus ? (
            <div
              className="Home-main-nav-items"
              onMouseEnter={handleAccountProfileHover}
            >
              <AccountCircleIcon
                className="account-circle-icon"
                id="fade-button"
                aria-controls={open ? "fade-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              />
              <Menu
                id="fade-menu"
                MenuListProps={{
                  "aria-labelledby": "fade-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                TransitionComponent={Fade}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  Profile
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/orders");
                  }}
                >
                  My Orders
                </MenuItem>
              </Menu>
            </div>
          ) : (
            ""
          )}

          {/* <div className="Home-main-nav-sub-container-line"></div> */}
          {!userStatus ? (
            <button
              className="Home-main-nav-sub-container-login-btn"
              onClick={() => {
                navigate("/sellify-login");
              }}
            >
              Login
            </button>
          ) : (
            <button
              className="Home-main-nav-sub-container-login-btn home-main-logout-location"
              onClick={openLogoutModal}
            >
              Log out
            </button>
          )}
          {/* <div
            className="location-mobile"
            onClick={() => {
              setCityModalOpen(true);
            }}
          >
            <LocationOnIcon /> {selectedCity ? { selectedCity } : "Select City"}
          </div> */}
        </div>
      </div>
      {responsiveMenu && (
        <div
          className={`Home-main-responsive-menu ${
            navAnimation ? "home-nav-animation" : ""
          }`}
        >
          <div
            className="home-nav-heading"
            onClick={() => {
              setResponvieMenu(false);
            }}
          ></div>
          <div
            className="home-main-responsive-item"
            onClick={() => {
              setResponvieMenu(false);
              navigate("/");
            }}
          >
            Home
          </div>

          {userStatus ? (
            <div
              className="home-main-responsive-item"
              onClick={() => {
                setResponvieMenu(false);
                navigate("/profile");
              }}
            >
              My Profile
            </div>
          ) : (
            ""
          )}

          {userStatus ? (
            <div
              className="home-main-responsive-item"
              onClick={() => {
                setResponvieMenu(false);
                navigate("/orders");
              }}
            >
              My Orders
            </div>
          ) : (
            ""
          )}

          <div
            className="home-main-responsive-item"
            onClick={() => {
              setResponvieMenu(false);
              navigate("/contact");
            }}
          >
            Contact Us
          </div>
          <div
            className="home-main-responsive-item"
            onClick={() => {
              setResponvieMenu(false);
              navigate("/about-us");
            }}
          >
            About Us
          </div>
          <div
            className="home-main-responsive-item"
            onClick={() => {
              setCityModalOpen(true);
            }}
          >
            <LocationOnIcon />
            {reduxCity ? `${reduxCity}` : "Select City"}
          </div>

          {/* <div
            className="home-main-responsive-item"
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "logout" });
              navigate("/");
            }}
          >
            Log Out
          </div> */}
        </div>
      )}
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
            onClick={() => {
              sessionStorage.setItem("hasSkippedModal", "true");
              setCityModalOpen(false);
            }}
          >
            Skip
          </button>
        </div>
      </div>
      {logoutModalOpen && (
        <div className="logout-modal">
          <div className="logout-modal-content">
            <p>Are you sure you want to log out?</p>
            <button
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "logout" });
                navigate("/");
                setLogoutModalOpen(false);
              }}
            >
              Yes
            </button>
            <button onClick={() => setLogoutModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nav;
