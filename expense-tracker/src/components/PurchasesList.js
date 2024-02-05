import { FiEdit } from "react-icons/fi";

const PurchasesList = ({ financial, purchases, onEditClick }) => {
  return (
    <>
      {purchases.map((purchase, index) => (
        <div key={index} className="card mb-2">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div className="col-4">
              <strong>
                {financial ? purchase.businessName : purchase.payer}
              </strong>
            </div>
            <div className="col-4 d-flex justify-content-end">
              <button
                className="btn btn-outline-secondary"
                onClick={() => onEditClick(purchase)}
              >
                <FiEdit />
              </button>
            </div>
            <div className="col-4 text-end">
              <div>{purchase.amount}€</div>
              <div className="text-muted">{purchase.category}</div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PurchasesList;
