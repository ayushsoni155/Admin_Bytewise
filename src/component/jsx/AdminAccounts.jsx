import React, { useEffect, useState } from 'react';
import '../css/AdminAccounts.css'; // Import the external CSS
import Notification from './Notification'; // Import the Notification component

const AdminAccounts = () => {
  const [availableFunds, setAvailableFunds] = useState(0);
  const [grossProfit, setGrossProfit] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [credit, setCredit] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification({ message: '', type: '', visible: false }), 3000);
  };

  const fetchFinancialData = async () => {
    try {
      const response = await fetch('https://server-admin-bytewise.vercel.app/api/accountData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setAvailableFunds(data.availableFunds || 0);
        setGrossProfit(data.grossProfit || 0);
        setNetProfit(data.netProfit || 0);
      } else {
        showNotification(`Error fetching data: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
      showNotification('Failed to fetch financial data. Please try again.', 'error');
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, []);

  const handleUpdateFunds = async (e) => {
    e.preventDefault();
    if (!credit) {
      showNotification('Please enter a valid credit amount.', 'error');
      return;
    }

    try {
      const response = await fetch('https://server-admin-bytewise.vercel.app/api/fundcredit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: credit }),
      });

      const data = await response.json();
      if (response.ok) {
        showNotification('Funds updated successfully.', 'success');
        setCredit('');
        fetchFinancialData(); // Fetch updated funds
      } else {
        showNotification(`Error: ${data.error}`, 'error');
      }
    } catch (error) {
      console.error('Error updating funds:', error);
      showNotification('Failed to update funds. Please try again later.', 'error');
    }
  };

  return (
    <div className="admin-container">
      {notification.visible && (
        <Notification message={notification.message} type={notification.type} />
      )}
      <h2 className="admin-header">Financial Overview</h2>

      <div className="admin-card">
        <h3>Available Funds</h3>
        <p className="admin-amount">
          {availableFunds.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
        </p>
      </div>

      <div className="admin-card">
        <h3>Gross Profit</h3>
        <p className="admin-amount">
          {grossProfit.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
        </p>
      </div>

      <div className="admin-card">
        <h3>Net Profit</h3>
        <p className="admin-amount">
          {netProfit.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
        </p>
      </div>

      <div className="admin-card">
        <h3>Update Funds</h3>
        <form className="admin-form" onSubmit={handleUpdateFunds}>
          <div className="form-group">
            <label>Credit Amount (INR):</label>
            <input
              type="number"
              value={credit}
              onChange={(e) => setCredit(e.target.value)}
              placeholder="Enter credit amount"
            />
          </div>
          <button type="submit" className="btn-update">Update Funds</button>
        </form>
      </div>
    </div>
  );
};

export default AdminAccounts;
