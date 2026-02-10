package com.toyotaborsa.finance.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

/**
 * Hisse Senedi Grafik Verisi Servisi
 * 
 * Yahoo Finance v8 API kullanarak tarihsel fiyat verilerini çeker.
 * Desteklenen aralıklar: 1d, 5d, 1mo, 3mo, 1y, 5y
 * Desteklenen intervallar: 5m, 60m, 1d, 1wk
 * 
 * BIST hisseleri için sembol formatı: {SEMBOL}.IS (örn: THYAO.IS)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class StockChartService {

    private static final String YAHOO_CHART_URL = "https://query2.finance.yahoo.com/v8/finance/chart/%s.IS?range=%s&interval=%s";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Grafik veri noktası
     */
    @Data
    public static class ChartPoint {
        private long timestamp;
        private Double open;
        private Double high;
        private Double low;
        private Double close;
        private Long volume;

        public ChartPoint(long timestamp, Double open, Double high, Double low, Double close, Long volume) {
            this.timestamp = timestamp;
            this.open = open;
            this.high = high;
            this.low = low;
            this.close = close;
            this.volume = volume;
        }
    }

    /**
     * Grafik yanıt DTO'su
     */
    @Data
    public static class ChartResponse {
        private String symbol;
        private String range;
        private String interval;
        private String currency;
        private Double previousClose;
        private Double regularMarketPrice;
        private String shortName;
        private List<ChartPoint> data;

        public ChartResponse(String symbol, String range, String interval) {
            this.symbol = symbol;
            this.range = range;
            this.interval = interval;
            this.data = new ArrayList<>();
        }
    }

    /**
     * Yahoo Finance'den grafik verisini çeker
     * 
     * @param symbol Hisse sembolü (e.g., THYAO)
     * @param range  Zaman aralığı (1d, 5d, 1mo, 3mo, 1y, 5y)
     * @param interval Veri sıklığı (5m, 60m, 1d, 1wk)
     * @return ChartResponse grafik verisi
     */
    @Cacheable(value = "stockChart", key = "#symbol + '-' + #range + '-' + #interval", cacheManager = "cacheManager")
    public ChartResponse getChart(String symbol, String range, String interval) {
        String url = String.format(YAHOO_CHART_URL, symbol.toUpperCase(), range, interval);
        log.info("Yahoo Finance'den grafik verisi çekiliyor: {}", url);

        ChartResponse chartResponse = new ChartResponse(symbol.toUpperCase(), range, interval);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            JsonNode root = objectMapper.readTree(response.getBody());

            JsonNode chart = root.path("chart");
            if (chart.path("error").isNull() || chart.path("error").isMissingNode()) {
                JsonNode result = chart.path("result").get(0);
                JsonNode meta = result.path("meta");

                chartResponse.setCurrency(meta.path("currency").asText("TRY"));
                chartResponse.setPreviousClose(meta.path("chartPreviousClose").asDouble(0));
                chartResponse.setRegularMarketPrice(meta.path("regularMarketPrice").asDouble(0));
                chartResponse.setShortName(meta.path("shortName").asText(symbol));

                JsonNode timestamps = result.path("timestamp");
                JsonNode indicators = result.path("indicators");
                JsonNode quote = indicators.path("quote").get(0);

                JsonNode opens = quote.path("open");
                JsonNode highs = quote.path("high");
                JsonNode lows = quote.path("low");
                JsonNode closes = quote.path("close");
                JsonNode volumes = quote.path("volume");

                List<ChartPoint> points = new ArrayList<>();
                for (int i = 0; i < timestamps.size(); i++) {
                    long ts = timestamps.get(i).asLong();
                    Double open = opens.get(i).isNull() ? null : opens.get(i).asDouble();
                    Double high = highs.get(i).isNull() ? null : highs.get(i).asDouble();
                    Double low = lows.get(i).isNull() ? null : lows.get(i).asDouble();
                    Double close = closes.get(i).isNull() ? null : closes.get(i).asDouble();
                    Long volume = volumes.get(i).isNull() ? null : volumes.get(i).asLong();

                    // null veri noktalarını atla
                    if (close != null) {
                        points.add(new ChartPoint(ts, open, high, low, close, volume));
                    }
                }

                chartResponse.setData(points);
                log.info("{} için {} veri noktası alındı (range={}, interval={})",
                        symbol, points.size(), range, interval);
            } else {
                String errorMsg = chart.path("error").path("description").asText("Bilinmeyen hata");
                log.error("Yahoo Finance API hatası: {}", errorMsg);
            }
        } catch (Exception e) {
            log.error("Yahoo Finance'den grafik verisi alınırken hata: {} - {}", symbol, e.getMessage(), e);
        }

        return chartResponse;
    }
}
