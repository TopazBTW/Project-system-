package com.example.catalog_service.service;

import com.example.catalog_service.domain.Book;
import com.example.catalog_service.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final OpenLibraryService openLibraryService;

    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    public List<Book> searchByTitleOrAuthor(String query) {
        if (query == null || query.trim().isEmpty()) {
            return findAll();
        }
        return bookRepository.searchByTitleOrAuthor(query);
    }

    public List<Book> filterBooks(String category, Boolean available) {
        List<Book> books = bookRepository.findAll();

        if (category != null && !category.isEmpty()) {
            books = books.stream()
                    .filter(book -> category.equalsIgnoreCase(book.getCategory()))
                    .collect(Collectors.toList());
        }

        if (available != null) {
            if (available) {
                books = books.stream()
                        .filter(book -> book.isActive() && book.getStock() > 0)
                        .collect(Collectors.toList());
            } else {
                books = books.stream()
                        .filter(book -> !book.isActive() || book.getStock() <= 0)
                        .collect(Collectors.toList());
            }
        }

        return books;
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
        book.setActive(false);
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

    public List<Book> importBooks(String query) {
        return openLibraryService.searchAndImportBooks(query);
    }
}
