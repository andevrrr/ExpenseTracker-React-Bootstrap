import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const MainPage = () => {
  const chartRef = useRef(null);

  // Dummy data for the pie chart
  const pieChartData = {
    labels: ["Food", "Clothes", "Shopping", "Bills"],
    datasets: [
      {
        data: [200, 150, 100, 50],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  // Dummy data for the list of purchases
  const purchaseData = [
    {
      title: "Groceries",
      date: "January 5, 2024",
      price: "$200",
      category: "Food",
    },
    {
      title: "New Clothes",
      date: "January 8, 2024",
      price: "$150",
      category: "Clothes",
    },
    {
      title: "Electronics",
      date: "January 15, 2024",
      price: "$100",
      category: "Shopping",
    },
    {
      title: "Utility Bills",
      date: "January 20, 2024",
      price: "$50",
      category: "Bills",
    },
  ];

  useEffect(() => {
    // Create the pie chart when the component mounts
    if (chartRef.current) {
      const myChart = new Chart(chartRef.current, {
        type: "pie",
        data: pieChartData,
      });
    }

    // Clean up the chart when the component unmounts
    return () => {
      if (chartRef.current) {
        const chartInstance = Chart.getChart(chartRef.current);
        if (chartInstance) {
          chartInstance.destroy();
        }
      }
    };
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold">January</h1>
      </div>
      <div className="flex justify-between">
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <canvas ref={chartRef}></canvas>
        </div>
        <div className="w-1/2 bg-white p-6 rounded-lg shadow-lg">
          <ul>
            {pieChartData.labels.map((category, index) => (
              <li
                key={category}
                className="text-lg mb-2"
                style={{ color: pieChartData.datasets[0].backgroundColor[index] }}
              >
                {category}: ${pieChartData.datasets[0].data[index]}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Purchases</h2>
        <ul>
          {purchaseData.map((purchase, index) => (
            <li key={index} className="text-lg mb-2">
              <strong>{purchase.title}</strong> - {purchase.date} -{" "}
              {purchase.price} - {purchase.category}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-8 text-center text-gray-600">
        <p>bottom</p>
      </div>
    </div>
  );
};

export default MainPage;
