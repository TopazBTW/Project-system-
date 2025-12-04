import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookList = ({ token }) => {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('/api/books', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setBooks(response.data);
            } catch (err) {
                setError('Failed to fetch books.');
                console.error(err);
            }
        };

        fetchBooks();
    }, [token]);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Library Catalog</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                {books.map((book) => (
                    <div key={book.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                        <h3>{book.title}</h3>
                        <p><strong>Author:</strong> {book.author ? book.author.name : 'Unknown'}</p>
                        <p><strong>Category:</strong> {book.category}</p>
                        <p><strong>Stock:</strong> {book.stock}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;
