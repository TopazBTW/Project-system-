package com.example.loan_service.service;

import com.example.loan_service.client.CatalogClient;
import com.example.loan_service.domain.Loan;
import com.example.loan_service.domain.LoanStatus;
import com.example.loan_service.dto.BookDto;
import com.example.loan_service.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final CatalogClient catalogClient;
    private final com.example.loan_service.client.UserClient userClient;

    @Transactional
    public Loan borrowBook(Long userId, Long bookId) {
        // 0. Validate User
        try {
            userClient.getUserById(userId);
        } catch (Exception e) {
            throw new RuntimeException("User not found or service unavailable");
        }

        // 1. Check book availability (and existence)
        BookDto book = catalogClient.getBookById(bookId);
        if (book == null || !book.isActive()) {
            throw new RuntimeException("Book not available");
        }

        // 2. Decrease stock (Synchronous call - "Best Effort" transaction)
        try {
            catalogClient.decreaseStock(bookId);
        } catch (Exception e) {
            throw new RuntimeException("Could not decrease stock: " + e.getMessage());
        }

        // 3. Create Loan
        Loan loan = Loan.builder()
                .userId(userId)
                .bookId(bookId)
                .loanDate(LocalDateTime.now())
                .dueDate(LocalDate.now().plusDays(14)) // 2 weeks loan
                .status(LoanStatus.EN_COURS)
                .build();

        try {
            return loanRepository.save(loan);
        } catch (Exception e) {
            // Compensating transaction: Revert stock if loan save fails
            catalogClient.increaseStock(bookId);
            throw new RuntimeException("Failed to create loan, stock reverted");
        }
    }

    @Transactional
    public Loan returnBook(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() == LoanStatus.RETOURNE) {
            throw new RuntimeException("Book already returned");
        }

        // 1. Update Loan status
        loan.setStatus(LoanStatus.RETOURNE);
        loan.setReturnDate(LocalDateTime.now());

        // 2. Increase stock
        catalogClient.increaseStock(loan.getBookId());

        return loanRepository.save(loan);
    }

    public List<Loan> findLoansByUserId(Long userId) {
        return loanRepository.findByUserId(userId);
    }
}
