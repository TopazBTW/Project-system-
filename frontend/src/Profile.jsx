import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';

const Profile = ({ token, userId }) => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchLoans();
    }, [userId]);

    const fetchLoans = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:8080/api/loans/user/${userId}/active`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setLoans(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Failed to fetch your loans');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (loanId) => {
        try {
            await axios.put(
                `http://localhost:8080/api/loans/${loanId}/return`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Book returned successfully!');
            setTimeout(() => setMessage(''), 3000);
            fetchLoans();
        } catch (err) {
            setError(err.response?.data || 'Failed to return book');
            setTimeout(() => setError(''), 3000);
        }
    };



    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Borrowed Books</h1>
                <p>Manage your active loans</p>
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading...</div>
            ) : loans.length > 0 ? (
                <div className="loans-grid">
                    {loans.map((loan) => (
                        <div key={loan.id} className={`loan-card ${loan.overdue ? 'overdue' : ''}`}>
                            <div className="loan-card-header">
                                <h3>{loan.bookTitle}</h3>
                                {loan.overdue && <span className="overdue-badge">Overdue!</span>}
                            </div>
                            <div className="loan -details">
                                <p><strong>Author:</strong> {loan.authorName}</p>
                                <p><strong>Borrowed:</strong> {new Date(loan.loanDate).toLocaleDateString()}</p>
                                <p className={loan.overdue ? 'overdue-text' : ''}>
                                    <strong>Due Date:</strong> {new Date(loan.dueDate).toLocaleDateString()}
                                </p>
                                <p><strong>Status:</strong> {loan.status}</p>
                            </div>
                            <button
                                className="return-btn"
                                onClick={() => handleReturn(loan.id)}
                            >
                                Return Book
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-loans">
                    <p>You have no active loans</p>
                    <p className="hint">Browse the catalog to borrow books</p>
                </div>
            )}
        </div>
    );
};

export default Profile;
