import React from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState } from "react";
import "./AddPinCode.css";
import Navigation from "../RepeatableComponents/Navigation";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPinCode = () => {
  const [stateName, setStateName] = useState("");
  const [cityName, setCityName] = useState("");
  const [pinCodes, setPinCodes] = useState("");
  const [Loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
      const response = await axios.post(
        "http://localhost:5000/pincode/create/pincode",
        formData
      );
      setLoading(false);
      // Handle the response data as needed
      toast.success("PinCode Added Successfully");
      setStateName("");
      setCityName("");
      setPinCodes("");
      console.log("Pincode added:", response.data);
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
    }
  };

  return (
    <div className="add-pincode-container">
      <Navigation />
      <div className="add-pincode-small-container">
        <h1>Add Pincode</h1>
        <form onSubmit={handleSubmit}>
          <TextField
            label="State Name"
            margin="normal"
            value={stateName}
            onChange={(e) => setStateName(e.target.value)}
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
            value={pinCodes}
            onChange={(e) => setPinCodes(e.target.value)}
          />
          <br />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            disabled={Loading}
          >
            {Loading ? "Creating" : "SUBMIT"}
          </Button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddPinCode;
