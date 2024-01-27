import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "./style.css";
import { FiEdit } from 'react-icons/fi';

const MainPage = () => {
  const chartRef = useRef(null);
  const [currentCategory, setCurrentCategory] = useState("All");

  console.log(currentCategory);

  const categorizedData = [
    {
      title: "Home",
      date: new Date("2023-12-01T08:30:00"),
      price: 625,
      category: "Housing",
    },
    {
      title: "Electricity Bill",
      date: new Date("2023-12-03T10:00:00"),
      price: 70,
      category: "Utilities",
    },
    {
      title: "Water Bill",
      date: new Date("2023-12-05T09:20:00"),
      price: 30,
      category: "Utilities",
    },
    {
      title: "Groceries",
      date: new Date("2023-12-06T15:45:00"),
      price: 150,
      category: "Groceries",
    },
    {
      title: "Gas",
      date: new Date("2023-12-08T12:00:00"),
      price: 40,
      category: "Transportation",
    },
    {
      title: "Dining Out",
      date: new Date("2023-12-10T19:30:00"),
      price: 60,
      category: "Dining",
    },
    {
      title: "Movie Night",
      date: new Date("2023-12-13T20:00:00"),
      price: 25,
      category: "Entertainment",
    },
    {
      title: "Flowers",
      date: new Date("2023-12-15T14:00:00"),
      price: 50,
      category: "Gifts",
    },
    {
      title: "Internet Bill",
      date: new Date("2023-12-17T10:00:00"),
      price: 50,
      category: "Utilities",
    },
    {
      title: "Mobile Bill",
      date: new Date("2023-12-20T11:00:00"),
      price: 60,
      category: "Utilities",
    },
    {
      title: "Gym Membership",
      date: new Date("2023-12-22T09:00:00"),
      price: 30,
      category: "Health",
    },
    {
      title: "Haircut",
      date: new Date("2023-12-25T13:00:00"),
      price: 25,
      category: "Personal Care",
    },
    {
      title: "Groceries",
      date: new Date("2023-12-27T16:00:00"),
      price: 150,
      category: "Groceries",
    },
    {
      title: "New Year's Party Supplies",
      date: new Date("2023-12-30T17:30:00"),
      price: 85,
      category: "Entertainment",
    },
  ];

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
                <p className="flex-1">{purchase.category}</p>
                <p className="flex-1">${purchase.price}</p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default MainPage;
