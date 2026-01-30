package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.service.ViopDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * VIOP (Vadeli İşlem) Veri API Controller
 * 
 * VIOP: Borsa İstanbul Vadeli İşlem ve Opsiyon Piyasası
 * Futures ve Options (Türev Ürünler) verileri sağlar
 * 
 * REST endpoint'leri:
 * - GET /api/viop → Tüm VIOP enstrümanlarını getir
 * 
 * Veri Kaynağı: Borsa İstanbul API
 * Endpoint güvenliği: Herkese açık (SecurityConfig'de permitAll)
 */
@RestController
@RequestMapping("/api/viop")
@RequiredArgsConstructor
public class ViopDataController {

    // ViopDataService enjekte (Lombok @RequiredArgsConstructor ile)
    private final ViopDataService viopDataService;

    /**
     * VIOP Enstrümanlarını Getir
     * 
     * GET /api/viop
     * 
     * @return VIOP enstrümanları listesi (ViopData nesneleri)
     * 
     *         Örnek Response:
     *         [
     *         {
     *         "symbol": "XU030F25",
     *         "name": "XU030 Aralık 2025 Futures",
     *         "type": "FUTURES", (FUTURES veya OPTIONS)
     *         "price": 8750.50,
     *         "openInterest": 50000,
     *         "volume": 15000,
     *         "expiryDate": "2025-12-31"
     *         }
     *         ]
     * 
     *         Cache: ViopDataService içinde yapılandırılmıştır
     *         TTL: application.yml'deki cache.viop-ttl (genelde 15 dakika)
     *         Scheduler: Her 10 dakikada güncellenir (application.yml'deki
     *         viop-cron)
     */
    @GetMapping
    public ResponseEntity<List<ViopDataService.ViopData>> getViopInstruments() {
        return ResponseEntity.ok(viopDataService.getViopInstruments());
    }
}
