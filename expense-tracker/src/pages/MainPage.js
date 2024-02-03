import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import "./style.css";
import { FiEdit } from "react-icons/fi";
import categoriesData from "../utils/categories.json";
import categoryColors from "../utils/categoryColors";
import EditCategoryPopup from "../components/EditCategoryPopUp";

const MainPage = () => {
  const chartRef = useRef(null);
  const [currentCategory, setCurrentCategory] = useState("All");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [categorizedData, setCategorizedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState(categoriesData);
  const [colors, setColors] = useState(categoryColors);
  const navigate = useNavigate();

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
        const data = await response.json();
        console.log(data);
        setCategorizedData(
          data.slice(1).map((item) => ({
            ...item,
            date: new Date(item.paymentDate),
            amount: Math.round(Number(item.amount) * 100) / 100,
          }))
        );
      } catch (err) {
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

  const totalSumSpent = categorizedData.reduce((total, item) => {
    if (Number(item.amount) < 0) {
      return total + Math.abs(Number(item.amount)); // Convert to positive and add to total
    }
    return total;
  }, 0);

  const totalSumReceived = categorizedData.reduce((total, item) => {
    if (Number(item.amount) >= 0) {
      return total + Number(item.amount);
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
        <h1 className="text-4xl font-bold">January</h1>
      </div>
      <div className="flex justify-evenly items-center my-12">
        <div className="w-auto bg-white p-6 rounded-lg shadow-lg">
          <canvas ref={chartRef} style={{ width: "400px" }}></canvas>
        </div>
        <div className="ml-5 w-auto bg-white p-6 rounded-lg shadow-lg">
          <ul className="flex flex-wrap">
            {pieChartData.labels.map((category, index) => (
              <li
                key={category}
                className="category-item p-2 rounded-lg m-2 text-center"
                style={{
                  backgroundColor:
                    pieChartData.datasets[0].backgroundColor[index],
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    pieChartData.datasets[0].hoverBackgroundColor[index])
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    pieChartData.datasets[0].backgroundColor[index])
                }
                onClick={() => setCurrentCategory(category)}
              >
                <p className="text-base text-white">{category}</p>
                <p className="text-sm mt-3 text-white">
                  {pieChartData.datasets[0].data[index]}€
                </p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between items-center mt-4">
            <p
              style={{
                backgroundColor: "#D1D2D4",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              className="p-2 rounded-lg text-center text-lg flex-1 mr-2"
              onClick={() => setCurrentCategory("All")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#BCC0C4")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#D1D2D4")
              }
            >
              Total Amount Spent: {totalSumSpent}€
            </p>
            <p
              style={{
                backgroundColor: "#D1D2D4",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
              }}
              className="p-2 rounded-lg text-center text-lg flex-1 ml-2"
              onClick={() => setCurrentCategory("All")}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "#BCC0C4")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "#D1D2D4")
              }
            >
              Total Amount Received: {totalSumReceived}€
              {/* Update this with the correct variable for received amount */}
            </p>
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
