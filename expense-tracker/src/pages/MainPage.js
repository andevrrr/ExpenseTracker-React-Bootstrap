import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import "./style.css";
import { FiEdit } from "react-icons/fi";
import categoriesData from "../utils/categories.json";
import categoryColors from "../utils/categoryColors";
import EditCategoryPopup from "../components/EditCategoryPopUp";
import "../App.css";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (fetchedData) {
      let data = [];
      if (financial) {
        data = fetchedData.outcomeCategories;
        setCategories(categoriesData.outcomeCategories);
      } else if (!financial) {
        data = fetchedData.incomeCategories;
        setCategories(categoriesData.incomeCategories);
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

  const handleEditClick = (purchase) => {
    setSelectedPurchase(purchase);
    setShowEditPopup(true);
  };

  const handleSaveCategory = async (newCategory, purchaseToUpdate) => {
    try {
      const payload = {
        id: purchaseToUpdate.id,
        newCategory,
      };

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
    acc[category] = (acc[category] || 0) + amount;
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

      <div className="text-center mb-4">
        <div className="flex items-center justify-between">
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
            <div class="card shadow">
              <div class="card-body">
                <canvas ref={chartRef}></canvas>
              </div>
            </div>
          </div>

          <div class="col-md-8">
            <div class="card shadow">
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

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Purchases</h2>
        <ul className="border border-gray-200 p-2 rounded-lg">
          <li className="text-lg mb-2 flex font-semibold border-b border-gray-200">
            <p className="flex-1">Date</p>
            <p className="flex-1">Business Name</p>
            <p className="flex-1">Payer</p>
            <p className="flex-1">Category</p>
            <p className="flex-1">Amount</p>
          </li>
          {categorizedData
            .filter(
              (purchase) =>
                currentCategory === "All" ||
                purchase.category === currentCategory
            )
            .map((purchase, index) => (
              <li
                key={index}
                className="text-lg mb-2 flex items-center justify-between"
              >
                <p className="flex-1">
                  {new Date(purchase.paymentDate).toLocaleDateString()}
                </p>
                <p className="flex-1">{purchase.businessName}</p>
                <p className="flex-1">{purchase.payer}</p>
                <div className="flex-1 flex items-center">
                  <span className="mr-2">{purchase.category}</span>
                  <FiEdit onClick={() => handleEditClick(purchase)} />
                </div>
                <p className="flex-1">{purchase.amount}€</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default MainPage;
