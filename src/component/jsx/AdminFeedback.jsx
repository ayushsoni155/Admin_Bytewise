
import React, { useState, useEffect } from 'react';
import '../css/AdminFeedback.css'; // Optional: Add styles here or use inline styles if preferred

const AdminFeedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch feedbacks from the backend
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await fetch('https://server-admin-bytewise.vercel.app/api/feedback'); // Replace with your API endpoint
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();

                // Sort feedbacks by date in descending order (latest first)
                const sortedFeedbacks = data.sort((a, b) => new Date(b.feedback_date) - new Date(a.feedback_date));

                setFeedbacks(sortedFeedbacks);
                setLoading(false);
            } catch (err) {
                setError('Failed to load feedback. Please try again later.');
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    // Function to format date to dd/mm/yyyy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');  // Use getUTCDate() for UTC day
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');  // Use getUTCMonth() for UTC month
    const year = date.getUTCFullYear();  // Use getUTCFullYear() for UTC year
    return `${day}/${month}/${year}`;
};
const formatTime = (timeString) => {
    const [hour, minute] = timeString.split(':');  // Split the time part into hours and minutes
    let hours = parseInt(hour, 10);  // Convert hours to an integer
    const minutes = minute.split('.')[0];  // Remove milliseconds if any
    const ampm = hours >= 12 ? 'PM' : 'AM';  // Determine AM or PM
    hours = hours % 12;  // Convert to 12-hour format
    hours = hours ? hours : 12;  // If hour is 0, set it to 12 (midnight)
    return `${hours}:${minutes} ${ampm}`;
};

    return (
        <div className="admin-feedback-container">
            <h2>All Feedback</h2>
            {loading ? (
                <p>Loading feedback...</p>
            ) : error ? (
                <p className="error-message">{error}</p>
            ) : feedbacks.length === 0 ? (
                <p>No feedback available.</p>
            ) : (
          
                <table className="feedback-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User Name</th>
                            <th>Feedback</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, index) => (
                            <tr key={index}>
                                <td>{feedback.feedback_enrolmentID}</td>
                                <td>{feedback.name}</td>
                                <td>{feedback.feedback_text}</td>
                                <td>{formatDate(feedback.feedback_date)}</td> {/* Format date here */}
                                <td>{formatTime(feedback.feedback_date.split('T')[1])}</td> {/* Show time part */}
                            </tr>
                        ))}
                    </tbody>
                </table>
           
            )}
        </div>
    );
};

export default AdminFeedback;
