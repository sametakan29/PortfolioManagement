package com.toyotaborsa.finance.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;

/**
 * Portfolio REST controller for managing user portfolios and investments.
 */
@RestController
@RequestMapping("/api/portfolio")
@Log4j2
public class PortfolioController {

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getPortfolio() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        log.info("Portfolio request from user: {}", username);
        log.debug("User authorities: {}", auth.getAuthorities());

        Map<String, Object> portfolio = new HashMap<>();
        portfolio.put("userId", username);
        portfolio.put("totalValue", 150000.00);
        portfolio.put("cash", 25000.00);
        portfolio.put("investments", List.of(
                Map.of(
                        "symbol", "AAPL",
                        "quantity", 100,
                        "currentPrice", 185.50,
                        "totalValue", 18550.00
                ),
                Map.of(
                        "symbol", "MSFT",
                        "quantity", 50,
                        "currentPrice", 420.00,
                        "totalValue", 21000.00
                )
        ));
        portfolio.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(portfolio);
    }

    @PostMapping("/transactions")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> createTransaction(@RequestBody Map<String, Object> transaction) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        log.info("Transaction created by user: {}", auth.getName());
        log.debug("Transaction details: {}", transaction);

        Map<String, Object> response = new HashMap<>();
        response.put("transactionId", UUID.randomUUID().toString());
        response.put("status", "SUCCESS");
        response.put("timestamp", LocalDateTime.now());
        response.putAll(transaction);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/transactions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> getTransactions() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        log.info("Transactions request from: {}", auth.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("transactions", List.of(
                Map.of(
                        "id", UUID.randomUUID(),
                        "type", "BUY",
                        "symbol", "AAPL",
                        "quantity", 100,
                        "price", 185.50,
                        "timestamp", LocalDateTime.now().minusDays(5)
                ),
                Map.of(
                        "id", UUID.randomUUID(),
                        "type", "BUY",
                        "symbol", "MSFT",
                        "quantity", 50,
                        "price", 420.00,
                        "timestamp", LocalDateTime.now().minusDays(3)
                )
        ));
        response.put("count", 2);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/analysis")
    @PreAuthorize("hasRole('ADMIN') or @authorizationService.isOwner()")
    public ResponseEntity<Map<String, Object>> getAnalysis() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        log.info("Analysis request from: {}", auth.getName());

        Map<String, Object> analysis = new HashMap<>();
        analysis.put("portfolioReturn", 12.5);
        analysis.put("riskScore", 4.2);
        analysis.put("diversificationIndex", 0.75);
        analysis.put("recommendation", "Well balanced portfolio");
        analysis.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(analysis);
    }
}
