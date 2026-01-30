package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.service.FundDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Fon (Investment Fund) Veri API Controller
 * 
 * REST endpoint'leri sağlar:
 * - GET /api/funds → Tüm fon verilerini getir
 * 
 * Veri Kaynağı: TEFAS veya SPK API (Türk yatırım fonları)
 * Endpoint güvenliği: Herkese açık (SecurityConfig'de permitAll)
 */
@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundDataController {

    // FundDataService enjekte (Lombok @RequiredArgsConstructor ile)
    private final FundDataService fundDataService;

    /**
     * Tüm Fon Verilerini Getir
     * 
     * GET /api/funds
     * 
     * @return Fon listesi (FundData nesneleri)
     * 
     *         Cache: FundDataService içinde yapılandırılmıştır
     *         TTL: application.yml'deki cache.fund-ttl (90 dakika)
     *         Scheduler: Her 1 saatte güncellenir (application.yml'deki fund-cron)
     */
    @GetMapping
    public ResponseEntity<List<FundDataService.FundData>> getFunds() {
        return ResponseEntity.ok(fundDataService.getFunds());
    }
}
