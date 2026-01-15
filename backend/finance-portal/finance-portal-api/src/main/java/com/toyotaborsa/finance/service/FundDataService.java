package com.toyotaborsa.finance.service;

import com.toyotaborsa.finance.config.FinanceApiConfig;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class FundDataService {

    private final FinanceApiConfig apiConfig;

    @Data
    public static class FundData {
        private String code;
        private String name;
        private String type; // MUTUAL_FUND, ETF, PENSION_FUND
        private Double price;
        private Double change;
        private Double changePercent;
        private Double totalAssets;
        private Double yearReturn;
        private LocalDateTime timestamp;

        public FundData(String code, String name, String type) {
            this.code = code;
            this.name = name;
            this.type = type;
            this.price = 0.0;
            this.change = 0.0;
            this.changePercent = 0.0;
            this.totalAssets = 0.0;
            this.yearReturn = 0.0;
            this.timestamp = LocalDateTime.now();
        }
    }

    @Cacheable(value = "fundData", cacheManager = "cacheManager")
    public List<FundData> getFunds() {
        if (!apiConfig.getFund().isConfigured()) {
            log.warn("Fund API yapılandırılmamış, placeholder veri döndürülüyor");
            return getPlaceholderData();
        }

        String apiKey = apiConfig.getFund().getApiKey();
        String apiUrl = apiConfig.getFund().getApiUrl();

        log.info("Fon verileri çekiliyor - URL: {}", apiUrl);

        try {
            // TODO: API entegrasyonu yapılacak
            // Örnek: GET {apiUrl}/funds?apikey={apiKey}

            return getPlaceholderData();
        } catch (Exception e) {
            log.error("Fon verileri alınırken hata oluştu: {}", e.getMessage());
            return getPlaceholderData();
        }
    }

    private List<FundData> getPlaceholderData() {
        List<FundData> funds = new ArrayList<>();
        funds.add(new FundData("GAH", "Garanti Portföy Hisse Senedi Fonu", "MUTUAL_FUND"));
        funds.add(new FundData("AKH", "Ak Portföy Hisse Senedi Fonu", "MUTUAL_FUND"));
        funds.add(new FundData("THYAO", "Türk Hava Yolları BYF", "ETF"));
        return funds;
    }
}
