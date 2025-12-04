package com.example.catalog_service.controller;

import com.example.catalog_service.domain.Book;
import com.example.catalog_service.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class RecommendationController {

    private final BookService bookService;

    @GetMapping("/{id}/recommendations")
    public ResponseEntity<List<Book>> getRecommendations(@PathVariable Long id) {
        Book book = bookService.findById(id);
        List<Book> allBooks = bookService.findAll();

        // Simple recommendation: Same category, excluding the book itself
        List<Book> recommendations = allBooks.stream()
                .filter(b -> b.getCategory() != null && b.getCategory().equals(book.getCategory()))
                .filter(b -> !b.getId().equals(book.getId()))
                .limit(5)
                .collect(Collectors.toList());

        return ResponseEntity.ok(recommendations);
    }
}
