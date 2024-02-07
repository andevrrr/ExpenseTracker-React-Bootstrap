import React, { useState } from "react";

const AddPurchasePopup = ({ categories, onSave, onClose }) => {
  const [newPurchase, setNewPurchase] = useState({
    paymentDate: "",
    businessName: "",
    payer: "",
    amount: "",
    category: categories.length > 0 ? categories[0] : "Other",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPurchase({ ...newPurchase, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newPurchase);
  };

  return (
    <div
      className="popup d-flex justify-content-center align-items-center position-fixed  w-100 h-100"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="card" style={{ width: "50rem" }}>
        <div className="card-header">
          <h5 className="card-title">Add New Purchase</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Payment Date:</label>
              <input
                type="date"
                className="form-control"
                name="paymentDate"
                value={newPurchase.paymentDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label>Business Name:</label>
              <input
                type="text"
                className="form-control"
                name="businessName"
                value={newPurchase.businessName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label>Payer:</label>
              <input
                type="text"
                className="form-control"
                name="payer"
                value={newPurchase.payer}
                onChange={handleChange}
              />
            </div>
            <div className="form-group mt-3">
              <label>Amount:</label>
              <input
                type="number"
                className="form-control"
                name="amount"
                value={newPurchase.amount}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group mt-3">
              <label>Category:</label>
              <select
                className="form-control"
                name="category"
                value={newPurchase.category}
                onChange={handleChange}
                required
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="d-flex justify-content-end mt-3">
              <button
                type="button"
                className="btn btn-secondary mr-2"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn primary-background-color">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPurchasePopup;
