package com.toyotaborsa.finance.controller;

import lombok.extern.log4j.Log4j2;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Sample REST controller demonstrating security configuration and logging.
 */
@RestController
@RequestMapping("/api")
@Log4j2
public class HealthController {

    @GetMapping("/public/ping")
    public ResponseEntity<Map<String, Object>> publicPing() {
        log.info("Public endpoint accessed - no authentication required");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Finance Portal API is running");

        return ResponseEntity.ok(response);
    }

    @GetMapping("/secure/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> secureProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("Secure endpoint accessed by user: {}", authentication.getName());
        log.debug("User authorities: {}", authentication.getAuthorities());

        Map<String, Object> response = new HashMap<>();
        response.put("username", authentication.getName());
        response.put("roles", authentication.getAuthorities());
        response.put("authenticated", authentication.isAuthenticated());
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/system-info")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> adminSystemInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("Admin endpoint accessed by: {}", authentication.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("javaVersion", System.getProperty("java.version"));
        response.put("osName", System.getProperty("os.name"));
        response.put("availableProcessors", Runtime.getRuntime().availableProcessors());
        response.put("maxMemory", Runtime.getRuntime().maxMemory());
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }
}
