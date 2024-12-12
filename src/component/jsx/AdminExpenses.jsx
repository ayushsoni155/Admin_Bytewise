import React, { useState, useEffect } from "react";
import "../css/AdminExpenses.css";
import Notification from "../jsx/Notification"; // Import the Notification component

const AdminExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    expenses_items: "",
    expenses_amount: "",
    expenses_date: "",
    payment_by: "",
  });
  const [filterType, setFilterType] = useState("all");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [availableFunds, setAvailableFunds] = useState(0);
  const [credit, setCredit] = useState(""); // For fund updates
  const [notification, setNotification] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchExpenses(); // Fetch both expenses and available funds
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(
        "https://server-admin-bytewise.vercel.app/api/expensesData"
      );
      if (!response.ok) throw new Error("Failed to fetch expenses");
      const data = await response.json();

      // Assuming the API response contains an array of expenses and available funds
      setExpenses(data.expenses); // Set expenses data
      setAvailableFunds(data.availableFunds); // Set available funds
      setFilteredExpenses(data.expenses); // Set the initial filtered expenses
      calculateTotal(data.expenses); // Calculate the total expenses
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setNotification({ message: "Error fetching expenses.", type: "error" });
    }
  };

  const calculateTotal = (data) => {
    const total = data.reduce((sum, expense) => sum + parseFloat(expense.expenses_amount || 0), 0);
    setTotalExpenses(total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  const saveExpense = async () => {
    if (!newExpense.expenses_items || !newExpense.expenses_amount || !newExpense.expenses_date || !newExpense.payment_by) {
      setNotification({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    try {
      const response = await fetch("https://server-admin-bytewise.vercel.app/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });

      if (!response.ok) throw new Error("Failed to save expense");

      await fetchExpenses(); // Refetch expenses and available funds after adding a new one
      setNewExpense({
        expenses_items: "",
        expenses_amount: "",
        expenses_date: "",
        payment_by: "",
      });
      setNotification({ message: "Expense saved successfully!", type: "success" });
    } catch (err) {
      console.error("Error saving expense:", err);
      setNotification({ message: "Failed to save expense. Please try again.", type: "error" });
    }
  };

  const handleUpdateFunds = async (e) => {
    e.preventDefault();
    if (!credit || isNaN(credit) || credit <= 0) {
      setNotification({ message: "Please enter a valid credit amount.", type: "error" });
      return;
    }

    try {
      const response = await fetch("https://server-admin-bytewise.vercel.app/api/fundcredit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: credit }),
      });

      const data = await response.json();
      if (response.ok) {
        setNotification({ message: "Funds updated successfully.", type: "success" });
        setCredit("");
        fetchExpenses(); // Refetch updated funds and expenses
      } else {
        setNotification({ message: `Error: ${data.error}`, type: "error" });
      }
    } catch (error) {
      console.error("Error updating funds:", error);
      setNotification({ message: "Failed to update funds. Please try again later.", type: "error" });
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div id="admin-expenses-body">
      <h2 className="admin-expenses-heading">Expenses</h2>

      {notification.message && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification({ message: "", type: "" })}
        />
      )}

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
        </button><br/>
         <div className="admin-funds-form">
        <h3>Update Available Funds</h3>
        <form className="admin-form" onSubmit={handleUpdateFunds}>
          <div className="form-group">
            <label>Credit Amount (INR):</label>
            <input
              type="number"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              placeholder="Enter credit amount"
              required
            />
          </div>
          <button type="submit" className="btn-update">Update Funds</button>
        </form>
      </div>
      </div>

{/*       <div className="admin-funds-form">
        <h3>Update Available Funds</h3>
        <form className="admin-form" onSubmit={handleUpdateFunds}>
          <div className="form-group">
            <label>Credit Amount (INR):</label>
            <input
              type="number"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              placeholder="Enter credit amount"
              required
            />
          </div>
          <button type="submit" className="btn-update">Update Funds</button>
        </form>
      </div> */}

      <div className="total-expenses">
        <h3>Available Funds: ₹{availableFunds.toFixed(2)}</h3>
        <h3>Total Expenses: ₹{totalExpenses.toFixed(2)}</h3>
      </div>

      <table className="admin-expenses-table">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Expense Items</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Payment By</th>
          </tr>
        </thead>
        <tbody>
          {filteredExpenses.length > 0 ? (
            filteredExpenses.map((expense, index) => (
              <tr key={expense.expensesID}>
                <td>{index + 1}</td>
                <td>{expense.expenses_items}</td>
                <td>{expense.expenses_amount}</td>
                <td>{formatDate(expense.expenses_date)}</td>
                <td>{expense.payment_by}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminExpenses;
