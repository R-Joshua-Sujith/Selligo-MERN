import React from "react";
import ReactDOM from "react-dom";
import "./Modal.css";
const Modal = ({ onClose, onYesClick }) => {
  return (
    <div className="modal-overlayy">
      <div className="modall">
        <p>Does your device turn on?</p>
        <div className="modal-buttonss">
          <button onClick={onYesClick}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
