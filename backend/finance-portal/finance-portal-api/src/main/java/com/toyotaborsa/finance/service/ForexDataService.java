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
        private String code;
        private String name;
        private Double rate;
        private Double buyRate;
        private Double sellRate;
        private String timestamp;

        public ForexRate(String code, String name, Double rate) {
            this.code = code;
            this.name = name;
            this.rate = rate;
            this.buyRate = rate * 0.998; // %0.2 spread ile alış
            this.sellRate = rate * 1.002; // %0.2 spread ile satış
            this.timestamp = LocalDateTime.now().toString();
        }
    }

    @Data
    public static class ExchangeRateApiResponse {
        private String result;
        private String documentation;
        private String terms_of_use;
        private Long time_last_update_unix;
        private String time_last_update_utc;
        private Long time_next_update_unix;
        private String time_next_update_utc;
        private String base_code;
        private Map<String, Double> conversion_rates;
    }

    @Cacheable(value = "forexRates", cacheManager = "cacheManager")
    public Map<String, ForexRate> getForexRates() {
        String apiUrl = apiConfig.getForex().getApiUrl();
        String apiKey = apiConfig.getForex().getApiKey();

        if (!apiConfig.getForex().isEnabled() || apiUrl == null || apiUrl.isEmpty() || apiKey == null
                || apiKey.isEmpty()) {
            log.error("Forex API yapılandırılmamış! Lütfen application.yml dosyasında forex API ayarlarını yapın.");
            throw new IllegalStateException("Forex API yapılandırılmamış");
        }

        log.info("ExchangeRate-API'den döviz kurları çekiliyor");

        try {
            // ExchangeRate-API'den veri çek
            String url = String.format("%s/%s/latest/TRY", apiUrl, apiKey);
            ExchangeRateApiResponse response = restTemplate.getForObject(url, ExchangeRateApiResponse.class);

            if (response == null || !"success".equals(response.getResult())) {
                log.error("ExchangeRate-API'den geçersiz response geldi");
                throw new RuntimeException("ExchangeRate-API'den geçersiz response geldi");
            }

            // Top 10 döviz kurunu al
            Map<String, ForexRate> rates = parseExchangeRateApi(response);
            log.info("ExchangeRate-API'den {} döviz kuru başarıyla alındı", rates.size());

            return rates;
        } catch (Exception e) {
            log.error("ExchangeRate-API'den döviz kurları alınırken hata: {}", e.getMessage(), e);
            throw new RuntimeException("Döviz kurları alınamadı", e);
        }
    }

    /**
     * ExchangeRate-API response'unu parse eder ve döviz kurlarını döndürür
     */
    private Map<String, ForexRate> parseExchangeRateApi(ExchangeRateApiResponse response) {
        Map<String, ForexRate> rates = new HashMap<>();

        try {
            Map<String, Double> conversionRates = response.getConversion_rates();

            for (Map.Entry<String, Double> entry : conversionRates.entrySet()) {
                String code = entry.getKey();
                Double rate = entry.getValue();

                if (rate != null && rate > 0) {
                    // TRY bazlı olduğu için ters çeviriyoruz (1 USD = X TRY)
                    Double tryRate = 1.0 / rate;
                    ForexRate forexRate = new ForexRate(code, code, tryRate);
                    rates.put(code, forexRate);
                }
            }

        } catch (Exception e) {
            log.error("ExchangeRate-API parse hatası: {}", e.getMessage(), e);
        }

        return rates;
    }
}
