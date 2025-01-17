import React, { useEffect, useState } from 'react';
import '../css/AdminUser.css'; // Ensure this CSS file exists

const AdminUser = () => {
  const [users, setUsers] = useState([]); // State to hold user data
  const [loading, setLoading] = useState(true); // State for loading status

  // Function to fetch user details
  const fetchUserDetails = async () => {
    try {
      const response = await fetch('https://server-admin-bytewise.vercel.app/api/user'); // Replace with your API endpoint
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a user by enrollment ID
 const deleteUser = async (enrolmentID) => {
  try {
    const response = await fetch(`https://server-admin-bytewise.vercel.app/api/userDelete/${enrolmentID}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      // Remove the deleted user from the users array
      setUsers((prevUsers) => prevUsers.filter((user) => user.enrolmentID !== enrolmentID));
    
    } else {
      console.error('Failed to delete user');
      alert('Failed to delete user');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    alert('Error deleting user');
  }
};


  // Fetch user details when the component mounts
  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <div className="user-details-container">
      <h1>User Details</h1>
      {loading ? (
        <p>Loading...</p>
      ) : users.length > 0 ? (
        <table className="user-table">
          <thead>
            <tr>
              <th>Enrollment Number</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Semester</th>
              <th>Recovery question ?</th>
              <th>Recovery Answer</th>
              <th>Action</th> {/* Add Action column for delete button */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.enrolmentID}> {/* Use a unique key */}
                <td>{user.enrolmentID}</td>
                <td>{user.name}</td>
                <td>{user.phone}</td>
                <td>{user.sem}</td>
                <td>{user.recovery_question}</td>
                <td>{user.recovery_answer}</td>
                <td>
                  <button onClick={() => deleteUser(user.enrolmentID)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default AdminUser;
