package com.example.loan_service.controller;

import com.example.loan_service.domain.Loan;
import com.example.loan_service.dto.BorrowRequest;
import com.example.loan_service.dto.LoanResponse;
import com.example.loan_service.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/borrow")
    public ResponseEntity<LoanResponse> borrowBook(@RequestBody BorrowRequest request) {
        return ResponseEntity.ok(loanService.borrowBook(request.getUserId(), request.getBookId()));
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<LoanResponse> returnBook(@PathVariable Long id) {
        return ResponseEntity.ok(loanService.returnBook(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanResponse>> getLoansByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(loanService.findLoansByUserId(userId));
    }

    @GetMapping("/user/{userId}/active")
    public ResponseEntity<List<LoanResponse>> getActiveLoansByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(loanService.findActiveLoansByUserId(userId));
    }

    @GetMapping("/all")
    public ResponseEntity<List<LoanResponse>> getAllLoans() {
        return ResponseEntity.ok(loanService.getAllLoans());
    }
}
