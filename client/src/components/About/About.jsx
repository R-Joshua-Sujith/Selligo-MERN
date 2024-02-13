import React from "react";
import Nav from "../repeatable-components/Nav";
import "./About.css";
import Footer2 from "../repeatable-components/Footer2";
import { useEffect } from "react";
import GoogleAdsTag from "../repeatable-components/GoogleAdsTag";
const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="about-us-main-container">
      <Nav />
      <div className="about-us-sub-container">
        <div className="about-us-heading">WE ARE</div>
        <div className="about-us-content-container">
          <div className="about-us-content">
            <div className="about-us-heading">YOU</div>
            <div className="about-us-heading-description">
              Welcome to Sellify, our mission is to transform the way people
              sell their old gadgets online. It allows you to sell Mobile
              Phones, iPads, Tablets & watches in exchange for instant cash at
              your doorstep. We're dedicated to providing you the very best
              price for your old gadget with the least amount of efforts using
              our website and app, with an emphasis on through our localized
              network of professional buyers across the city, we make sure you
              are able to sell your old or used gadgets in the fastest way
              possible and get the best customer experience. It's this simple.
            </div>
            <div className="about-us-heading-black">WITH</div>
          </div>
          <div className="about-us-image"></div>
        </div>
        <div className="about-us-heading-black">MUCH LOVE</div>
        <div className="about-us-description">
          We believe in offering a complete solution wherein customers can sell
          old or used gadgets hassle-free. Going forward with the motto "one
          man's waste could be another's resource", Cashmen enables the
          customers to sell their old gadgets online and get instant cash along
          with free home/office/residential pick up. From getting a customer's
          request till making the final payment everything is aimed to be
          providing the best most convenient and secure solutions, providing the
          best way possible to sell your used gadgets online and get instant
          cash.
        </div>

        <iframe
          className="iframe-video"
          width="95%"
          src="https://www.youtube.com/embed/vYQEUhkkJTE?si=MR6aQM78Qec04JCK"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <Footer2 />
      <GoogleAdsTag trackingId="AW-11482642479" />
    </div>
  );
};

export default About;
