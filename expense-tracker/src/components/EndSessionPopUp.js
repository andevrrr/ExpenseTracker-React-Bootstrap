import React from "react";

const EndSessionPopup = ({ onClose, onConfirm }) => {
  return (
    <div
      className="popup d-flex justify-content-center align-items-center position-fixed  w-100 h-100"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
    >
      <div
        className="card shadow-lg"
        style={{ width: "20rem", borderRadius: "15px" }}
      >
        <div className="card-body">
          <h5 className="card-title">Confirm End Session</h5>
          <p>Are you sure you would like to end the session?</p>
          <div className="d-flex justify-content-end mt-4">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={onConfirm}
            >
              Yes, End Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndSessionPopup;
