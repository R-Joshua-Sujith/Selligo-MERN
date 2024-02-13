import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import "./EditPinCode.css";
import Navigation from "../RepeatableComponents/Navigation";
import { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BigLoader from "../Loader/BigLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const EditPinCode = () => {
  const { id } = useParams();
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [pinCodes, setPinCodes] = useState("");
  const [Loading, setLoading] = useState(false);
  const [pinCodeLoading, setPinCodeLoading] = useState(false);
  useEffect(() => {
    const getPinCodeData = async () => {
      try {
        setPinCodeLoading(true);
        await axios
          .get(`http://localhost:5000/pincode/get-pincode/${id}`)
          .then((response) => {
            setPinCodeLoading(false);
            setStateName(response.data.stateName);
            setCityName(response.data.cityName);
            setPinCodes(response.data.pinCodes.join(","));
          });
      } catch (err) {
        setPinCodeLoading(false);
        alert(response.data.error);
      }
    };
    getPinCodeData();
  }, []);
  const handleSubmit = async (e) => {
    console.log(stateName, cityName, pinCodes);
    e.preventDefault();

    if (stateName === "" || cityName === "" || pinCodes === "") {
      alert("Please enter all the fields");
      return;
    }

    // Convert pinCodes to an array
    const pinCodesArray = pinCodes.split(",").map((code) => code.trim());

    // Prepare the data to be submitted
    const formData = {
      stateName,
      cityName,
      pinCodes: pinCodesArray,
    };

    try {
      setLoading(true);
      // Use Axios to add pin code
      const response = await axios.put(
        `http://localhost:5000/pincode/update-pincode/${id}`,
        formData
      );
      setLoading(false);
      // Handle the response data as needed
      toast.success("PinCode Edited Successfully");

      console.log("Pincode added:", response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };
  return (
    <div className="edit-pin-code-main-container">
      <Navigation />
      {pinCodeLoading ? (
        <BigLoader />
      ) : (
        <div className="edit-pin-code-sub-container">
          <h1>Edit Pincode</h1>
          <form onSubmit={handleSubmit}>
            <TextField
              label="State"
              value={stateName}
              onChange={(e) => {
                setStateName(e.target.value);
              }}
            />
            <br />
            <TextField
              label="City Name"
              margin="normal"
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
            />
            <br />
            <TextareaAutosize
              minRows={3}
              placeholder="Pin Codes (comma-separated)"
              style={{ width: "100%", marginTop: "16px", fontSize: "18px" }}
              defaultValue={pinCodes}
              onChange={(e) => setPinCodes(e.target.value)}
            />
            <br />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={Loading}
            >
              {Loading ? "Saving Changes..." : "Save"}
            </Button>
          </form>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default EditPinCode;
