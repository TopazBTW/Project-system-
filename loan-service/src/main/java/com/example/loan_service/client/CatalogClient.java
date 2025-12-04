package com.example.loan_service.client;

import com.example.loan_service.dto.BookDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "catalog-service")
public interface CatalogClient {

    @GetMapping("/api/books/{id}")
    BookDto getBookById(@PathVariable("id") Long id);

    @PostMapping("/api/books/{id}/decrease-stock")
    void decreaseStock(@PathVariable("id") Long id);

    @PostMapping("/api/books/{id}/increase-stock")
    void increaseStock(@PathVariable("id") Long id);
}
