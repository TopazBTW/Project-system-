package com.example.catalog_service.config;

import com.example.catalog_service.domain.Author;
import com.example.catalog_service.domain.Book;
import com.example.catalog_service.repository.AuthorRepository;
import com.example.catalog_service.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
@RequiredArgsConstructor
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(AuthorRepository authorRepository, BookRepository bookRepository) {
        return args -> {
            // Check if data already exists
            if (authorRepository.count() > 0) {
                return;
            }

            // Create Authors
            Author georgeOrwell = Author.builder()
                    .name("George Orwell")
                    .nationality("British")
                    .birthDate(LocalDate.of(1903, 6, 25))
                    .build();
            authorRepository.save(georgeOrwell);

            Author janeAusten = Author.builder()
                    .name("Jane Austen")
                    .nationality("British")
                    .birthDate(LocalDate.of(1775, 12, 16))
                    .build();
            authorRepository.save(janeAusten);

            Author isaacAsimov = Author.builder()
                    .name("Isaac Asimov")
                    .nationality("American")
                    .birthDate(LocalDate.of(1920, 1, 2))
                    .build();
            authorRepository.save(isaacAsimov);

            Author agataChristie = Author.builder()
                    .name("Agatha Christie")
                    .nationality("British")
                    .birthDate(LocalDate.of(1890, 9, 15))
                    .build();
            authorRepository.save(agataChristie);

            Author stephenHawking = Author.builder()
                    .name("Stephen Hawking")
                    .nationality("British")
                    .birthDate(LocalDate.of(1942, 1, 8))
                    .build();
            authorRepository.save(stephenHawking);

            Author yuvalHarari = Author.builder()
                    .name("Yuval Noah Harari")
                    .nationality("Israeli")
                    .birthDate(LocalDate.of(1976, 2, 24))
                    .build();
            authorRepository.save(yuvalHarari);

            // Create Books
            Book book1 = Book.builder()
                    .title("1984")
                    .isbn("978-0451524935")
                    .publicationYear(1949)
                    .category("Fiction")
                    .stock(5)
                    .totalCopies(5)
                    .author(georgeOrwell)
                    .active(true)
                    .build();
            bookRepository.save(book1);

            Book book2 = Book.builder()
                    .title("Animal Farm")
                    .isbn("978-0451526342")
                    .publicationYear(1945)
                    .category("Fiction")
                    .stock(3)
                    .totalCopies(3)
                    .author(georgeOrwell)
                    .active(true)
                    .build();
            bookRepository.save(book2);

            Book book3 = Book.builder()
                    .title("Pride and Prejudice")
                    .isbn("978-0141439518")
                    .publicationYear(1813)
                    .category("Fiction")
                    .stock(4)
                    .totalCopies(4)
                    .author(janeAusten)
                    .active(true)
                    .build();
            bookRepository.save(book3);

            Book book4 = Book.builder()
                    .title("Foundation")
                    .isbn("978-0553293357")
                    .publicationYear(1951)
                    .category("Science")
                    .stock(2)
                    .totalCopies(2)
                    .author(isaacAsimov)
                    .active(true)
                    .build();
            bookRepository.save(book4);

            Book book5 = Book.builder()
                    .title("Murder on the Orient Express")
                    .isbn("978-0062693662")
                    .publicationYear(1934)
                    .category("Fiction")
                    .stock(6)
                    .totalCopies(6)
                    .author(agataChristie)
                    .active(true)
                    .build();
            bookRepository.save(book5);

            Book book6 = Book.builder()
                    .title("A Brief History of Time")
                    .isbn("978-0553380163")
                    .publicationYear(1988)
                    .category("Science")
                    .stock(3)
                    .totalCopies(3)
                    .author(stephenHawking)
                    .active(true)
                    .build();
            bookRepository.save(book6);

            Book book7 = Book.builder()
                    .title("Sapiens: A Brief History of Humankind")
                    .isbn("978-0062316110")
                    .publicationYear(2011)
                    .category("History")
                    .stock(4)
                    .totalCopies(4)
                    .author(yuvalHarari)
                    .active(true)
                    .build();
            bookRepository.save(book7);

            Book book8 = Book.builder()
                    .title("Homo Deus: A Brief History of Tomorrow")
                    .isbn("978-0062464347")
                    .publicationYear(2015)
                    .category("History")
                    .stock(3)
                    .totalCopies(3)
                    .author(yuvalHarari)
                    .active(true)
                    .build();
            bookRepository.save(book8);

            Book book9 = Book.builder()
                    .title("I, Robot")
                    .isbn("978-0553382563")
                    .publicationYear(1950)
                    .category("Science")
                    .stock(0)
                    .totalCopies(2)
                    .author(isaacAsimov)
                    .active(true)
                    .build();
            bookRepository.save(book9);

            Book book10 = Book.builder()
                    .title("Sense and Sensibility")
                    .isbn("978-0141439662")
                    .publicationYear(1811)
                    .category("Fiction")
                    .stock(2)
                    .totalCopies(2)
                    .author(janeAusten)
                    .active(true)
                    .build();
            bookRepository.save(book10);

            System.out.println("✅ Sample data loaded successfully!");
        };
    }
}
