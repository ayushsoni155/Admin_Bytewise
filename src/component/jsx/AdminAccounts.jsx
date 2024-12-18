import React, { useEffect, useState } from 'react';
import '../css/AdminAccounts.css'; // Import the external CSS
import Notification from './Notification'; // Import the Notification component

const AdminAccounts = () => {
  const [availableFunds, setAvailableFunds] = useState(0);
  const [grossProfit, setGrossProfit] = useState(0);
   const [CashInHand, setCashInHand] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [notification, setNotification] = useState({ message: '', type: '', visible: false });

  const showNotification = (message, type) => {
    setNotification({ message, type, visible: true });
    setTimeout(() => setNotification({ message: '', type: '', visible: false }), 3000);
  };

  const fetchFinancialData = async () => {
    try {
      const response = await fetch('https://server-admin-bytewise.vercel.app/api/accountsData', {
        method: 'Post', // Corrected to GET as per API convention
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setAvailableFunds(data.availableFunds || 0);
        setCashInHand(data.CashInHand || 0);
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
        <h3>Cash in Hand</h3>
        <p className="admin-amount">
          {CashInHand.toLocaleString('en-US', { style: 'currency', currency: 'INR' })}
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
    </div>
  );
};

export default AdminAccounts;
