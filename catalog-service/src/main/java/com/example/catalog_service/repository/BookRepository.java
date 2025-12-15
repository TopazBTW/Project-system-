package com.example.catalog_service.repository;

import com.example.catalog_service.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findByIsbn(String isbn);

    @Query("SELECT b FROM Book b WHERE b.active = true AND (LOWER(b.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(b.author.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Book> searchByTitleOrAuthor(@Param("query") String query);

    List<Book> findByActiveTrue();

    List<Book> findByCategory(String category);
}
