import React, { useState, useEffect } from "react";
import "../css/AdminExpenses.css";
import Notification from "../jsx/Notification"; // Import the Notification component

const AdminExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
   expenses_items:"",
      expenses_amount:"",
      expenses_date:"",
      payment_by:"",
  });
  const [notification, setNotification] = useState({ message: "", type: "" }); // State for notifications

  // Fetch all expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("https://server-admin-bytewise.vercel.app/api/expensesData"); // Replace with your API endpoint
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setNotification({ message: "Error fetching expenses.", type: "error" });
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  // Save a new expense
  const saveExpense = async () => {
    // Validation
    if (
      !newExpense.expenses_items||
      !newExpense. expenses_amount||
      !newExpense. expenses_date ||
      !newExpense.payment_by
    ) {
      setNotification({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    try {
      const response = await fetch("https://server-admin-bytewise.vercel.app/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        console.log(newExpense);
        body: JSON.stringify(newExpense),
        
      });

      if (!response.ok) throw new Error("Failed to save expense");

      const savedExpense = await response.json();
      setExpenses([...expenses, savedExpense]); // Add new expense to the list
      setNewExpense({
        expenses_items:"",
      expenses_amount:"",
      expenses_date:"",
      payment_by:"",
      });
      setNotification({ message: "Expense saved successfully!", type: "success" });
    } catch (err) {
      console.error("Error saving expense:", err);
      setNotification({ message: "Failed to save expense. Please try again.", type: "error" });
    }
  };

  return (
    <div id="admin-expenses-body">
      <h2 className="admin-expenses-heading">Expenses</h2>

      {/* Display Notification */}
      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}

      {/* Form to add a new expense */}
      <div className="admin-expenses-form">
        <div>
          <label>Expense Items:</label>
          <input
            type="text"
            name="expenses_items"
            value={newExpense.expenses_items}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="expenses_amount"
            value={newExpense.expenses_amount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="datetime-local"
            name="expenses_date"
            value={newExpense.expenses_date}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Payment By:</label>
          <select
            name="payment_by"
            value={newExpense.payment_by}
            onChange={handleInputChange}
          >
            <option value="">Select</option>
            <option value="Ayush">Ayush</option>
            <option value="Akash">Akash</option>
            <option value="Hitesh">Hitesh</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <button className="save-expense-btn" onClick={saveExpense}>
          Save Expense
        </button>
      </div>

      {/* Display all expenses */}
      <div>
        <h3 className="admin-expenses-heading">All Expenses</h3>
        <table className="admin-expenses-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Expense Items</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Payment By</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense.expensesID}>
                  <td>{expense.expensesID}</td>
                  <td>{expense.expenses_items}</td>
                  <td>{expense.expenses_amount}</td>
                  <td>{expense.expenses_date}</td>
                  <td>{expense.payment_by}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">No expenses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminExpenses;
