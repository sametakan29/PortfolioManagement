package com.toyotaborsa.finance.service;

import com.toyotaborsa.finance.config.FinanceApiConfig;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class ForexDataService {

    private final FinanceApiConfig apiConfig;
    private final RestTemplate restTemplate = new RestTemplate();

    @Data
    public static class ForexRate {
        private String pair;
        private Double rate;
        private Double bid;
        private Double ask;
        private String name;
        private LocalDateTime timestamp;

        public ForexRate(String pair, Double rate, String name) {
            this.pair = pair;
            this.rate = rate;
            this.bid = rate;
            this.ask = rate;
            this.name = name;
            this.timestamp = LocalDateTime.now();
        }
    }

    @Cacheable(value = "forexRates", cacheManager = "cacheManager")
    public Map<String, ForexRate> getForexRates() {
        if (!apiConfig.getForex().isConfigured()) {
            log.warn("Forex API yapılandırılmamış, placeholder veri döndürülüyor");
            return getPlaceholderData();
        }

        String apiKey = apiConfig.getForex().getApiKey();
        String apiUrl = apiConfig.getForex().getApiUrl();

        log.info("Forex verileri çekiliyor - URL: {}", apiUrl);

        try {
            // TODO: API entegrasyonu yapılacak
            // API'den veri çekmek için:
            // 1. RestTemplate veya HttpClient kullan
            // 2. apiUrl ve apiKey ile istek at
            // 3. Response'u ForexRate objesine dönüştür
            // Örnek: GET {apiUrl}/rates?apikey={apiKey}

            return getPlaceholderData();
        } catch (Exception e) {
            log.error("Forex verileri alınırken hata oluştu: {}", e.getMessage());
            return getPlaceholderData();
        }
    }

    private Map<String, ForexRate> getPlaceholderData() {
        Map<String, ForexRate> rates = new HashMap<>();
        rates.put("USD/TRY", new ForexRate("USD/TRY", 0.0, "US Dollar"));
        rates.put("EUR/TRY", new ForexRate("EUR/TRY", 0.0, "Euro"));
        rates.put("GBP/TRY", new ForexRate("GBP/TRY", 0.0, "British Pound"));
        rates.put("JPY/TRY", new ForexRate("JPY/TRY", 0.0, "Japanese Yen"));
        return rates;
    }
}
