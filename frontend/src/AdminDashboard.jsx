import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = ({ token }) => {
    const [activeTab, setActiveTab] = useState('users'); // users, books, loans
    const [users, setUsers] = useState([]);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [showCreateUser, setShowCreateUser] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', password: '' });
    const [newBook, setNewBook] = useState({
        title: '',
        authorName: '',
        isbn: '',
        category: '',
        stock: 5,
        totalCopies: 5,
        publicationYear: new Date().getFullYear()
    });

    // Fetch data when tab changes
    useEffect(() => {
        setError('');
        setMessage('');
        if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'loans') {
            fetchLoans();
        }
    }, [activeTab]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (err) {
            setError('Failed to fetch users');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLoans = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8080/api/loans/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoans(response.data);
        } catch (err) {
            setError('Failed to fetch loans');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/users', newUser, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('User created successfully!');
            setNewUser({ name: '', email: '', password: '' });
            setShowCreateUser(false);
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError(err.response?.data || 'Failed to create user');
            setTimeout(() => setError(''), 3000);
        }
    };

    const deleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) {
            return;
        }
        try {
            await axios.delete(`http://localhost:8080/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage('User deleted successfully');
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch {
            setError('Failed to delete user');
            setTimeout(() => setError(''), 3000);
        }
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            await axios.put(
                `http://localhost:8080/api/users/${userId}/role`,
                newRole,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'text/plain'
                    }
                }
            );
            setMessage(`User role updated to ${newRole}`);
            fetchUsers();
            setTimeout(() => setMessage(''), 3000);
        } catch {
            setError('Failed to update role');
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleManualAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = {
                title: newBook.title,
                author: { name: newBook.authorName },
                isbn: newBook.isbn,
                category: newBook.category,
                stock: parseInt(newBook.stock),
                totalCopies: parseInt(newBook.totalCopies),
                publicationYear: parseInt(newBook.publicationYear)
            };
            await axios.post('http://localhost:8080/api/books', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(`Successfully added "${newBook.title}"`);
            setNewBook({ title: '', authorName: '', isbn: '', category: '', stock: 5, totalCopies: 5, publicationYear: new Date().getFullYear() });
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            setError('Failed to add book');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    const handleImportBooks = async () => {
        const query = document.getElementById('importQuery').value;
        if (!query) return;
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8080/api/books/import?query=${encodeURIComponent(query)}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const importedCount = response.data.length;
            if (importedCount > 0) {
                setMessage(`Successfully imported ${importedCount} books for "${query}"`);
            } else {
                setMessage(`No new books found for "${query}"`);
            }
            setTimeout(() => setMessage(''), 3000);
        } catch {
            setError('Failed to import books');
            setTimeout(() => setError(''), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage users, books, and view loans</p>
            </div>

            {/* Tabs Navigation */}
            <div className="admin-tabs">
                <button
                    className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                    onClick={() => setActiveTab('users')}
                >
                    Users
                </button>
                <button
                    className={`tab-btn ${activeTab === 'books' ? 'active' : ''}`}
                    onClick={() => setActiveTab('books')}
                >
                    Books
                </button>
                <button
                    className={`tab-btn ${activeTab === 'loans' ? 'active' : ''}`}
                    onClick={() => setActiveTab('loans')}
                >
                    Loans
                </button>
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            {/* USERS TAB */}
            {activeTab === 'users' && (
                <div className="admin-section">
                    <div className="section-header">
                        <h2>User Management</h2>
                        <button
                            className="create-btn"
                            onClick={() => setShowCreateUser(!showCreateUser)}
                        >
                            {showCreateUser ? 'Cancel' : 'Create User'}
                        </button>
                    </div>

                    {showCreateUser && (
                        <form onSubmit={createUser} className="create-user-form">
                            <input
                                type="text"
                                placeholder="Full Name"
                                value={newUser.name}
                                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                required
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                value={newUser.email}
                                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                            <button type="submit" className="submit-btn">Create User</button>
                        </form>
                    )}

                    {loading ? (
                        <div className="loading">Loading users...</div>
                    ) : (
                        <div className="users-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.fullName}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge role-${user.roles?.[0]?.toLowerCase()}`}>
                                                    {user.roles?.[0] || 'USER'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <select
                                                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                                                        defaultValue=""
                                                        className="role-select"
                                                    >
                                                        <option value="" disabled>Change Role</option>
                                                        <option value="USER">USER</option>
                                                        <option value="LIBRARIAN">LIBRARIAN</option>
                                                        <option value="ADMIN">ADMIN</option>
                                                    </select>
                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => deleteUser(user.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* BOOKS TAB */}
            {activeTab === 'books' && (
                <div className="admin-section">
                    <div className="section-header">
                        <h2>Book Management</h2>
                    </div>

                    <div className="section-content" style={{ marginBottom: '30px' }}>
                        <h3>Import Books</h3>
                        <p style={{ fontSize: '14px', color: '#718096', marginBottom: '15px' }}>
                            Import metadata and covers from OpenLibrary API.
                        </p>
                        <div className="import-controls" style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="Enter book title or author"
                                id="importQuery"
                                className="search-input"
                                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0' }}
                            />
                            <button
                                className="create-btn"
                                onClick={handleImportBooks}
                                disabled={loading}
                            >
                                {loading ? 'Importing...' : 'Import Books'}
                            </button>
                        </div>
                    </div>

                    <div className="section-content">
                        <h3>Add Book Manually</h3>
                        <form onSubmit={handleManualAdd} className="create-user-form">
                            <input
                                type="text"
                                placeholder="Title"
                                value={newBook.title}
                                onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Author Name"
                                value={newBook.authorName}
                                onChange={(e) => setNewBook({ ...newBook, authorName: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="ISBN"
                                value={newBook.isbn}
                                onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Category"
                                value={newBook.category}
                                onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="number"
                                    placeholder="Stock"
                                    value={newBook.stock}
                                    onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
                                    required
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number"
                                    placeholder="Total Copies"
                                    value={newBook.totalCopies}
                                    onChange={(e) => setNewBook({ ...newBook, totalCopies: e.target.value })}
                                    required
                                    style={{ flex: 1 }}
                                />
                                <input
                                    type="number"
                                    placeholder="Year"
                                    value={newBook.publicationYear}
                                    onChange={(e) => setNewBook({ ...newBook, publicationYear: e.target.value })}
                                    style={{ flex: 1 }}
                                />
                            </div>
                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading ? 'Adding...' : 'Add Book'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* LOANS TAB */}
            {activeTab === 'loans' && (
                <div className="admin-section">
                    <div className="section-header">
                        <h2>All Active Loans</h2>
                        <button className="create-btn" onClick={fetchLoans}>Refresh</button>
                    </div>

                    {loading ? (
                        <div className="loading">Loading loans...</div>
                    ) : (
                        <div className="users-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Loan ID</th>
                                        <th>User Name</th>
                                        <th>Book ID</th>
                                        <th>Book Title</th>
                                        <th>Loan Date</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loans.length === 0 ? (
                                        <tr><td colSpan="6" style={{ textAlign: 'center' }}>No loans found</td></tr>
                                    ) : (
                                        loans.map((loan) => (
                                            <tr key={loan.id}>
                                                <td>{loan.id}</td>
                                                <td>{loan.userName}</td>
                                                <td>{loan.bookId}</td>
                                                <td>{loan.bookTitle}</td>
                                                <td>{new Date(loan.loanDate).toLocaleDateString()}</td>
                                                <td>
                                                    <span className={`role-badge role-${loan.status === 'EN_COURS' ? 'librarian' : 'user'}`}>
                                                        {loan.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
