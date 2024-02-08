import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const EditCategoryPopup = ({
  onClose,
  onSave,
  categories,
  selectedPurchase,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(
    selectedPurchase.category
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      className="popup d-flex justify-content-center align-items-center position-fixed  w-100 h-100"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="card" style={{ width: "20rem" }}>
        <div className="card-body">
          <h5 className="card-title">Edit Category</h5>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <div className="mt-3 d-flex justify-content-end">
            <button
              className="btn me-2 btn-success primary-background-color border-0"
              style={{ color: "white" }}
              onClick={() => onSave(selectedCategory, selectedPurchase)}
            >
              Save
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCategoryPopup;
