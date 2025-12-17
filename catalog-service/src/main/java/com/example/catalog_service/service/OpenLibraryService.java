package com.example.catalog_service.service;

import com.example.catalog_service.domain.Author;
import com.example.catalog_service.domain.Book;
import com.example.catalog_service.repository.AuthorRepository;
import com.example.catalog_service.repository.BookRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OpenLibraryService {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Book> searchAndImportBooks(String query) {
        String url = "https://openlibrary.org/search.json?q=" + query + "&limit=10";
        List<Book> importedBooks = new ArrayList<>();

        try {
            String jsonResponse = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(jsonResponse);
            JsonNode docs = root.path("docs");

            for (JsonNode doc : docs) {
                String title = doc.path("title").asText();
                String authorName = doc.path("author_name").isArray() && doc.path("author_name").size() > 0
                        ? doc.path("author_name").get(0).asText()
                        : "Unknown Author";

                String isbn = doc.path("isbn").isArray() && doc.path("isbn").size() > 0
                        ? doc.path("isbn").get(0).asText()
                        : null;

                if (isbn == null)
                    continue; // Skip books without ISBN

                // Check if book already exists
                Optional<Book> existingBook = bookRepository.findByIsbn(isbn);
                if (existingBook.isPresent()) {
                    Book book = existingBook.get();
                    if (!book.isActive()) {
                        book.setActive(true);
                        book.setStock(5); // Reset stock or keep? Let's reset to default for import
                        Book savedBook = bookRepository.save(book);
                        System.out.println("Reactivated book: " + savedBook.getTitle());
                        importedBooks.add(savedBook);
                    } else {
                        System.out.println("Book already exists and is active: " + book.getTitle());
                    }
                    continue;
                }

                // Find or create author
                Author author = authorRepository.findByName(authorName)
                        .orElseGet(() -> {
                            Author newAuthor = new Author();
                            newAuthor.setName(authorName);
                            newAuthor.setNationality("Unknown");
                            newAuthor.setBirthDate(java.time.LocalDate.now()); // Placeholder
                            return authorRepository.save(newAuthor);
                        });

                // Create book
                Book book = new Book();
                book.setTitle(title);
                book.setAuthor(author);
                book.setIsbn(isbn);
                book.setStock(5); // Default stock
                book.setTotalCopies(5); // Default total copies
                book.setCategory("General"); // Default category need better mapping potentially
                book.setActive(true); // Explicitly set active

                Book savedBook = bookRepository.save(book);
                System.out.println("Saved new book: " + savedBook.getTitle() + " (ID: " + savedBook.getId() + ")");
                importedBooks.add(savedBook);
            }

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to import books from OpenLibrary: " + e.getMessage());
        }

        return importedBooks;
    }
}
