import { FiEdit, FiX } from "react-icons/fi";

const PurchasesList = ({
  financial,
  purchases,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <>
      {purchases.map((purchase, index) => (
        <div key={index} className="card mb-2">
          <div className="card-body md:flex justify-between items-center">
            <div className="md:w-1/3">
              <strong className="text-base md:text-lg">
                {financial ? purchase.businessName : purchase.payer}
              </strong>
            </div>
            <div className="md:w-1/3 text-end md:text-right mb-2">
              <div className="text-sm md:text-base">{purchase.amount}€</div>
              <div className="text-xs md:text-sm text-muted">{purchase.category}</div>
            </div>
            <div className="flex justify-end items-center ">
              <button
                className="btn btn-outline-secondary me-2 btn-sm"
                onClick={() => onEditClick(purchase)}
              >
                <FiEdit className="text-sm md:text-base" />
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDeleteClick(purchase)}
              >
                <FiX className="text-sm md:text-base" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default PurchasesList;
