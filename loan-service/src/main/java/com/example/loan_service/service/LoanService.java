package com.example.loan_service.service;

import com.example.loan_service.client.CatalogClient;
import com.example.loan_service.domain.Loan;
import com.example.loan_service.domain.LoanStatus;
import com.example.loan_service.dto.BookDto;
import com.example.loan_service.dto.LoanResponse;
import com.example.loan_service.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final CatalogClient catalogClient;
    private final com.example.loan_service.client.UserClient userClient;

    @Transactional
    public LoanResponse borrowBook(Long userId, Long bookId) {
        // 0. Validate User
        try {
            userClient.getUserById(userId);
        } catch (Exception e) {
            throw new RuntimeException("User not found or service unavailable");
        }

        // 1. Check book availability
        BookDto book = catalogClient.getBookById(bookId);
        if (book == null || !book.isActive()) {
            throw new RuntimeException("Book not available");
        }

        // 2. Decrease stock
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
                .dueDate(LocalDate.now().plusDays(14))
                .status(LoanStatus.EN_COURS)
                .build();

        try {
            loan = loanRepository.save(loan);
            return toLoanResponse(loan, book);
        } catch (Exception e) {
            catalogClient.increaseStock(bookId);
            throw new RuntimeException("Failed to create loan, stock reverted");
        }
    }

    @Transactional
    public LoanResponse returnBook(Long loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        if (loan.getStatus() == LoanStatus.RETOURNE) {
            throw new RuntimeException("Book already returned");
        }

        loan.setStatus(LoanStatus.RETOURNE);
        loan.setReturnDate(LocalDateTime.now());

        catalogClient.increaseStock(loan.getBookId());

        loan = loanRepository.save(loan);

        BookDto book = catalogClient.getBookById(loan.getBookId());
        return toLoanResponse(loan, book);
    }

    public List<LoanResponse> findLoansByUserId(Long userId) {
        return loanRepository.findByUserId(userId).stream()
                .map(this::toLoanResponseWithBook)
                .collect(Collectors.toList());
    }

    public List<LoanResponse> findActiveLoansByUserId(Long userId) {
        return loanRepository.findByUserId(userId).stream()
                .filter(loan -> loan.getStatus() == LoanStatus.EN_COURS)
                .map(this::toLoanResponseWithBook)
                .collect(Collectors.toList());
    }

    public List<LoanResponse> getAllLoans() {
        return loanRepository.findAll().stream()
                .map(this::toLoanResponseWithBookAndUser)
                .collect(Collectors.toList());
    }

    private LoanResponse toLoanResponseWithBookAndUser(Loan loan) {
        BookDto book = null;
        try {
            book = catalogClient.getBookById(loan.getBookId());
        } catch (Exception e) {
            // ignore if book service fails
        }

        com.example.loan_service.dto.UserDto user = null;
        try {
            user = userClient.getUserById(loan.getUserId());
        } catch (Exception e) {
            // ignore if user service fails
        }

        return toLoanResponse(loan, book, user);
    }

    private LoanResponse toLoanResponseWithBook(Loan loan) {
        BookDto book = catalogClient.getBookById(loan.getBookId());
        return toLoanResponse(loan, book, null);
    }

    private LoanResponse toLoanResponse(Loan loan, BookDto book) {
        return toLoanResponse(loan, book, null);
    }

    private LoanResponse toLoanResponse(Loan loan, BookDto book, com.example.loan_service.dto.UserDto user) {
        return LoanResponse.builder()
                .id(loan.getId())
                .userId(loan.getUserId())
                .userName(user != null ? user.getFullName() : "Unknown User (" + loan.getUserId() + ")")
                .bookId(loan.getBookId())
                .bookTitle(book != null ? book.getTitle() : "Unknown")
                .authorName(book != null && book.getAuthor() != null ? book.getAuthor().getName() : "Unknown")
                .loanDate(loan.getLoanDate())
                .dueDate(loan.getDueDate())
                .returnDate(loan.getReturnDate())
                .status(loan.getStatus())
                .fineAmount(loan.getFineAmount())
                .overdue(loan.getDueDate() != null && LocalDate.now().isAfter(loan.getDueDate())
                        && loan.getStatus() == LoanStatus.EN_COURS)
                .build();
    }
}
