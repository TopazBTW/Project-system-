package com.example.catalog_service.service;

import com.example.catalog_service.domain.Book;
import com.example.catalog_service.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public Book findById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    @Transactional
    public Book save(Book book) {
        return bookRepository.save(book);
    }

    @Transactional
    public void deleteById(Long id) {
        Book book = findById(id);
        book.setActive(false); // Soft delete
        bookRepository.save(book);
    }

    @Transactional
    public void decreaseStock(Long bookId) {
        Book book = findById(bookId);
        if (book.getStock() <= 0) {
            throw new RuntimeException("Stock not available");
        }
        book.setStock(book.getStock() - 1);
        bookRepository.save(book);
    }

    @Transactional
    public void increaseStock(Long bookId) {
        Book book = findById(bookId);
        book.setStock(book.getStock() + 1);
        bookRepository.save(book);
    }
}
