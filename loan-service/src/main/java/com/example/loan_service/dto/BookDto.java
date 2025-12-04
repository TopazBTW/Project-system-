package com.example.loan_service.dto;

import lombok.Data;

@Data
public class BookDto {
    private Long id;
    private String title;
    private Integer stock;
    private boolean active;
}
