import React from "react";
import "./EditPromoCode.css";
import Navigation from "../RepeatableComponents/Navigation";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./AddPromoCode.css";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditPromoCode = () => {
  const { id } = useParams();
  const [code, setCode] = useState("");
  const [value, setValue] = useState("");
  const [Loading, setLoading] = useState(false);

  useEffect(() => {
    const getPromoCode = async () => {
      console.log(id);
      try {
        await axios
          .get(`https://api.selligo.in/promo/promoCode/${id}`)
          .then((response) => {
            setCode(response.data.code);
            setValue(response.data.discountAmount);
          });
      } catch (err) {
        console.log(err);
      }
    };
    getPromoCode();
  }, []);

  const submit = async () => {
    if (code === "" || value === "") {
      toast.warning("Please enter all the fields");
    } else {
      setLoading(true);
      axios
        .put(`https://api.selligo.in/promo/update/promocode/${id}`, {
          code: code,
          discountAmount: value,
        })
        .then((res) => {
          setLoading(false);
          toast.success("Promo code updated Successfully");
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  };
  return (
    <div className="add-promo-code-container">
      <Navigation />
      <div className="add-promo-sub-container">
        <h1 className="view-heading">Edit Promo Code</h1>
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
            label="Value"
            margin="normal"
            type="number"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <br />
          <Button
            onClick={submit}
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
            disabled={Loading}
          >
            {Loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditPromoCode;
