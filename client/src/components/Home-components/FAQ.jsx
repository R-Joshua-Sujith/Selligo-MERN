import React, { useState } from "react";
import "./FAQ.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useNavigate } from "react-router-dom";

const FAQ = () => {
  const navigate = useNavigate();
  const faqItems = [
    {
      question: "How to sell your old/used phones online?",
      answer:
        "open selligo website select date time and schedule ur free pick up.",
    },
    {
      question: "Can I sell my phone from anywhere?",
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
  ];

  const [visibleAnswerIndex, setVisibleAnswerIndex] = useState(null);

  const toggleAnswerVisibility = (index) => {
    setVisibleAnswerIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="faq-main-container">
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
        <button
          className="faq-more-button"
          onClick={() => {
            navigate("/faq");
          }}
        >
          More FAQ's
        </button>
      </div>
    </div>
  );
};

export default FAQ;
