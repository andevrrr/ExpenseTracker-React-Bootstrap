import React, { useState } from "react";

const EditCategoryPopup = ({
  onClose,
  onSave,
  categories,
  selectedPurchase,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(
    selectedPurchase.category
  );

  return (
    <div className="popup">
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button onClick={() => onSave(selectedCategory, selectedPurchase)}>
        Save
      </button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default EditCategoryPopup;