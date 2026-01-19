package com.toyotaborsa.finance.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.toyotaborsa.finance.config.FinanceApiConfig;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class StockDataService {

    private final FinanceApiConfig apiConfig;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

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

    @Data
    public static class CollectApiResponse {
        private boolean success;
        private List<CollectApiStockData> result;
    }

    @Data
    public static class CollectApiStockData {
        private String currency;
        private String name;
        private String pricestr;
        private Double price;
        private Double rate;
        private String time;
    }

    @Cacheable(value = "stockData", cacheManager = "cacheManager")
    public Map<String, StockData> getStocks(List<String> symbols) {
        if (!apiConfig.getStock().isConfigured()) {
            log.error("Stock API yapılandırılmamış! Lütfen application.yml dosyasında stock API ayarlarını yapın.");
            throw new IllegalStateException("Stock API yapılandırılmamış");
        }

        String apiKey = apiConfig.getStock().getApiKey();
        String apiUrl = apiConfig.getStock().getApiUrl();

        log.info("BIST hisse verileri çekiliyor - CollectAPI");

        try {
            // CollectAPI'den tüm BIST hisselerini çek
            HttpHeaders headers = new HttpHeaders();
            headers.set("content-type", "application/json");
            headers.set("authorization", "apikey " + apiKey);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.GET,
                    entity,
                    String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            boolean success = root.path("success").asBoolean();

            if (!success) {
                log.error("CollectAPI'den hata geldi");
                return new HashMap<>();
            }

            Map<String, StockData> stockDataMap = new HashMap<>();
            JsonNode results = root.path("result");

            // Eğer symbols belirtilmişse sadece onları filtrele, yoksa tümünü al
            for (JsonNode item : results) {
                String name = item.path("name").asText();

                // Eğer symbols listesi varsa ve bu symbol listede değilse atla
                if (symbols != null && !symbols.isEmpty() && !symbols.contains(name)) {
                    continue;
                }

                Double price = item.path("price").asDouble();
                Double rate = item.path("rate").asDouble();

                StockData stockData = new StockData(name, getStockName(name));
                stockData.setPrice(price);
                stockData.setChangePercent(rate);

                // Değişim miktarını yüzdeye göre hesapla
                if (rate != 0) {
                    stockData.setChange(price * rate / (100 + rate));
                }

                stockData.setTimestamp(LocalDateTime.now());
                stockDataMap.put(name, stockData);
            }

            log.info("BIST'ten {} hisse verisi alındı", stockDataMap.size());
            return stockDataMap;

        } catch (Exception e) {
            log.error("CollectAPI'den veri alınırken hata: {}", e.getMessage(), e);
            return new HashMap<>();
        }
    }

    private String getStockName(String symbol) {
        Map<String, String> stockNames = new HashMap<>();
        stockNames.put("THYAO", "Türk Hava Yolları");
        stockNames.put("GARAN", "Garanti BBVA");
        stockNames.put("AKBNK", "Akbank");
        stockNames.put("EREGL", "Ereğli Demir Çelik");
        stockNames.put("SISE", "Şişecam");
        stockNames.put("KCHOL", "Koç Holding");
        stockNames.put("ASELS", "Aselsan");
        stockNames.put("BIMAS", "BİM Mağazaları");
        stockNames.put("TOASO", "Tofaş Oto");
        stockNames.put("TCELL", "Turkcell");
        stockNames.put("TUPRS", "Tüpraş");
        stockNames.put("SAHOL", "Sabancı Holding");
        stockNames.put("ISCTR", "İş Bankası (C)");
        stockNames.put("PETKM", "Petkim");
        stockNames.put("VAKBN", "Vakıfbank");
        return stockNames.getOrDefault(symbol, symbol);
    }
}
