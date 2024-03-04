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
              Welcome to Selligo, where we're revolutionizing the way you sell
              your old gadgets online. Our mission is simple: to provide you
              with a hassle-free experience that gets you the best price for
              your devices, right at your doorstep. Whether it's mobile phones,
              iPads, tablets, or watches, we've got you covered. With Selligo,
              selling your old gadgets is easier than ever. Our website
              streamline the process, ensuring minimal effort on your part.
            </div>
            <div className="about-us-heading-black">WITH</div>
          </div>
          <div className="about-us-image"></div>
        </div>
        <div className="about-us-heading-black">MUCH LOVE</div>
        <div className="about-us-description">
          Through our extensive network of professional buyers spanning across
          the city, we guarantee a quick turnaround time, so you can get cash
          for your gadgets in no time. Our commitment to you is unmatched. We
          prioritize customer satisfaction above all else, ensuring that your
          experience with Selligo is nothing short of exceptional. So why wait?
          Join us today and experience the future of gadget selling with
          Selligo.
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
