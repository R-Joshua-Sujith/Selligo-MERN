import React from "react";
import "./SectionTemplate.css";
import BigLoader from "../repeatable-components/BigLoader";

const SectionTemplate = () => {
  return (
    <div className="section-template-container">
      <BigLoader />
    </div>
  );
};

export default SectionTemplate;
