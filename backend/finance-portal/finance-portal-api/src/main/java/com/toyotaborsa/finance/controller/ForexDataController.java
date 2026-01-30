package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.service.ForexDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Döviz Kuru (Forex) Veri API Controller
 * 
 * REST endpoint'leri sağlar:
 * - GET /api/forex/rates → Tüm döviz kurlarını getir
 * 
 * Veri Kaynağı: ExchangeRate-API
 * Endpoint güvenliği: Herkese açık (SecurityConfig'de permitAll)
 */
@RestController
@RequestMapping("/api/forex")
@RequiredArgsConstructor
public class ForexDataController {

    // ForexDataService enjekte (Lombok @RequiredArgsConstructor ile)
    private final ForexDataService forexDataService;

    /**
     * Döviz Kurlarını Getir
     * 
     * GET /api/forex/rates
     * 
     * Örnek Response:
     * {
     * "USD": { "code": "USD", "rate": 34.50, "timestamp": "2025-01-25T10:30:00Z" },
     * "EUR": { "code": "EUR", "rate": 37.20, "timestamp": "2025-01-25T10:30:00Z" }
     * }
     * 
     * @return Döviz kurları (Currency Code → ForexRate)
     * 
     *         Cache: BondDataService içinde yapılandırılmıştır
     *         TTL: application.yml'deki cache.forex-ttl (8 dakika)
     *         Scheduler: Her 5 dakikada güncellenir (application.yml'deki
     *         forex-cron)
     */
    @GetMapping("/rates")
    public ResponseEntity<Map<String, ForexDataService.ForexRate>> getForexRates() {
        return ResponseEntity.ok(forexDataService.getForexRates());
    }
}
