import React, { useEffect, useState } from "react";
import "./FAQ.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Nav from "../repeatable-components/Nav";
import Footer2 from "../repeatable-components/Footer2";

const FaqPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqItems = [
    {
      question: "How to sell your old/used  phones online?",
      answer:
        "open selligo website select date time and schedule ur free pick up.",
    },
    {
      question: "Can I sell my phone  from anywhere?",
      answer:
        "Currently we are only serving in Bangalore and Hyderabad yeah u can sell ur phone anywhere from Bangalore and Hyderabad.",
    },
    {
      question: "What details do I need to sell old mobile phones?",
      answer:
        "select ur device model,condition & age of ur device to sell ur old device..",
    },
    {
      question: "Which brands are accepted in Selligo?",
      answer:
        "we do buy all brands mobile phone’s like apple,Samsung,oneplus and more...",
    },
    ,
    {
      question: "How will I receive money  after selling my phone online",
      answer: "Instant cash at ur doorstep.",
    },
    ,
    {
      question: "How much do broken  phones sell for?",
      answer:
        " It depends on the model and brand according to the market value we minus the price of the broken part and buy them for a good price",
    },
    {
      question: "Can I sell iPhones that are 8 years old?",
      answer:
        "Yes you can sell your old phones which are in working condition.",
    },
    ,
    {
      question: "If my phone has a display problem,how can I sell it?",
      answer:
        "we have given you the options in our website to select the conditions of the mobile there you can select the option like (screen broken, screen discolouration and more...",
    },
    ,
    {
      question:
        "Is there a customer support service available to assist with the selling process?",
      answer:
        "yes we assist you if you’re facing any problem while the selling process.",
    },
    ,
    {
      question: "Can I sell multiple phones at once on the same platform?",
      answer:
        "yes,you can sell multiple phones at once on our platform selligo.",
    },
    {
      question:
        "Do I need the original accessories and box to sell my phone online?",
      answer:
        "yes, you do need the original accessories and box the sell your device online",
    },
  ];
  const [visibleAnswerIndex, setVisibleAnswerIndex] = useState(null);

  const toggleAnswerVisibility = (index) => {
    setVisibleAnswerIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    <div className="faq-main-container">
      <Nav />
      <div className="faq-sub-main-container">
        <h1 className="faq-heading">FAQ's</h1>
        <div className="faq-question-collections">
          {faqItems.map((item, index) => (
            <div key={index} className="faq-main-question-container">
              <div className="faq-question-container">
                <div className="faq-question">{item.question}</div>
                <div>
                  <KeyboardArrowDownIcon
                    className="faq-arrow"
                    style={{
                      display: visibleAnswerIndex === index ? "none" : "block",
                      fontSize: "70px",
                      color: "white",
                    }}
                    onClick={() => toggleAnswerVisibility(index)}
                  />
                  <KeyboardArrowUpIcon
                    className="faq-arrow"
                    style={{
                      display: visibleAnswerIndex === index ? "block" : "none",
                      fontSize: "70px",
                      color: "white",
                    }}
                    onClick={() => toggleAnswerVisibility(index)}
                  />
                </div>
              </div>
              {visibleAnswerIndex === index && (
                <div className="faq-answer">{item.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer2 />
    </div>
  );
};

export default FaqPage;
