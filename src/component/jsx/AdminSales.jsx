import React, { useState, useEffect } from "react";
import "../css/AdminSales.css";

const AdminSales = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [totalSales, setTotalSales] = useState(0);

  useEffect(() => {
    // Fetch sales data from the backend using fetch
    const fetchSales = async () => {
      try {
        const response = await fetch("https://server-admin-bytewise.vercel.app/api/sales"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSales(data);
        setFilteredSales(data);
        calculateTotal(data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };
    fetchSales();
  }, []);

  const calculateTotal = (data) => {
    const total = data.reduce((sum, sale) => sum + sale.total_price, 0);
    setTotalSales(total);
  };

  const filterSales = () => {
    const now = new Date();
    let filtered = [];

    switch (filterType) {
      case "daily":
        filtered = sales.filter(
          (sale) => new Date(sale.order_date).toDateString() === now.toDateString()
        );
        break;
      case "weekly":
        const weekStart = new Date();
        weekStart.setDate(now.getDate() - now.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        filtered = sales.filter(
          (sale) =>
            new Date(sale.order_date) >= weekStart && new Date(sale.order_date) <= weekEnd
        );
        break;
      case "monthly":
        filtered = sales.filter(
          (sale) =>
            new Date(sale.order_date).getMonth() === parseInt(selectedMonth) &&
            new Date(sale.order_date).getFullYear() === parseInt(selectedYear)
        );
        break;
      case "yearly":
        filtered = sales.filter(
          (sale) => new Date(sale.order_date).getFullYear() === parseInt(selectedYear)
        );
        break;
      default:
        filtered = sales;
    }

    setFilteredSales(filtered);
    calculateTotal(filtered);
  };

  useEffect(() => {
    filterSales();
  }, [filterType, sales, selectedYear, selectedMonth]);

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="admin-sales">
      <h2>Sales Overview</h2>

      <div className="filters">
        <label htmlFor="filter">Filter by:</label>
        <select
          id="filter"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>

        {filterType === "monthly" || filterType === "yearly" ? (
          <>
            <label htmlFor="year">Year:</label>
            <select
              id="year"
              value={selectedYear}
              onChange={handleYearChange}
            >
              {[...Array(5).keys()].map((i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </>
        ) : null}

        {filterType === "monthly" ? (
          <>
            <label htmlFor="month">Month:</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={handleMonthChange}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString("en-US", { month: "long" })}
                </option>
              ))}
            </select>
          </>
        ) : null}
      </div>

      <table className="sales-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Transaction ID</th>
            <th>Purchase Date</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredSales.length > 0 ? (
            filteredSales.map((sale) => (
              <tr key={sale.orderID}>
                <td>{sale.orderID}</td>
                <td>{sale.transactionID}</td>
                <td>{new Date(sale.order_date).toLocaleDateString()}</td>
                <td>₹{sale.total_price.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No sales data available.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="total-sales">
        <h3>Total Sales: ₹{totalSales.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default AdminSales;
