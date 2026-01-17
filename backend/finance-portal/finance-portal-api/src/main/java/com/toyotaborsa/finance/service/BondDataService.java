package com.toyotaborsa.finance.service;

import com.toyotaborsa.finance.config.FinanceApiConfig;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BondDataService {

    private final FinanceApiConfig apiConfig;

    @Data
    public static class BondData {
        private String symbol;
        private String name;
        private String type; // BOND, TREASURY_BILL
        private Double price;
        private Double yield;
        private Double couponRate;
        private LocalDate maturityDate;
        private LocalDateTime timestamp;

        public BondData(String symbol, String name, String type) {
            this.symbol = symbol;
            this.name = name;
            this.type = type;
            this.price = 0.0;
            this.yield = 0.0;
            this.couponRate = 0.0;
            this.maturityDate = LocalDate.now().plusYears(1);
            this.timestamp = LocalDateTime.now();
        }
    }

    @Cacheable(value = "bondData", cacheManager = "cacheManager")
    public List<BondData> getBonds() {
        if (!apiConfig.getBond().isConfigured()) {
            log.warn("Bond API yapılandırılmamış, placeholder veri döndürülüyor");
            return getPlaceholderData();
        }

        String apiKey = apiConfig.getBond().getApiKey();
        String apiUrl = apiConfig.getBond().getApiUrl();

        log.info("Tahvil/Bono verileri çekiliyor - URL: {}", apiUrl);

        try {
            // TODO: API entegrasyonu yapılacak
            // Örnek: GET {apiUrl}/bonds?apikey={apiKey}

            return getPlaceholderData();
        } catch (Exception e) {
            log.error("Tahvil verileri alınırken hata oluştu: {}", e.getMessage());
            return getPlaceholderData();
        }
    }

    private List<BondData> getPlaceholderData() {
        return new ArrayList<>();
    }
}
