package com.example.recommendation_service.service;

import com.example.recommendation_service.client.CatalogClient;
import com.example.recommendation_service.model.Book;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final CatalogClient catalogClient;

    public List<Book> getRecommendations() {
        List<Book> allBooks = catalogClient.getAllBooks();

        if (allBooks == null || allBooks.isEmpty()) {
            return Collections.emptyList();
        }

        // Shuffle and pick top 3 for random recommendations
        Collections.shuffle(allBooks);
        return allBooks.stream()
                .limit(3)
                .collect(Collectors.toList());
    }
}
