import React from "react";
import "./Contact.css";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import Nav from "../repeatable-components/Nav";
import { useState } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import ReplaceLoader from "./ReplaceLoader";
import { useEffect } from "react";
import EmailIcon from "@mui/icons-material/Email";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [Loading, setLoading] = useState(false);

  const nameRegex = /^[A-Za-z-' ]{3,}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneRegex = /^\d{10}$/;
  const messageRegex = /^.{5,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name === "" || email === "" || phone === "" || message === "") {
      toast.warning("Please Fill all the fields");
    } else {
      if (!nameRegex.test(name)) {
        toast.warning("Name length must be atleast 3 characters");
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
      if (!messageRegex.test(message)) {
        toast.warning("Message must be atleast 5 characters long");
        return;
      }
      try {
        setLoading(true);
        const formData = { name, email, phone, message };

        // Make an API request using Axios
        const response = await axios.post(
          "https://sellify-backend.onrender.com/contact/create",
          formData
        );
        setLoading(false);
        toast.success("We will reach out to you soon!");

        // Handle success, e.g., show a success message or redirect the user

        // Clear the form after successful submission
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } catch (error) {
        setLoading(false);
        // Handle errors, e.g., show an error message to the user
        toast.warning("Server Error");
      }
    }
  };

  return (
    <div>
      <div class="contact-container">
        <span class="big-circle"></span>
        <img src="img/shape.png" class="square" alt="" />
        <div class="form">
          <div class="contact-info">
            <h3 class="title">Let's get in touch</h3>
            <p class="text">
              Effortlessly connect with us by filling out our user-friendly
              Contact Us form. Your inquiries are important to us, and we're
              here to provide swift and personalized assistance.
            </p>

            <div class="info">
              <div class="information">
                <div className="information-icon">
                  <EmailIcon />
                </div>

                <a
                  href={`mailto:selligo.in@gmail.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-anchor-tags"
                >
                  selligo.in@gmail.com
                </a>
              </div>
              <div class="information">
                <div className="information-icon">
                  <LocalPhoneIcon />
                </div>

                <a
                  href={`tel:${7892563937}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-anchor-tags"
                >
                  +91 7892563937
                </a>
              </div>
            </div>

            <div class="social-media">
              <p>Connect with us :</p>
              <div class="social-icons">
                <a
                  href="https://www.facebook.com/profile.php?id=61555141318387&mibextid=LQQJ4d"
                  target="_blank"
                >
                  <FacebookIcon />
                </a>

                <a
                  href="https://www.instagram.com/selligo.in_/?igsh=ZmxsZWtjd21lbjA5&utm_source=qr"
                  target="_blank"
                >
                  <InstagramIcon />
                </a>
                <a
                  href={`https://wa.me/${917892563937}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <WhatsAppIcon />
                </a>
              </div>
            </div>
          </div>

          <div class="contact-form">
            <span class="circle one"></span>
            <span class="circle two"></span>

            <form autocomplete="off">
              <h3 class="title">Contact us</h3>
              <div class="input-container">
                <input
                  type="text"
                  name="name"
                  class="input"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
                <span>Username</span>
              </div>
              <div class="input-container">
                <input
                  type="email"
                  name="email"
                  class="input"
                  placeholder="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
                <span>Email</span>
              </div>
              <div class="input-container">
                <input
                  type="tel"
                  name="phone"
                  class="input"
                  placeholder="phone"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                />
                <span>Phone</span>
              </div>
              <div class="input-container textarea">
                <textarea
                  name="message"
                  class="input"
                  placeholder="message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                  }}
                ></textarea>
                <span>Message</span>
              </div>
              <button
                class="contact-btn"
                onClick={handleSubmit}
                disabled={Loading}
              >
                {Loading ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Contact;
