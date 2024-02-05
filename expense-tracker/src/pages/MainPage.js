import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import "./style.css";
import { FiEdit } from "react-icons/fi";
import categoriesData from "../utils/categories.json";
import categoryColors from "../utils/categoryColors";
import EditCategoryPopup from "../components/EditCategoryPopUp";
import EndSessionPopup from "../components/EndSessionPopUp";
import AddPurchasePopup from "../components/AddPurchasePopUp";

const MainPage = () => {
  const chartRef = useRef(null);
  const [currentCategory, setCurrentCategory] = useState("All");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [fetchedData, setFetchedData] = useState();
  const [categorizedData, setCategorizedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState();
  const [colors, setColors] = useState(categoryColors);
  const [financial, setFinancial] = useState(true); // this is for outcome and income switcher
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);
  const [showAddPurchaseForm, setShowAddPurchaseForm] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    paymentDate: "",
    businessName: "",
    payer: "",
    amount: "",
    category: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (fetchedData) {
      let data = [];
      if (financial) {
        data = fetchedData.outcomeCategories;
        setCategories(categoriesData.outcomeCategories);
        setCurrentCategory("All");
      } else if (!financial) {
        data = fetchedData.incomeCategories;
        setCategories(categoriesData.incomeCategories);
        setCurrentCategory("All");
      }
      setCategorizedData(
        data.slice(1).map((item) => ({
          ...item,
          date: new Date(item.paymentDate),
          amount: Math.round(Number(item.amount) * 100) / 100,
        }))
      );
    }
  }, [fetchedData, financial]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:3000/get", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Data could not be fetched!");
        }
        let data = await response.json();
        let transactions = data.transactions;
        setFetchedData(transactions);
      } catch (err) {
        console.log(err);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddPurchase = async (purchase) => {
    const maxId = categorizedData.reduce(
      (max, item) => Math.max(max, item.id),
      0
    );
    const newId = maxId + 1;
    const newPurchaseWithId = { ...purchase, id: newId };

    const updatedCategorizedData = [...categorizedData];

    updatedCategorizedData.splice(1, 0, newPurchaseWithId);

    setCategorizedData(updatedCategorizedData);

    const updatedFetchedData = { ...fetchedData };
    const categoryKey = financial ? "outcomeCategories" : "incomeCategories";

    if (!updatedFetchedData[categoryKey]) {
      updatedFetchedData[categoryKey] = [];
    }

    if (updatedFetchedData[categoryKey].length >= 1) {
      updatedFetchedData[categoryKey].splice(1, 0, newPurchaseWithId);
    } else {
      updatedFetchedData[categoryKey].push(newPurchaseWithId);
    }

    setFetchedData(updatedFetchedData);

    const payload = {
      purchase: newPurchaseWithId,
      categoryTitle: financial ? "outcome" : "income",
    };

    try {
      const response = await fetch("http://localhost:3000/addPurchase", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to add the purchase.");
      }

      const responseData = await response.json();
      console.log("Purchase added:", responseData);
    } catch (error) {
      console.error("Error adding purchase:", error);
    }

    setShowAddPurchaseForm(false);
    setNewPurchase({
      paymentDate: "",
      businessName: "",
      payer: "",
      amount: "",
      category: "",
    });
  };

  const handleFinishClick = () => {
    setShowConfirmationPopup(true);
  };

  const handleConfirmEndSession = () => {
    endSession();
    setShowConfirmationPopup(false);
  };

  const endSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/deleteSession", {
        method: "DELETE",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Session could not be deleted!");
      }
      const data = await response.json();
      console.log(data.message);
      navigate("/");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (purchase) => {
    setSelectedPurchase(purchase);
    setShowEditPopup(true);
  };

  const handleSaveCategory = async (newCategory, purchaseToUpdate) => {
    try {
      const payload = {
        id: purchaseToUpdate.id,
        categoryTitle: financial ? "outcome" : "income",
        newCategory,
      };

      console.log(payload);

      const response = await fetch("http://localhost:3000/updateCategory", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to update the category.");
      }

      // Update the local state to reflect the change
      const updatedData = categorizedData.map((purchase) => {
        if (purchase.id === purchaseToUpdate.id) {
          return { ...purchase, category: newCategory };
        }
        return purchase;
      });

      setCategorizedData(updatedData);

      // Update the fetched data to reflect the change
      const updatedFetchedData = { ...fetchedData };
      const dataKey = financial ? "outcomeCategories" : "incomeCategories";
      updatedFetchedData[dataKey] = updatedFetchedData[dataKey].map((item) => {
        if (item.id === purchaseToUpdate.id) {
          return { ...item, category: newCategory };
        }
        return item;
      });

      setFetchedData(updatedFetchedData);

      setShowEditPopup(false);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const totalSum = categorizedData.reduce((total, item) => {
    const amount = parseFloat(item.amount);
    if (!isNaN(amount)) {
      const sum = total + Math.abs(amount);
      return parseFloat(sum.toFixed(2));
    }
    return total;
  }, 0);

  const categorySums = categorizedData.reduce((acc, { category, amount }) => {
    const roundedSum = parseFloat((acc[category] || 0) + amount).toFixed(2);
    acc[category] = parseFloat(roundedSum);
    return acc;
  }, {});

  const aggregatedData = Object.entries(categorySums).map(
    ([category, amount]) => ({
      category,
      amount,
    })
  );

  // Generate the pie chart data using the aggregated data
  const pieChartData = {
    labels: aggregatedData.map((data) => data.category),
    datasets: [
      {
        data: aggregatedData.map((data) => data.amount),
        backgroundColor: aggregatedData.map(
          (data) => colors[data.category].base || "#E7E9ED"
        ),
        hoverBackgroundColor: aggregatedData.map(
          (data) => colors[data.category].hover || "#D1D2D4"
        ),
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current) {
      const myChart = new Chart(chartRef.current, {
        type: "doughnut",
        data: pieChartData,
        options: {
          plugins: {
            legend: {
              display: false, // This hides the labels
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    }

    return () => {
      if (chartRef.current) {
        const chartInstance = Chart.getChart(chartRef.current);
        if (chartInstance) {
          chartInstance.destroy();
        }
      }
    };
  }, [pieChartData]);

  const getFormattedDateRange = () => {
    if (categorizedData.length === 0) {
      return "";
    }
    const lastDate = categorizedData[0].date;
    const firstDate = categorizedData[categorizedData.length - 1].date;
    const formattedFirstDate = firstDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    });
    const formattedLastDate = lastDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${formattedFirstDate} to ${formattedLastDate}`;
  };

  const purchasesByDate = categorizedData
    .filter(
      (purchase) =>
        currentCategory === "All" || purchase.category === currentCategory
    )
    .reduce((acc, purchase) => {
      const date = new Date(purchase.paymentDate).toLocaleDateString();
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(purchase);
      return acc;
    }, {});

  const sortedEntries = Object.entries(purchasesByDate).sort((a, b) => {
    const dateA = new Date(a[0].split("/").reverse().join("-"));
    const dateB = new Date(b[0].split("/").reverse().join("-"));
    return dateA - dateB;
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      {showEditPopup && selectedPurchase && (
        <EditCategoryPopup
          categories={categories}
          selectedPurchase={selectedPurchase}
          onClose={() => setShowEditPopup(false)}
          onSave={handleSaveCategory}
        />
      )}
      {showConfirmationPopup && (
        <EndSessionPopup
          onClose={() => setShowConfirmationPopup(false)}
          onConfirm={handleConfirmEndSession}
        />
      )}
      {showAddPurchaseForm && (
        <AddPurchasePopup
          categories={categories}
          onSave={handleAddPurchase}
          onClose={() => setShowAddPurchaseForm(false)}
        />
      )}
      <div className="text-center mb-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleFinishClick}
            className="btn btn-outline-danger"
          >
            Finish
          </button>
          <h1 className="text-2xl font-bold primary-color ml-4">
            {getFormattedDateRange()}
          </h1>
          <div className="mr-4">
            <button
              className={`mr-2 p-2 rounded-lg text-base ${
                financial ? "primary-color" : "bg-white"
              }`}
              onClick={() => setFinancial(true)}
            >
              Outcome
            </button>
            <button
              className={`p-2 rounded-lg text-base ${
                !financial ? "primary-color" : "bg-white"
              }`}
              onClick={() => {
                console.log("Income button clicked");
                setFinancial(false);
              }}
            >
              Income
            </button>
          </div>
        </div>
      </div>
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-4 mb-4">
            <div className="card shadow border-0">
              <div className="card-body">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card shadow border-0">
              <div className="card-body">
                <div className="row">
                  {pieChartData.labels.map((category, index) => (
                    <div
                      key={index}
                      className="col-6 col-md-4 col-lg-3 mb-3 d-flex justify-content-center"
                    >
                      <div
                        key={category}
                        className="d-flex flex-column justify-content-center align-items-center text-center rounded cursor-pointer"
                        style={{
                          backgroundColor:
                            pieChartData.datasets[0].backgroundColor[index],
                          width: "100%", // Fixed width
                          height: "100px", // Fixed height
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            pieChartData.datasets[0].hoverBackgroundColor[
                              index
                            ])
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            pieChartData.datasets[0].backgroundColor[index])
                        }
                        onClick={() => setCurrentCategory(category)}
                      >
                        <p className="text-white m-0">{category}</p>
                        <small className="text-white">
                          {pieChartData.datasets[0].data[index]}€
                        </small>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="btn btn-outline-secondary w-100 mt-3"
                  onClick={() => setCurrentCategory("All")}
                >
                  Total Amount: {totalSum}€
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-4">
        <h2 className="mb-4">Purchases</h2>
        <button
          className="btn btn-outline-success"
          onClick={() => setShowAddPurchaseForm(true)}
        >
          Add a Purchase
        </button>
        {sortedEntries.map(([date, purchases]) => (
          <div key={date}>
            <h5 className="mb-3 my-5 primary-color">{date}</h5>
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
                      onClick={() => handleEditClick(purchase)}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainPage;
