import React from "react";
import Nav from "../repeatable-components/Nav";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./Profile.css";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import BigLoader from "../repeatable-components/BigLoader";
import GoogleAdsTag from "../repeatable-components/GoogleAdsTag";

const Profile = () => {
  const phone = useSelector((state) => state.phone);
  const reduxCity = useSelector((state) => state.city);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [addPhone, setAddPhone] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [Loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const getUserData = async () => {
    setLoading(true);
    await axios
      .get(`https://api.selligo.in/user/api/users/${phone}`)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        setFirstName(res.data.firstName);
        setLastName(res.data.lastName);
        setEmail(res.data.email);
        setAddPhone(res.data.addPhone);
        setAddress(res.data.address);
        setZipCode(res.data.zipCode);
        if (res.data.city === "") {
          setCity(reduxCity);
        } else {
          setCity(res.data.city);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getUserData();
  }, []);

  const nameRegex = /^[A-Za-z-' ]{3,}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{10}$/;
  const addressRegex = /^.{5,}$/;
  return (
    <div>
      <Nav />
      {Loading ? (
        <BigLoader />
      ) : (
        <div className="user-profile-container-sellify">
          <div className="user-profile-card-sellify">
            <div className="form-sub-container">
              <div className="form-heading-container">
                <div className="form-heading-sub-container">
                  <div className="form-heading">Profile</div>
                </div>

                <button
                  disabled={saveLoading}
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
                        toast.warning(
                          "First Name must have atleast 3 Characters"
                        );
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
                        setSaveLoading(true);
                        const response = await axios.get(
                          `https://api.selligo.in/pincode/check-pincode/${zipCode}`
                        );

                        const pincodeExists = response.data.pincodeExists;
                        if (pincodeExists) {
                          axios
                            .post(
                              `https://api.selligo.in/user/api/users/${phone}`,
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
                              setSaveLoading(false);
                              toast.success("Data Saved Successfully");
                            })
                            .catch((err) => {
                              setSaveLoading(false);
                              toast.error("Server Error");
                            });
                        } else {
                          setSaveLoading(false);
                          toast.warning(
                            "Oop's We dont provide service to this Pin Code"
                          );
                        }
                      } catch (err) {
                        setSaveLoading(false);
                        console.log("Error Checking Pin Code", err);
                      }
                    }
                  }}
                >
                  {saveLoading ? "Saving..." : "Save"}
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
                    Phone Number <span className="required-field-form">*</span>
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
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Profile;
