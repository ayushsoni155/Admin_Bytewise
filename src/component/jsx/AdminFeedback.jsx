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

    // Function to format date and time
    const formatDateAndTime = (dateString) => {
        const date = new Date(dateString);

        // Format date as dd/mm/yyyy
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',  // Full year (yyyy)
        });

        // Format time as 12-hour format with AM/PM
        const formattedTime = date.toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        return `${formattedDate} ${formattedTime}`;
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
                            <th>Date and Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, index) => (
                            <tr key={index}>
                                <td>{feedback.feedback_enrolmentID}</td>
                                <td>{feedback.name}</td>
                                <td>{feedback.feedback_text}</td>
                                <td>{formatDateAndTime(feedback.feedback_date)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminFeedback;
