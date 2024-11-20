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

  useEffect(() => {
    // Fetch orders from backend
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://server-admin-bytewise.vercel.app/api/ordersData"); // Replace with your API endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json(); // Parse JSON response
        setOrders(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

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
      const response = await fetch(`https://server-admin-bytewise.vercel.app/api/orders/${searchOrderID}`, {
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
      // Update the state to reflect the change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderID === searchOrderID ? { ...order, completeStatus: newStatus } : order
        )
      );
      setFilteredOrder(null); // Reset filtered order
      setSearchOrderID(""); // Reset search input
    } catch (error) {
      console.error("Error updating order status:", error);
      setNotification({ message: "Failed to update order status.", type: "error" });
    }
  };

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
        </select>
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
        <button onClick={handleUpdateStatus} className="update-btn">
          Update Status
        </button>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <p className="no-orders-text">No orders found.</p>
      ) : (
        <table className="admin-order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Order Date</th>
              <th>Status</th>
              <th>User Name</th>
              <th>Enrolment ID</th>
              <th>Phone</th>
              <th>Semester</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            {(filteredOrder ? [filteredOrder] : orders).map((order) => (
              <tr key={order.orderID}>
                <td>{order.orderID}</td>
                <td>{new Date(order.order_date).toLocaleString()}</td>
                <td>{order.completeStatus}</td>
                <td>{order.name}</td>
                <td>{order.enrolmentID}</td>
                <td>{order.phone}</td>
                <td>{order.sem}</td>
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
