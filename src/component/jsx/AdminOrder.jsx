import React, { useState, useEffect } from "react";
import "../css/AdminOrder.css";
import Notification from "../jsx/Notification"; // Import your custom notification component

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchOrderID, setSearchOrderID] = useState("");
  const [newStatus, setNewStatus] = useState("Pending");
  const [filteredOrder, setFilteredOrder] = useState(null);
  const [notification, setNotification] = useState(null); // State for notification
  const [statusFilter, setStatusFilter] = useState("All"); // State for filter dropdown

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await fetch("https://server-admin-bytewise.vercel.app/api/ordersData"); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();

      // Sort orders by date in descending order (latest first)
      const sortedOrders = data.sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setNotification({ message: "Failed to fetch orders.", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Search
  const handleSearch = () => {
    const order = orders.find((order) => order.orderID === searchOrderID);
    if (order) {
      setFilteredOrder(order);
    } else {
      setFilteredOrder(null);
      setNotification({ message: "Order not found!", type: "error" });
    }
  };

  // Handle Update Status
  const handleUpdateStatus = async () => {
    if (!filteredOrder) {
      setNotification({ message: "Please search for a valid order first.", type: "error" });
      return;
    }

    try {
      const response = await fetch(`https://server-admin-bytewise.vercel.app/api/orders?orderID=${filteredOrder.orderID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ completeStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      setNotification({ message: "Order status updated successfully!", type: "success" });

      // Re-fetch all orders to refresh the table
      await fetchOrders();

      // Reset the filtered order and search input
      setFilteredOrder(null);
      setSearchOrderID("");
    } catch (error) {
      console.error("Error updating order status:", error);
      setNotification({ message: "Failed to update order status.", type: "error" });
    }
  };

  // Function to format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    // Add 5 hours and 30 minutes to adjust to IST
    date.setHours(date.getHours() + 5);
    date.setMinutes(date.getMinutes() + 30);

    // Format the date as dd/mm/yyyy
    const day = String(date.getUTCDate()).padStart(2, "0");
    const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Month is zero-based
    const year = date.getUTCFullYear();

    // Format the time as 12-hour format (AM/PM)
    let hours = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const period = hours >= 12 ? "PM" : "AM";

    // Convert hours to 12-hour format
    hours = hours % 12;
    hours = hours ? String(hours).padStart(2, "0") : "12"; // Handle 12:00 AM/PM case

    return `${day}/${month}/${year} ${hours}:${minutes} ${period}`;
  };

  const filteredOrders =
    statusFilter === "All"
      ? orders
      : orders.filter((order) => order.completeStatus === statusFilter);

  if (loading) return <p className="loading-text">Loading orders...</p>;

  return (
    <div id="admin-order-body">
      <h2 className="admin-order-heading">Admin Orders</h2>

      {/* Notification Display */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Search and Update Section */}
      <div className="admin-order-actions">
        <input
          type="text"
          placeholder="Search by Order ID"
          value={searchOrderID}
          onChange={(e) => setSearchOrderID(e.target.value)}
          className="search-box"
        />
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="status-dropdown"
        >
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
        <button onClick={handleUpdateStatus} className="update-btn">
          Update Status
        </button>
      </div>

      {/* Filter Section */}
      <div className="filter-section">
        <label htmlFor="status-filter" className="filter-label">Filter by Status:</label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <p className="no-orders-text">No orders found.</p>
      ) : (
        <table className="admin-order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>Method</th>
              <th>Payment Status</th>
              <th>User Name</th>
              <th>Enrolment ID</th>
              <th>Phone</th>
              <th>Semester</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {(filteredOrder ? [filteredOrder] : filteredOrders).map((order) => (
              <tr key={order.orderID}>
                <td>{order.orderID}</td>
                <td>{formatDate(order.order_date)}</td>
                <td className={`order${order.completeStatus}`}>{order.completeStatus}</td>
                <td>{order.payment_Method}</td>
                <td className={`payment${order.paymentStatus}`}>{order.paymentStatus}</td>
                <td>{order.name}</td>
                <td>{order.enrolmentID}</td>
                <td>{order.phone}</td>
                <td>{order.semester}</td>
                <td>
                  <ul className="order-items-list">
                    {order.items.map((item, index) => (
                      <li key={index} className="order-item">
                        {item.product_name} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminOrder;
