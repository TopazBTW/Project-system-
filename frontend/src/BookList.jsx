import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = ({ token }) => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/books', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // Ensure response.data is an array
                if (Array.isArray(response.data)) {
                    setBooks(response.data);
                } else {
                    console.error('Books data is not an array:', response.data);
                    setBooks([]);
                    setError('Received invalid data format from server');
                }
            } catch (err) {
                setError('Failed to fetch books. ' + (err.response?.data || err.message));
                console.error('Fetch error:', err);
                setBooks([]);
            }
        };

        if (token) {
            fetchBooks();
        }
    }, [token]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Library Catalog</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {books && books.length > 0 ? (
                    books.map((book) => (
                        <div key={book.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                            <h3>{book.title}</h3>
                            <p><strong>Author:</strong> {book.author ? book.author.name : 'Unknown'}</p>
                            <p><strong>Category:</strong> {book.category}</p>
                            <p><strong>Stock:</strong> {book.stock}</p>
                        </div>
                    ))
                ) : (
                    !error && <p>No books available or loading...</p>
                )}
            </div>
        </div>
    );
};

export default BookList;
