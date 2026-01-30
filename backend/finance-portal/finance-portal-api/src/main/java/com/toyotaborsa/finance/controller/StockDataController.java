package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.service.StockDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

/**
 * Hisse Senedi (Stock) Veri API Controller
 * 
 * REST endpoint'leri sağlar:
 * - GET /api/stocks → Tüm hisse verilerini veya seçili hisseleri getir
 * - GET /api/stocks/{symbol} → Belirli bir hisse verisi getir
 * 
 * Veri Kaynağı: CollectAPI (BIST canlı hisse verileri)
 * Endpoint güvenliği: Herkese açık (SecurityConfig'de permitAll)
 */
@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockDataController {

    // StockDataService enjekte (Lombok @RequiredArgsConstructor ile)
    private final StockDataService stockDataService;

    /**
     * Hisse Verilerini Getir (Tüm veya Filtrelı)
     * 
     * GET /api/stocks
     * GET /api/stocks?symbols=GARAN,ASELS,THYAO
     * 
     * @param symbols Opsiyonel: Getirmek istediğin hisse kodları
     *                Boş = tüm hisseleri getir
     *                "GARAN,ASELS" = sadece bu hisseleri getir
     * 
     * @return Hisse verileri (Kod → StockData)
     * 
     *         Örnek Response:
     *         {
     *         "GARAN": { "symbol": "GARAN", "price": 45.67, "change": 1.23 },
     *         "ASELS": { "symbol": "ASELS", "price": 34.50, "change": -0.45 }
     *         }
     * 
     *         Cache: StockDataService içinde yapılandırılmıştır
     *         TTL: application.yml'deki cache.stock-ttl (genelde 15 dakika)
     *         Scheduler: Her 10 dakikada güncellenir (application.yml'deki
     *         stock-cron)
     */
    @GetMapping
    public ResponseEntity<Map<String, StockDataService.StockData>> getStocks(
            @RequestParam(required = false) String[] symbols) {
        // symbols parametresi opsiyonel: symbols=A,B,C şeklinde gelebilir
        // null ise tüm hisseleri getir, array ise sadece seçilileri getir
        List<String> symbolList = symbols != null ? Arrays.asList(symbols) : null;
        return ResponseEntity.ok(stockDataService.getStocks(symbolList));
    }

    /**
     * Belirli Bir Hisse Verisi Getir
     * 
     * GET /api/stocks/GARAN
     * GET /api/stocks/THYAO
     * 
     * @param symbol Hisse kodu (örn: GARAN, ASELS, THYAO vb.)
     * 
     * @return Hisse verisi (StockData nesnesi)
     * @return 404 Not Found eğer hisse bulunamazsa
     * 
     *         Örnek Response (200 OK):
     *         {
     *         "symbol": "GARAN",
     *         "price": 45.67,
     *         "change": 1.23,
     *         "changePercent": 2.77,
     *         "timestamp": "2025-01-25T14:30:00Z"
     *         }
     * 
     *         Error Response (404):
     *         {} (boş istek)
     */
    @GetMapping("/{symbol}")
    public ResponseEntity<StockDataService.StockData> getStock(@PathVariable String symbol) {
        // Belirli hisseyi getir (bir element list olarak)
        Map<String, StockDataService.StockData> stocks = stockDataService.getStocks(Arrays.asList(symbol));
        // Haritadan hisseyi çıkar
        StockDataService.StockData stock = stocks.get(symbol);

        // Hisse bulunmazsa 404 döndür
        if (stock == null) {
            return ResponseEntity.notFound().build();
        }

        // Bulunan hisseyi 200 OK ile döndür
        return ResponseEntity.ok(stock);
    }
}
