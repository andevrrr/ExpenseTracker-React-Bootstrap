import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Ensure this import is correct based on your Chart.js version

const MainPage = () => {
  const chartRef = useRef(null);

  const categorizedData = [
    {
      title: "Home",
      date: new Date("2023-12-01T08:30:00"),
      price: 1200, // Monthly rent or mortgage payment
      category: "Housing",
    },
    {
      title: "Electricity Bill",
      date: new Date("2023-12-03T10:00:00"),
      price: 70, // Monthly electricity bill
      category: "Utilities",
    },
    {
      title: "Water Bill",
      date: new Date("2023-12-05T09:20:00"),
      price: 30, // Monthly water bill
      category: "Utilities",
    },
    {
      title: "Groceries",
      date: new Date("2023-12-06T15:45:00"),
      price: 150, // Weekly grocery shopping
      category: "Groceries",
    },
    {
      title: "Gas",
      date: new Date("2023-12-08T12:00:00"),
      price: 40, // Gasoline for car
      category: "Transportation",
    },
    {
      title: "Dining Out",
      date: new Date("2023-12-10T19:30:00"),
      price: 60, // Dinner at a restaurant
      category: "Dining",
    },
    {
      title: "Movie Night",
      date: new Date("2023-12-13T20:00:00"),
      price: 25, // Movie tickets
      category: "Entertainment",
    },
    {
      title: "Flowers",
      date: new Date("2023-12-15T14:00:00"),
      price: 50, // Buying flowers for a special occasion
      category: "Gifts",
    },
    {
      title: "Internet Bill",
      date: new Date("2023-12-17T10:00:00"),
      price: 50, // Monthly internet bill
      category: "Utilities",
    },
    {
      title: "Mobile Bill",
      date: new Date("2023-12-20T11:00:00"),
      price: 60, // Monthly mobile phone bill
      category: "Utilities",
    },
    {
      title: "Gym Membership",
      date: new Date("2023-12-22T09:00:00"),
      price: 30, // Monthly gym membership fee
      category: "Health",
    },
    {
      title: "Haircut",
      date: new Date("2023-12-25T13:00:00"),
      price: 25, // Haircut at a salon
      category: "Personal Care",
    },
    {
      title: "Groceries",
      date: new Date("2023-12-27T16:00:00"),
      price: 150, // Another round of grocery shopping
      category: "Groceries",
    },
    {
      title: "New Year's Party Supplies",
      date: new Date("2023-12-30T17:30:00"),
      price: 85, // Supplies for hosting a New Year's party
      category: "Entertainment",
    },
  ];

  const colors = {
    "Housing": "#FF6384",
    "Utilities": "#36A2EB",
    "Groceries": "#FFCE56",
    "Transportation": "#FD6B19",
    "Dining": "#4BC0C0",
    "Entertainment": "#9966FF",
    "Gifts": "#C9CBCF",
    "Health": "#7ACB77",
    "Personal Care": "#FAA75A"
  };

  const pieChartData = {
    labels: categorizedData.map((transaction) => transaction.category),
    datasets: [
      {
        data: categorizedData.map((transaction) => transaction.price),
        backgroundColor: categorizedData.map((transaction) => colors[transaction.category] || "#E7E9ED"), // Default color if category is not in the colors object
        hoverBackgroundColor: categorizedData.map((transaction) => colors[transaction.category] || "#D1D2D4"), // Slightly darker for hover state
      },
    ],
  };

  useEffect(() => {
    if (chartRef.current) {
      const myChart = new Chart(chartRef.current, {
        type: "pie",
        data: pieChartData,
        options: {}, // Add chart options as needed
      });
    }

    return () => {
      if (chartRef.current) {
        const chartInstance = Chart.getChart(chartRef.current); // Ensure this method is compatible with your Chart.js version
        if (chartInstance) {
          chartInstance.destroy();
        }
      }
    };
  }, [pieChartData]); // Add pieChartData as a dependency to ensure the chart updates when data changes

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
                  flexBasis: "calc(50% - 1rem)",
                  maxWidth: "calc(50% - 1rem)",
                }}
              >
                <p className="text-3xl">{category}</p>
                <p className="text-xl mt-3">
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
          {categorizedData.map((purchase, index) => (
            <li
              key={index}
              className="text-lg mb-2 flex items-center justify-between"
            >
              <p className="flex-1">{purchase.title}</p>
              <p className="flex-1">
                {purchase.date.toLocaleDateString()}
              </p>{" "}
              {/* Format date */}
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
