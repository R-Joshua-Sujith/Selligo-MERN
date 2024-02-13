import React from "react";
import "./AddPromoCode.css";
import Navigation from "../RepeatableComponents/Navigation";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddPromoCode = () => {
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [Loading, setLoading] = useState(false);
  const submit = async () => {
    if (code === "" || value === "") {
      toast.warning("Please fill all the fields");
    } else {
      setLoading(true);
      await axios
        .post("http://api.selligo.in/promo/create/promocode", {
          code: code,
          discountAmount: value,
        })
        .then((res) => {
          setLoading(false);
          toast.success("Promo created Successfully");
          setCode("");
          setValue("");
        })
        .catch((err) => {
          setLoading(false);
          toast.error(err.response.data.error);
        });
    }
  };
  return (
    <div className="add-promo-code-container">
      <Navigation />
      <div className="add-promo-sub-container">
        <h1 className="view-heading">Add Promo Code</h1>
        <div>
          <TextField
            label="Promo Code"
            margin="normal"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
            }}
          />
          <br />
          <TextField
            value={value}
            label="Value"
            margin="normal"
            type="number"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <br />
          <Button
            variant="contained"
            sx={{
              mt: 2,
              mr: 2,
              mb: 2,
              backgroundColor: "#5644c4",
              padding: 2,
              fontSize: 14,
              "&:hover": {
                backgroundColor: "white",
                color: "#5644c4",
              },
            }}
            onClick={submit}
            disabled={Loading}
          >
            {Loading ? "Creating" : "Create Promo Code"}
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddPromoCode;
