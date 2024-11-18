import React, { useEffect, useState } from 'react';
import '../css/AdminDashboard.css'; // Add styles here
import { Link } from 'react-router-dom';

const Admindashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    todaysSale: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalOrders: 0,
  });

  const [items, setItems] = useState([]); // State to hold table data
  const [selectedDate, setSelectedDate] = useState(''); // State to hold selected date

  // Function to fetch dashboard data
  // Function to fetch dashboard data
const fetchDashboardData = async (date) => {
  try {
    let url = 'http://localhost:3000/dashboard-data';
    if (date) {
      url = `${url}?date=${date}`; // Append the selected date to the URL
    }
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setStats(data);  // Update stats with the fetched data
      setItems(data.itemDetails);  // Populate items table from the response
    } else {
      console.error('Failed to fetch dashboard data');
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
  }
};


  // Fetch dashboard data when the component mounts or when the selected date changes
  useEffect(() => {
    if (selectedDate) {
      fetchDashboardData(selectedDate);
    } else {
      fetchDashboardData(); // Fetch data for today's date if no date is selected
    }
  }, [selectedDate]); // The hook runs every time selectedDate changes

  // Handle date change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);  // Set the new selected date
  };

  return (
    <div className="dashboard-container">
      <h1>Admin Dashboard</h1>
      
      <label htmlFor="dateSelector">Select Date:</label>
      <input
        type="date"
        id="dateSelector"
        value={selectedDate}
        onChange={handleDateChange}
      />

      <div className="stats-grid">
        <Link to='/User'><div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.totalUsers}</p>
        </div></Link>
        <div className="stat-card">
          <h3>Today's Sale</h3>
          <p>₹{stats.todaysSale}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p>{stats.pendingOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Orders Delivered</h3>
          <p>{stats.deliveredOrders}</p>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p>{stats.totalOrders}</p>
        </div>
      </div>

      <h2>Item Details</h2>
      <table className="item-table">
        <thead>
          <tr>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {items.length > 0 ? (
            items.map((item, index) => (
              <tr key={index}>
                <td>{item.code}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No items available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Admindashboard;
