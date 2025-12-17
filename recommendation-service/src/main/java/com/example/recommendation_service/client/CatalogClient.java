package com.example.recommendation_service.client;

import com.example.recommendation_service.model.Book;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@FeignClient(name = "catalog-service")
public interface CatalogClient {

    @GetMapping("/api/books")
    List<Book> getAllBooks();
}
