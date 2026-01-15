package com.toyotaborsa.finance.service;

import com.toyotaborsa.finance.config.FinanceApiConfig;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class StockDataService {

    private final FinanceApiConfig apiConfig;

    @Data
    public static class StockData {
        private String symbol;
        private String name;
        private Double price;
        private Double change;
        private Double changePercent;
        private Long volume;
        private Double marketCap;
        private LocalDateTime timestamp;

        public StockData(String symbol, String name) {
            this.symbol = symbol;
            this.name = name;
            this.price = 0.0;
            this.change = 0.0;
            this.changePercent = 0.0;
            this.volume = 0L;
            this.marketCap = 0.0;
            this.timestamp = LocalDateTime.now();
        }
    }

    @Cacheable(value = "stockData", cacheManager = "cacheManager")
    public Map<String, StockData> getStocks(List<String> symbols) {
        if (!apiConfig.getStock().isConfigured()) {
            log.warn("Stock API yapılandırılmamış, placeholder veri döndürülüyor");
            return getPlaceholderData();
        }

        String apiKey = apiConfig.getStock().getApiKey();
        String apiUrl = apiConfig.getStock().getApiUrl();

        log.info("Hisse verileri çekiliyor - URL: {}, Symbols: {}", apiUrl, symbols);

        try {
            // TODO: API entegrasyonu yapılacak
            // API'den veri çekmek için:
            // 1. symbols listesini döngüyle gez
            // 2. Her symbol için apiUrl'e istek at
            // 3. Response'u StockData objesine dönüştür
            // Örnek: GET {apiUrl}/quote?symbol={symbol}&apikey={apiKey}

            return getPlaceholderData();
        } catch (Exception e) {
            log.error("Hisse verileri alınırken hata oluştu: {}", e.getMessage());
            return getPlaceholderData();
        }
    }

    private Map<String, StockData> getPlaceholderData() {
        Map<String, StockData> stocks = new HashMap<>();
        stocks.put("THYAO.IS", new StockData("THYAO.IS", "Türk Hava Yolları"));
        stocks.put("ASELS.IS", new StockData("ASELS.IS", "Aselsan"));
        stocks.put("GARAN.IS", new StockData("GARAN.IS", "Garanti BBVA"));
        return stocks;
    }
}
