package com.toyotaborsa.finance.service;

import com.toyotaborsa.finance.config.FinanceApiConfig;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ViopDataService {

    private final FinanceApiConfig apiConfig;

    @Data
    public static class ViopData {
        private String symbol;
        private String name;
        private String type; // FUTURE, OPTION_CALL, OPTION_PUT
        private Double price;
        private Double change;
        private Double changePercent;
        private Long volume;
        private Long openInterest;
        private LocalDate expiryDate;
        private LocalDateTime timestamp;

        public ViopData(String symbol, String name, String type) {
            this.symbol = symbol;
            this.name = name;
            this.type = type;
            this.price = 0.0;
            this.change = 0.0;
            this.changePercent = 0.0;
            this.volume = 0L;
            this.openInterest = 0L;
            this.expiryDate = LocalDate.now().plusMonths(1);
            this.timestamp = LocalDateTime.now();
        }
    }

    @Cacheable(value = "viopData", cacheManager = "cacheManager")
    public List<ViopData> getViopInstruments() {
        if (!apiConfig.getViop().isConfigured()) {
            log.error("VIOP API yapılandırılmamış! Lütfen application.yml dosyasında viop API ayarlarını yapın.");
            throw new IllegalStateException("VIOP API yapılandırılmamış");
        }

        String apiKey = apiConfig.getViop().getApiKey();
        String apiUrl = apiConfig.getViop().getApiUrl();

        log.info("VIOP verileri çekiliyor - URL: {}", apiUrl);

        try {
            // TODO: API entegrasyonu yapılacak
            // Örnek: GET {apiUrl}/viop?apikey={apiKey}

            throw new UnsupportedOperationException(
                    "VIOP API entegrasyonu henüz yapılmadı. API Key: " + (apiKey != null ? "mevcut" : "yok"));
        } catch (UnsupportedOperationException e) {
            throw e;
        } catch (Exception e) {
            log.error("VIOP verileri alınırken hata oluştu: {}", e.getMessage());
            throw new RuntimeException("VIOP verileri alınamadı", e);
        }
    }
}
