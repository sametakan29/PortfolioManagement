package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.service.MarketHoursService;
import com.toyotaborsa.finance.service.MarketHoursService.MarketStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Piyasa Durumu Controller
 * 
 * BIST'in mevcut seans durumunu ve açık/kapalı bilgisini döner.
 * Frontend bu endpoint'i kullanarak banner gösterir.
 */
@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketStatusController {

    private final MarketHoursService marketHoursService;

    /**
     * Mevcut piyasa durumunu döner
     * 
     * @return MarketStatus - seans bilgisi, başlık, açıklama, açık/kapalı
     */
    @GetMapping("/status")
    public ResponseEntity<MarketStatus> getMarketStatus() {
        return ResponseEntity.ok(marketHoursService.getMarketStatus());
    }
}
