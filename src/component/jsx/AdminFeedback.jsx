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
                setFeedbacks(data);
                setLoading(false);
            } catch (err) {
                setError('Failed to load feedback. Please try again later.');
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

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
                        </tr>
                    </thead>
                    <tbody>
                        {feedbacks.map((feedback, index) => (
                            <tr key={index}>
                                <td>{feedback.feedback_enrolmentID}</td>
                                <td>{feedback.name}</td>
                                <td>{feedback.feedback_text}</td>
                                <td>{new Date(feedback.feedback_date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminFeedback;
