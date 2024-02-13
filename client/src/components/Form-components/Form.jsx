import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import "./Form.css";
import Nav from "../repeatable-components/Nav";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import BigLoader from "../repeatable-components/BigLoader";
import SectionTemplate from "../Question-components/SectionTemplate";
const Form = () => {
  const { id } = useParams();
  const phone = useSelector((state) => state.phone);
  const reduxCity = useSelector((state) => state.city);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [promoStatus, setPromoStatus] = useState("");
  const [promoName, setPromoName] = useState("");
  const [promoPrice, setPromoPrice] = useState("");

  const [Loading, setLoading] = useState(false);

  const [orders, setOrders] = useState(null);

  const getUserData = async () => {
    setLoading(true);
    await axios
      .get(`http://api.selligo.in/user/api/users/${phone}`)
      .then((res) => {
        setLoading(false);
        const existingOrders = JSON.parse(localStorage.getItem("orders"));
        setOrders(existingOrders);

        console.log(existingOrders);

        if (existingOrders) {
          setPromoStatus(existingOrders.promoStatus);
          setPromoName(existingOrders.promoName);
          setPromoPrice(existingOrders.promoPrice);
          setFirstName(existingOrders.firstName || res.data.firstName);
          setLastName(existingOrders.lastName || res.data.lastName);
          setEmail(existingOrders.email || res.data.email);
          setAddPhone(existingOrders.addPhone || res.data.addPhone);
          setAddress(existingOrders.address || res.data.address);
          setZipCode(existingOrders.zipCode || res.data.zipCode);
          setCity(existingOrders.city || res.data.city || reduxCity);
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Check if there are existing orders in localStorage

    // If there are existing orders, populate the form fields
    window.scrollTo(0, 0);
    getUserData();
  }, []); // The empty dependency array ensures that this effect runs only once during component mount

  const nameRegex = /^[A-Za-z-' ]{3,}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{10}$/;
  const addressRegex = /^.{5,}$/;

  const pinCodeRegex = /^\D?(\d{6,})$/;

  return (
    <div className="form-container">
      <Nav />
      {Loading ? (
        <SectionTemplate />
      ) : (
        <div className="form-sub-container">
          <div className="form-heading-container">
            <div className="form-heading-sub-container">
              <div className="form-heading">PERSONAL DETAILS</div>
              <div
                className="form-small-heading"
                onClick={async () => {
                  if (
                    firstName === "" ||
                    lastName === "" ||
                    email === "" ||
                    phone === "" ||
                    address === "" ||
                    zipCode === "" ||
                    city === ""
                  ) {
                    toast.warning("Please fill all the fields");
                  } else {
                    if (!nameRegex.test(firstName)) {
                      toast.warning("Name length must be atleast 3 characters");
                      return;
                    }
                    if (!nameRegex.test(lastName)) {
                      toast.warning("Last name must be atleast 3 characters");
                      return;
                    }
                    if (!emailRegex.test(email)) {
                      toast.warning("Invalid Email");
                      return;
                    }
                    if (!phoneRegex.test(phone)) {
                      toast.warning("Invalid Phone Number");
                      return;
                    }
                    if (addPhone) {
                      if (!phoneRegex.test(addPhone)) {
                        toast.warning("Invalid Additional Phone Number");
                        return;
                      }
                    }
                    if (!addressRegex.test(address)) {
                      toast.warning("Invalid Address");
                      return;
                    }

                    try {
                      setLoading(true);
                      const response = await axios.get(
                        `http://api.selligo.in/pincode/check-pincode/${zipCode}`
                      );

                      const pincodeExists = response.data.pincodeExists;
                      if (pincodeExists) {
                        const formData = {
                          firstName,
                          lastName,
                          email,
                          phone,
                          addPhone,
                          address,
                          zipCode,
                          city,
                          productDetails: orders.productDetails,
                          scheduledPickup: orders.scheduledPickup,
                          promoStatus: promoStatus,
                          promoName: promoName,
                          promoPrice: promoPrice,
                        };

                        await axios
                          .post(
                            `http://api.selligo.in/user/api/users/${phone}`,
                            {
                              firstName,
                              lastName,
                              email,
                              addPhone,
                              address,
                              zipCode,
                              city,
                            }
                          )
                          .then((res) => {
                            setLoading(false);
                            console.log("data saved");
                          })
                          .catch((err) => {
                            setLoading(false);
                            console.log("server error");
                          });

                        // Save the form data under the "orders" item in localStorage
                        localStorage.setItem(
                          "orders",
                          JSON.stringify(formData)
                        );

                        navigate(`/form2/${id}`);
                      } else {
                        setLoading(false);
                        toast.warning(
                          "Oop's We dont provide service to this Pin Code"
                        );
                      }
                    } catch (err) {
                      setLoading(false);
                      console.log("Error Checking Pin Code", err);
                    }
                  }
                }}
              >
                PICKUP TIME
              </div>
            </div>

            <button
              className="form-btn"
              onClick={async () => {
                if (
                  firstName === "" ||
                  lastName === "" ||
                  email === "" ||
                  phone === "" ||
                  address === "" ||
                  zipCode === "" ||
                  city === ""
                ) {
                  toast.warning("Please fill all the fields");
                } else {
                  if (!nameRegex.test(firstName)) {
                    toast.warning("First Name must have atleast 3 Characters");
                    return;
                  }
                  if (!nameRegex.test(lastName)) {
                    toast.warning("Last name must be atleast 3 characters");
                    return;
                  }
                  if (!emailRegex.test(email)) {
                    toast.warning("Invalid Email");
                    return;
                  }
                  if (!phoneRegex.test(phone)) {
                    toast.warning("Invalid Phone Number");
                    return;
                  }
                  if (addPhone) {
                    if (!phoneRegex.test(addPhone)) {
                      toast.warning("Invalid Additional Phone Number");
                      return;
                    }
                  }
                  if (!addressRegex.test(address)) {
                    toast.warning("Invalid Address");
                    return;
                  }
                  try {
                    setLoading(true);
                    const response = await axios.get(
                      `http://api.selligo.in/pincode/check-pincode/${zipCode}`
                    );

                    const pincodeExists = response.data.pincodeExists;
                    if (pincodeExists) {
                      const formData = {
                        firstName,
                        lastName,
                        email,
                        phone,
                        addPhone,
                        address,
                        zipCode,
                        city,
                        productDetails: orders.productDetails,
                        scheduledPickup: orders.scheduledPickup,
                        promoStatus: promoStatus,
                        promoName: promoName,
                        promoPrice: promoPrice,
                      };

                      await axios
                        .post(`http://api.selligo.in/user/api/users/${phone}`, {
                          firstName,
                          lastName,
                          email,
                          addPhone,
                          address,
                          zipCode,
                          city,
                        })
                        .then((res) => {
                          setLoading(false);
                          console.log("data saved");
                        })
                        .catch((err) => {
                          setLoading(false);
                          console.log("server error");
                        });

                      // Save the form data under the "orders" item in localStorage
                      localStorage.setItem("orders", JSON.stringify(formData));

                      navigate(`/form2/${id}`);
                    } else {
                      setLoading(false);
                      toast.warning(
                        "Oop's We dont provide service to this Pin Code"
                      );
                    }
                  } catch (err) {
                    setLoading(false);
                    console.log("Error Checking Pin Code", err);
                  }
                }
              }}
            >
              Next
            </button>
          </div>
          <div className="main-input-container">
            <div className="input-containerr">
              <div className="tooltipp">
                First Name <span className="required-field-form">*</span>
              </div>
              <input
                className="small-input"
                type="text "
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="input-containerr">
              <div className="tooltipp">
                Last Name <span className="required-field-form">*</span>
              </div>
              <input
                className="small-input"
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="main-input-container">
            <div className="input-containerr">
              <div className="tooltipp">
                Email Address <span className="required-field-form">*</span>
              </div>
              <input
                className="small-input"
                type="text"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="input-containerr">
              <div className="tooltipp">
                Phone Number <span className="required-field-form">*</span>{" "}
              </div>
              <input className="small-input" type="tel" value={phone} />
            </div>
            <div className="input-containerr">
              <div className="tooltipp">Additional Number</div>
              <input
                className="small-input"
                type="tel"
                pattern="\d*"
                value={addPhone}
                onChange={(e) => setAddPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="address-container">
            <div className="address-container-heading">ADDRESS DETAILS</div>
            <div className="tooltipp">
              Street Address <span className="required-field-form">*</span>
            </div>
            <input
              type="text"
              className="address-input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="main-input-container">
            <div className="input-containerr">
              <div className="tooltipp">
                Zip Code <span className="required-field-form">*</span>
              </div>
              <input
                className="small-input"
                type="text"
                pattern="\d{6}"
                value={zipCode}
                onChange={(e) => {
                  setZipCode(e.target.value);
                }}
              />
            </div>
            <div className="input-containerr">
              <div className="tooltipp">
                City <span className="required-field-form">*</span>
              </div>
              <input
                className="small-input"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Form;
