import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import "./style.css";
import { FiEdit } from "react-icons/fi";
import categoriesData from "../utils/categories.json";
import categoryColors from "../utils/categoryColors";
import EditCategoryPopup from "../components/EditCategoryPopUp";
import EndSessionPopup from "../components/EndSessionPopUp";

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
        setFetchedData(data);
      } catch (err) {
        console.log(err);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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
    if (Number(item.amount)) {
      return total + Math.abs(Number(item.amount)); // Convert to positive and add to total
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
      <div class="container my-5">
        <div class="row justify-content-center">
          <div class="col-md-4 mb-4">
            <div class="card shadow border-0">
              <div class="card-body">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>

          <div class="col-md-8">
            <div class="card shadow border-0">
              <div class="card-body">
                <div class="row">
                  {pieChartData.labels.map((category, index) => (
                    <div class="col-6 col-md-4 col-lg-3 mb-3 d-flex justify-content-center">
                      <div
                        key={category}
                        class="d-flex flex-column justify-content-center align-items-center text-center rounded cursor-pointer"
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
                        <p class="text-white m-0">{category}</p>
                        <small class="text-white">
                          {pieChartData.datasets[0].data[index]}€
                        </small>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  class="btn btn-outline-secondary w-100 mt-3"
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
        {Object.entries(purchasesByDate).map(([date, purchases]) => (
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
