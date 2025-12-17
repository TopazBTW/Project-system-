package com.example.recommendation_service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    private Long id;
    private String title;
    private String isbn;
    private String category;
    private Integer publicationYear;
    private Integer stock;
    private Integer totalCopies;
    private boolean active;
}
