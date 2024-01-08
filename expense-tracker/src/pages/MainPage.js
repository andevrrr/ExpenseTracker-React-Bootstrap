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
      <div className="flex justify-evenly items-center my-12">
        <div className="w-auto bg-white p-6 rounded-lg shadow-lg">
          <canvas ref={chartRef}></canvas>
        </div>
        <div className="">
          <ul className="flex flex-wrap">
            {pieChartData.labels.map((category, index) => (
              <li
                key={category}
                className="p-8 rounded-lg m-2 text-center"
                style={{
                  backgroundColor:
                    pieChartData.datasets[0].backgroundColor[index],
                  flexBasis: "calc(50% - 1rem)", // Set to 50% minus the margin
                  maxWidth: "calc(50% - 1rem)", // Set to 50% minus the margin
                }}
              >
                <p className="text-3xl">{category}</p>
                <p className="text-1xl mt-3">
                  ${pieChartData.datasets[0].data[index]}
                </p>
              </li>
            ))}
          </ul>
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
          {purchaseData.map((purchase, index) => (
            <li
              key={index}
              className="text-lg mb-2 flex items-center justify-between"
            >
              <p className="flex-1">{purchase.title}</p>
              <p className="flex-1">{purchase.date}</p>
              <p className="flex-1">{purchase.category}</p>
              <p className="flex-1">{purchase.price}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MainPage;
