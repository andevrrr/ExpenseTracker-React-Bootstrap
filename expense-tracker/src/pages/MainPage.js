import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "./style.css";
import { FiEdit } from "react-icons/fi";
import data from "../utils/data.json";

const MainPage = () => {
  const chartRef = useRef(null);
  const [currentCategory, setCurrentCategory] = useState("All");
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedPurchase, setSelectedPurchase] = useState(null);

  const [categorizedData, setCategorizedData] = useState(
    data.map((item) => ({
      ...item,
      date: new Date(item.date),
    }))
  );

  const handleEditClick = (purchase) => {
    console.log(purchase);
    setSelectedPurchase(purchase);
    setShowEditPopup(true);
  };

  const EditCategoryPopup = ({
    onClose,
    onSave,
    categories,
    selectedPurchase,
  }) => (
    <div className="popup">
      <select
        defaultValue={selectedPurchase.category}
        onChange={(e) => onSave(e.target.value, selectedPurchase)}
      >
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <button onClick={onClose}>Close</button>
    </div>
  );

  const handleSaveCategory = (newCategory, purchaseToUpdate) => {
    const updatedData = categorizedData.map((purchase) => {
      const isSamePurchase =
        purchase.title === purchaseToUpdate.title &&
        purchase.date.getTime() === new Date(purchaseToUpdate.date).getTime();
      if (isSamePurchase) {
        return { ...purchase, category: newCategory };
      }
      return purchase;
    });

    setCategorizedData(updatedData);
    setShowEditPopup(false);
  };

  const categories = [...new Set(categorizedData.map((item) => item.category))];

  const sumOfPrices = categorizedData.reduce(
    (total, item) => total + item.price,
    0
  );

  const categorySums = categorizedData.reduce((acc, { category, price }) => {
    acc[category] = (acc[category] || 0) + price;
    return acc;
  }, {});

  const aggregatedData = Object.entries(categorySums).map(
    ([category, price]) => ({
      category,
      price,
    })
  );

  const colors = {
    Housing: { base: "#FF6384", hover: "#D9536F" },
    Utilities: { base: "#36A2EB", hover: "#2A91D8" },
    Groceries: { base: "#FFCE56", hover: "#E6B84D" },
    Transportation: { base: "#FD6B19", hover: "#D25516" },
    Dining: { base: "#4BC0C0", hover: "#3DA6A6" },
    Entertainment: { base: "#9966FF", hover: "#8055E2" },
    Gifts: { base: "#C9CBCF", hover: "#AEB0B4" },
    Health: { base: "#7ACB77", hover: "#68B468" },
    "Personal Care": { base: "#FAA75A", hover: "#E0954F" },
  };

  // Generate the pie chart data using the aggregated data
  const pieChartData = {
    labels: aggregatedData.map((data) => data.category),
    datasets: [
      {
        data: aggregatedData.map((data) => data.price),
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
                  ${pieChartData.datasets[0].data[index]}
                </p>
              </li>
            ))}
          </ul>
          <p
            style={{
              backgroundColor: "#D1D2D4",
              cursor: "pointer",
              transition: "background-color 0.3s ease",
            }}
            className="p-2 rounded-lg m-2 text-center text-lg"
            onClick={() => setCurrentCategory("All")}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#BCC0C4")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#D1D2D4")
            }
          >
            Total: {sumOfPrices}€
          </p>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Purchases</h2>
        <ul className="border border-gray-200 p-2 rounded-lg">
          <li className="text-lg mb-2 flex font-semibold border-b border-gray-200">
            <p className="flex-1">Title</p>
            <p className="flex-1">Date</p>
            <p className="flex-1">Category</p>
            <p className="flex-1">Price</p>
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
                <p className="flex-1">{purchase.title}</p>
                <p className="flex-1">
                  {purchase.date.toLocaleDateString()}
                </p>{" "}
                <div className="flex-1 flex items-center">
                  <span className="mr-2">{purchase.category}</span>
                  <FiEdit onClick={() => handleEditClick(purchase)} />
                </div>
                <p className="flex-1">${purchase.price}</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default MainPage;
