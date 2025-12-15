package com.example.catalog_service.controller;

import com.example.catalog_service.domain.Book;
import com.example.catalog_service.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.findAll();
    }

    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String query) {
        return bookService.searchByTitleOrAuthor(query);
    }

    @GetMapping("/filter")
    public List<Book> filterBooks(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean available) {
        return bookService.filterBooks(category, available);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.findById(id));
    }

    @PostMapping
    public ResponseEntity<Book> createBook(@RequestBody Book book) {
        return ResponseEntity.ok(bookService.save(book));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/decrease-stock")
    public ResponseEntity<Void> decreaseStock(@PathVariable Long id) {
        bookService.decreaseStock(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/increase-stock")
    public ResponseEntity<Void> increaseStock(@PathVariable Long id) {
        bookService.increaseStock(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/import")
    public ResponseEntity<List<Book>> importBooks(@RequestParam String query) {
        return ResponseEntity.ok(bookService.importBooks(query));
    }
}
