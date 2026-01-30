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
 * Health & Security Test Controller
 * 
 * Amaç: Spring Security konfigürasyonunu test etmek
 * 
 * 3 farklı güvenlik seviyesi endpoint'i gösterir:
 * 1. Public Endpoint: Kimlik doğrulama gerekmiyor
 * 2. Secure Endpoint: Giriş yapılmış kullanıcılar
 * 3. Admin Endpoint: Sadece ADMIN rolüne sahip kullanıcılar
 * 
 * PRODUCTION'DA SİL - Sadece test/demo için!
 */
@RestController
@RequestMapping("/api")
@Log4j2
public class HealthController {

    /**
     * PUBLIC Endpoint - Kimlik Doğrulama OLMADAN
     * 
     * URL: GET /api/public/ping
     * Güvenlik: Herkese açık (@PreAuthorize yok)
     * 
     * İçinde ne yapılır:
     * - "API ayakta mı?" kontrolü
     * - Herkesin görebileceği bilgi
     */
    @GetMapping("/public/ping")
    public ResponseEntity<Map<String, Object>> publicPing() {
        log.info("Public endpoint accessed - no authentication required");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "ok");
        response.put("timestamp", LocalDateTime.now());
        response.put("message", "Finance Portal API is running");

        return ResponseEntity.ok(response);
    }

    /**
     * SECURE Endpoint - GİRİŞ YAPMIŞ Kullanıcılar SADECE
     * 
     * URL: GET /api/secure/profile
     * Güvenlik: @PreAuthorize("isAuthenticated()")
     * ↳ JWT token gerekli
     * ↳ Herhangi bir rol olabilir (user, admin vb.)
     * 
     * İçinde ne yapılır:
     * - Oturum açmış kullanıcının profil bilgisini göster
     * - SecurityContextHolder'dan user bilgisi çek
     * - Kullanıcının rolleri listele
     */
    @GetMapping("/secure/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> secureProfile() {
        // SecurityContextHolder: Mevcut user'ın bilgisini tut
        // Bu thread'de oturum açmış user'ın authentication bilgisini al
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

    /**
     * ADMIN Endpoint - SADECE ADMIN Rolüne Sahip Kullanıcılar
     * 
     * URL: GET /api/admin/system-info
     * Güvenlik: @PreAuthorize("hasRole('ADMIN')")
     * ↳ JWT token + ADMIN rolü ZORUNLU
     * ↳ Başka roller (user, analyst vb.) erişemez
     * ↳ Eğer şart sağlanmazsa: 403 Forbidden
     * 
     * İçinde ne yapılır:
     * - Sistem bilgisi (Java version, OS, bellek vb.)
     * - Sadece admin'ler görmesi gereken bilgiler
     * 
     * PRODUCTION'DA:
     * - Daha kısıtlı bilgi göster
     * - Kullanıcı aktivitesini loglaMUST
     */
    @GetMapping("/admin/system-info")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> adminSystemInfo() {
        // Kimin bu endpoint'e eriştiğini kontrol et
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        log.info("Admin endpoint accessed by: {}", authentication.getName());
        // admine sistemin durumunu göster
        Map<String, Object> response = new HashMap<>();
        response.put("javaVersion", System.getProperty("java.version"));
        response.put("osName", System.getProperty("os.name"));
        response.put("availableProcessors", Runtime.getRuntime().availableProcessors());
        response.put("maxMemory", Runtime.getRuntime().maxMemory());
        response.put("timestamp", LocalDateTime.now());

        return ResponseEntity.ok(response);
    }
}
