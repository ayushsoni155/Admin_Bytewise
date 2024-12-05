import React, { useEffect, useState } from 'react';
import '../css/AdminAccounts.css'; // Import the external CSS

const AdminAccounts = () => {
  const [availableFunds, setAvailableFunds] = useState(0);
  const [grossProfit, setGrossProfit] = useState(0);
  const [netProfit, setNetProfit] = useState(0);
  const [credit, setCredit] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const fetchFinancialData = async () => {
    try {
      const response = await fetch('http://localhost:3000/accountsData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filterType,
          year: selectedYear,
          month: selectedMonth,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setAvailableFunds(data.availableFunds || 0);
        setGrossProfit(data.grossProfit || 0);
        setNetProfit(data.netProfit || 0);
      } else {
        console.error('Error fetching financial data:', data.error);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    }
  };

  useEffect(() => {
    fetchFinancialData();
  }, [filterType, selectedYear, selectedMonth]);

 const handleUpdateFunds = async (e) => {
  e.preventDefault();
  if (!credit) {
    setUpdateMessage('Please enter a valid credit amount.');
    return;
  }

  try {
    const response = await fetch('https://server-admin-bytewise.vercel.app/api/fundcredit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: credit }), // Send as an object with `amount`
    });

    const data = await response.json();
    if (response.ok) {
      setUpdateMessage('Funds updated successfully.');
      setCredit('');
      fetchFinancialData(); // Fetch updated funds
    } else {
      setUpdateMessage(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error updating funds:', error);
    setUpdateMessage('Failed to update funds. Please try again later.');
  }
};


  return (
    <div className="admin-container">
      <h2 className="admin-header">Financial Overview</h2>

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

        {filterType === 'monthly' || filterType === 'yearly' ? (
          <>
            <label htmlFor="year">Year:</label>
            <select
              id="year"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {[...Array(5).keys()].map((i) => (
                <option key={i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </>
        ) : null}

        {filterType === 'monthly' ? (
          <>
            <label htmlFor="month">Month:</label>
            <select
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
                </option>
              ))}
            </select>
          </>
        ) : null}
      </div>

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
        {updateMessage && <p className="update-message">{updateMessage}</p>}
      </div>
    </div>
  );
};

export default AdminAccounts;
