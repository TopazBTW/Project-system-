package com.example.loan_service.repository;

import com.example.loan_service.domain.Loan;
import com.example.loan_service.domain.LoanStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {
    List<Loan> findByUserId(Long userId);

    List<Loan> findByStatus(LoanStatus status);

    long countByUserIdAndStatus(Long userId, LoanStatus status);
}
