import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookCatalog.css';

const BookCatalog = ({ token, userId }) => {
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchBooks();
    }, [searchQuery, category, availableOnly]);

    const fetchBooks = async () => {
        setLoading(true);
        setError('');
        try {
            let url = 'http://localhost:8080/api/books';

            if (searchQuery) {
                url += `/search?query=${encodeURIComponent(searchQuery)}`;
            } else if (category || availableOnly) {
                url += `/filter?`;
                const params = [];
                if (category) params.push(`category=${encodeURIComponent(category)}`);
                if (availableOnly) params.push(`available=true`);
                url += params.join('&');
            }

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (Array.isArray(response.data)) {
                setBooks(response.data);
            } else {
                setBooks([]);
            }
        } catch (err) {
            setError('Failed to fetch books');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBorrow = async (bookId) => {
        try {
            await axios.post(
                'http://localhost:8080/api/loans/borrow',
                { userId, bookId },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage('Book borrowed successfully!');
            setTimeout(() => setMessage(''), 3000);
            fetchBooks(); // Refresh to show updated stock
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Failed to borrow book';
            setError(typeof errorMessage === 'object' ? JSON.stringify(errorMessage) : errorMessage);
            setTimeout(() => setError(''), 3000);
        }
    };

    return (
        <div className="book-catalog">
            <div className="catalog-header">
                <h1>Library Catalog</h1>
                <p>Discover your next great read</p>
            </div>

            <div className="filters-container">
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                </div>

                <div className="filter-controls">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="category-select"
                    >
                        <option value="">All Categories</option>
                        <option value="Fiction">Fiction</option>
                        <option value="Non-Fiction">Non-Fiction</option>
                        <option value="Science">Science</option>
                        <option value="History">History</option>
                        <option value="Technology">Technology</option>
                    </select>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={availableOnly}
                            onChange={(e) => setAvailableOnly(e.target.checked)}
                        />
                        <span>Available only</span>
                    </label>
                </div>
            </div>

            {message && <div className="success-message">{message}</div>}
            {error && <div className="error-message">{error}</div>}

            {loading ? (
                <div className="loading">Loading books...</div>
            ) : (
                <div className="books-grid">
                    {books.length > 0 ? (
                        books.map((book) => (
                            <div key={book.id} className="book-card">
                                <div className="book-card-content">
                                    <div className="book-cover">
                                        {book.isbn ? (
                                            <img
                                                src={`https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`}
                                                alt={book.title}
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = 'https://via.placeholder.com/150x220?text=No+Cover';
                                                }}
                                            />
                                        ) : (
                                            <div className="no-cover">
                                                <span>{book.title[0]}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="book-info">
                                        <div className="book-card-header">
                                            <h3 className="book-title">{book.title}</h3>
                                            <span className={`availability-badge ${book.stock > 0 ? 'available' : 'unavailable'}`}>
                                                {book.stock > 0 ? 'Available' : 'Borrowed'}
                                            </span>
                                        </div>
                                        <div className="book-details">
                                            <p className="book-author">
                                                <strong>Author:</strong> {book.author?.name || 'Unknown'}
                                            </p>
                                            <p className="book-category">
                                                <strong>Category:</strong> {book.category || 'N/A'}
                                            </p>
                                            <p className="book-stock">
                                                <strong>In Stock:</strong> {book.stock}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="borrow-btn"
                                    onClick={() => handleBorrow(book.id)}
                                    disabled={book.stock <= 0}
                                >
                                    {book.stock > 0 ? 'Borrow Book' : 'Unavailable'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="no-books">No books found</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default BookCatalog;
