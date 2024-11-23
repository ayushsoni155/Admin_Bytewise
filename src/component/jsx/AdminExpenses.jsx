import React, { useState, useEffect } from "react";
import "../css/AdminExpenses.css";
import Notification from "./Notification"; // Import the Notification component

const AdminExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "",
    expense_date: "",
    payment_method: "",
    payment_by: "",
  });
  const [notification, setNotification] = useState({ message: "", type: "" }); // State for notifications

  // Fetch all expenses
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:3000/expensesData"); // Replace with your API endpoint
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
      !newExpense.description ||
      !newExpense.amount ||
      !newExpense.expense_date ||
      !newExpense.payment_by
    ) {
      setNotification({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) throw new Error("Failed to save expense");

      const savedExpense = await response.json();
      setExpenses([...expenses, savedExpense]); // Add new expense to the list
      setNewExpense({
        description: "",
        amount: "",
        expense_date: "",
        payment_by: "",
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
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={newExpense.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Amount:</label>
          <input
            type="number"
            name="amount"
            value={newExpense.amount}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="datetime-local"
            name="expense_date"
            value={newExpense.expense_date}
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
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Payment By</th>
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((expense) => (
                <tr key={expense.expenseID}>
                  <td>{expense.expenseID}</td>
                  <td>{expense.description}</td>
                  <td>{expense.amount}</td>
                  <td>{expense.expense_date}</td>
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
