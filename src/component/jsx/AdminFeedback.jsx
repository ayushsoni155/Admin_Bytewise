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
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
                                <td>{feedback.feedback_date.split('T')[1].split('.')[0]}</td> {/* Show time part */}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminFeedback;
