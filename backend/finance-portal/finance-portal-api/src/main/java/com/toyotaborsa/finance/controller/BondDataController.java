package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.service.BondDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Tahvil (Bond) Veri API Controller
 * 
 * REST endpoint'leri sağlar:
 * - GET /api/bonds → Tüm tahvil verilerini getir
 * 
 * Endpoint güvenliği: Herkese açık (SecurityConfig'de permitAll)
 */
@RestController
@RequestMapping("/api/bonds")
@RequiredArgsConstructor
public class BondDataController {

    // BondDataService enjekte (Lombok @RequiredArgsConstructor ile)
    private final BondDataService bondDataService;

    /**
     * Tüm Tahvil Verilerini Getir
     * 
     * GET /api/bonds
     * 
     * @return Tahvil listesi (BondData nesneleri)
     * 
     *         Cache: BondDataService içinde yapılandırılmıştır
     *         TTL: application.yml'deki cache.bond-ttl (60 dakika)
     */
    @GetMapping
    public ResponseEntity<List<BondDataService.BondData>> getBonds() {
        return ResponseEntity.ok(bondDataService.getBonds());
    }
}
