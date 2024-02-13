import React from "react";
import "./BlogsPage.css";
import Nav from "../repeatable-components/Nav";
import image from "../../assets/Home/banner-1.jpg";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Footer2 from "../repeatable-components/Footer2";
const BlogsPage = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const data = [
    {
      id: 1,
      blogTitle: "How to sell old device online",
      blogDescription:
        "Selling your old device online is super easy with Selligo the go-to platform for a hassle-free experience where customers can easily sell their used electronics  devices like phone, tablets  and more in exchange of instant cash at their doorstep providing the best value for their device.",
    },
    {
      id: 2,
      blogTitle: "Why Sell On Selligo?",
      blogDescription:
        "Opting to sell your old device on Selligo is a wise decision for several compelling reasons. We guarantee timely and secure data pickup, ensuring the safety of customer information. With Selligo, you can expect prompt pickups, an instant price quote for your device, and a hassle-free selling experience. Our platform prioritizes safety and security, making it easy and secure for you to sell your device and receive payment without any complications.",
    },
    {
      id: 3,
      blogTitle: "How does Selligo Work?",
      blogDescription:
        "Selligo modifies the experience of selling your devices with a simple and efficient process tailored to your needs. As you embark on this journey, the Selligo website becomes your gateway to a user-friendly interface designed to make the entire selling process a breeze. By seamlessly integrating personalized evaluations and market-based pricing, Selligo ensures you receive the most competitive and fair offer for your device. In this guide, we'll walk you through the steps of how Selligo works, emphasizing the platform's commitment to providing a hassle-free and optimized selling experience, from the moment you visit their website to the seamless transaction that follows. \n\n 1.Visit Selligo Website: Start by heading to the Selligo website, where you'll find a user-friendly interface designed to make selling your device a breeze.\n\n 2.Device Details:Once on the website, you'll be prompted to provide information about your device. Share details like the type of device (e.g., smartphone, tablet), its age, and its current condition.\n\n 3.Market-Based Pricing: Selligo uses the information you provide to determine the best selling price for your device, taking into consideration the current market conditions. This ensures that the offer you receive aligns with the real-time value of similar devices in the market. \n\n 4.Personalised Evaluation:Think of this process as a personalized evaluation tailored to your specific device. The more accurate and detailed your information, the more precisely Selligo can assess the value of your tech. \n\n 5.Optimising Your Offer:Selligo's aim is to provide you with the most competitive and fair offer for your device. By supplying accurate details, you enhance the chances of getting the maximum value when selling your device.\n\n 6.Ease of Transaction:  Once you're satisfied with the offered price, Selligo facilitates a smooth transaction process, ensuring a hassle-free experience from valuation to sale.   In a nutshell, Selligo simplifies the selling process by customizing the evaluation to your device's specifics, helping you secure the best value in the dynamic market.     ",
    },
  ];

  const stringWithLineBreaks = data[id - 1].blogDescription.replace(
    /\n/g,
    "<br/>"
  );

  return (
    <div>
      <Nav />
      <div className="single-blog-container">
        <div>
          <h1 className="single-blog-heading">{data[id - 1].blogTitle}</h1>
          <div className="single-blog-sub-container">
            <img src={image} alt="" className="single-blog-image" />
            <div
              className="single-blog-description"
              dangerouslySetInnerHTML={{ __html: stringWithLineBreaks }}
            />
          </div>
        </div>
      </div>
      <Footer2 />
    </div>
  );
};

export default BlogsPage;
