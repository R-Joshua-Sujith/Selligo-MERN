import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import Nav from "../repeatable-components/Nav";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import "./Form2.css";
import BigLoader from "../repeatable-components/BigLoader";
import SectionTemplate from "../Question-components/SectionTemplate";
const Form2 = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);

  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("1pm-3pm");
  const [finalPrice, setFinalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [promoStatus, setPromoStatus] = useState("false");
  const [promoName, setPromoName] = useState("");
  const [promoPrice, setPromoPrice] = useState("");

  const [modeOfPayment, setModeOfPayment] = useState("cash");
  const [upiId, setUpiId] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    // Retrieve existing orders from localStorage
    const existingOrders = JSON.parse(localStorage.getItem("orders"));
    setFinalPrice(existingOrders.productDetails.price);
    setPromoStatus(existingOrders.promoStatus);
    setPromoName(existingOrders.promoName);
    setPromoPrice(existingOrders.promoPrice);
    // Set orderDetails state with the retrieved orders
    setOrderDetails(existingOrders);
  }, []);

  const handleSchedulePickup = async () => {
    if (!pickupDate || !pickupTime) {
      toast.warning("Please select both pickup date and time.");
      return;
    }
    if (modeOfPayment === "upi" && upiId === "") {
      toast.warning("Please enter upi id");
      return;
    }

    // Continue with the schedule pickup action
    // For example, add the scheduled pickup details to orderDetails
    const scheduledPickup = {
      pickupDate,
      pickupTime,
    };

    const existingOptions = JSON.parse(localStorage.getItem("storage")) || [];
    const status = promoStatus;
    // If orderDetails is an object, add the pickup details as a new property
    if (typeof orderDetails === "object" && orderDetails !== null) {
      const updatedOrderDetails = {
        ...orderDetails,
        scheduledPickup,
        options: existingOptions,
        modeofpayment: modeOfPayment,
        upiID: upiId,
        // promoStatus: status,
        // promoName: promoName,
        // promoPrice: promoPrice,
      };

      // Console log the updated orderDetails

      setLoading(true);
      await axios
        .post("https://api.selligo.in/order/create-order", {
          updatedOrderDetails,
        })
        .then((response) => {
          console.log(updatedOrderDetails);
          setLoading(false);
          localStorage.removeItem("storage");
          setTimeout(() => {
            navigate(`/thank-you`);
          });
        })
        .catch((error) => {
          setLoading(false);
          console.log(error.response);
        });
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const getDayAfterTomorrowDate = (offset = 2) => {
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + offset);
    return dayAfterTomorrow.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  return (
    <div className="form-2-sub-container">
      <Nav />
      {loading ? (
        <SectionTemplate />
      ) : (
        <div className="form-sub-container">
          <div className="form-heading-container">
            <div className="form-heading-sub-container">
              <div
                className="form-heading-2"
                onClick={() => {
                  navigate(`/form/${id}`);
                }}
              >
                PERSONAL DETAILS
              </div>
              <div className="form-small-heading-2">PICKUP TIME</div>
            </div>

            <button className="form-btn" onClick={handleSchedulePickup}>
              Complete Order
            </button>
          </div>
          <div className="main-input-container">
            {/* <div className="input-container">
            <div className="tooltip">Pickup Date</div>
            <input
              className="small-input input-date"
              type="date"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
              min={getTomorrowDate()}
              max={getDayAfterTomorrowDate()}
            />
          </div> */}
            <div className="input-containerr">
              <div className="tooltipp">Pickup Date</div>
              <FormControl fullWidth>
                <InputLabel id="pickup-date-label">Date</InputLabel>
                <Select
                  labelId="pickup-date-label"
                  id="pickup-date-select"
                  value={pickupDate}
                  label="Date"
                  onChange={(e) => setPickupDate(e.target.value)}
                >
                  {finalPrice >= 10000 && (
                    <MenuItem value={getTodayDate()}>
                      {formatDate(getTodayDate())}
                      <br /> Same Day Pick Up Available <br />
                    </MenuItem>
                  )}

                  <MenuItem value={getTomorrowDate()}>
                    {formatDate(getTomorrowDate())}
                  </MenuItem>
                  <MenuItem value={getDayAfterTomorrowDate(2)}>
                    {formatDate(getDayAfterTomorrowDate(2))}
                  </MenuItem>
                  <MenuItem value={getDayAfterTomorrowDate(3)}>
                    {formatDate(getDayAfterTomorrowDate(3))}
                  </MenuItem>
                  <MenuItem value={getDayAfterTomorrowDate(4)}>
                    {formatDate(getDayAfterTomorrowDate(4))}
                  </MenuItem>
                  <MenuItem value={getDayAfterTomorrowDate(5)}>
                    {formatDate(getDayAfterTomorrowDate(5))}
                  </MenuItem>
                  {/* Add more date options as needed */}
                </Select>
              </FormControl>
            </div>
            <div className="input-containerr">
              <div className="tooltipp">Pickup Time</div>
              <FormControl fullWidth>
                <Select
                  labelId="pickup-time-label"
                  id="pickup-time-select"
                  value={pickupTime}
                  label="Time"
                  onChange={(e) => setPickupTime(e.target.value)}
                >
                  <MenuItem value="9am-12pm">9AM - 12PM</MenuItem>
                  <MenuItem value="12pm-3pm">12PM - 3PM</MenuItem>
                  <MenuItem value="3pm-8pm">3PM - 8PM</MenuItem>
                  {/* Add more time slot options as needed */}
                </Select>
              </FormControl>
            </div>

            <div className="input-containerr">
              <div className="tooltipp">Mode of Payment</div>
              <FormControl fullWidth>
                <Select
                  labelId="mode-of-payment-label"
                  id="mode-of-payment-select"
                  value={modeOfPayment}
                  label="Mode of Payment"
                  onChange={(e) => setModeOfPayment(e.target.value)}
                >
                  <MenuItem value="cash">Cash</MenuItem>
                  <MenuItem value="upi">UPI</MenuItem>
                </Select>
              </FormControl>
            </div>

            {modeOfPayment === "upi" && (
              <div className="input-containerr">
                <div className="tooltipp">UPI ID</div>
                <FormControl fullWidth>
                  <input
                    className="upi-id-text"
                    type="text"
                    placeholder="Enter UPI ID"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                  />
                </FormControl>
              </div>
            )}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Form2;
