package com.example.loan_service.dto;

import lombok.Data;

@Data
@com.fasterxml.jackson.annotation.JsonIgnoreProperties(ignoreUnknown = true)
public class UserDto {
    private Long id;
    private String fullName;
    private String email;
}
