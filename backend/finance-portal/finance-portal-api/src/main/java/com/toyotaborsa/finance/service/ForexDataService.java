package com.toyotaborsa.finance.service;

import com.toyotaborsa.finance.config.FinanceApiConfig;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.StringReader;
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
        // TCMB için API key kontrolü yapma, sadece URL kontrolü yap
        String apiUrl = apiConfig.getForex().getApiUrl();

        if (!apiConfig.getForex().isEnabled() || apiUrl == null || apiUrl.isEmpty()) {
            log.warn("Forex API yapılandırılmamış, placeholder veri döndürülüyor");
            return getPlaceholderData();
        }

        log.info("TCMB'den döviz kurları çekiliyor - URL: {}", apiUrl);

        try {
            // TCMB XML API'den veri çek
            String xmlContent = restTemplate.getForObject(apiUrl, String.class);

            if (xmlContent == null || xmlContent.isEmpty()) {
                log.warn("TCMB'den boş response geldi");
                return getPlaceholderData();
            }

            // XML'i parse et
            Map<String, ForexRate> rates = parseTcmbXml(xmlContent);
            log.info("TCMB'den {} döviz kuru başarıyla alındı", rates.size());

            return rates;
        } catch (Exception e) {
            log.error("TCMB'den döviz kurları alınırken hata: {}", e.getMessage(), e);
            return getPlaceholderData();
        }
    }

    /**
     * TCMB XML formatını parse eder
     */
    private Map<String, ForexRate> parseTcmbXml(String xmlContent) {
        Map<String, ForexRate> rates = new HashMap<>();

        try {
            // XML parser'ı güvenli ayarlarla oluştur
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            factory.setFeature("http://xml.org/sax/features/external-general-entities", false);
            factory.setFeature("http://xml.org/sax/features/external-parameter-entities", false);

            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(new InputSource(new StringReader(xmlContent)));

            NodeList currencyList = doc.getElementsByTagName("Currency");

            // Her currency elementini işle
            for (int i = 0; i < currencyList.getLength(); i++) {
                Element currencyElement = (Element) currencyList.item(i);
                String code = currencyElement.getAttribute("Kod");

                // ForexBuying (alış) ve ForexSelling (satış) kurlarını al
                String buyingStr = getElementText(currencyElement, "ForexBuying");
                String sellingStr = getElementText(currencyElement, "ForexSelling");
                String nameStr = getElementText(currencyElement, "CurrencyName");

                if (buyingStr == null || buyingStr.isEmpty()) {
                    continue; // Forex kuru yoksa atla
                }

                Double buying = Double.parseDouble(buyingStr);
                Double selling = sellingStr != null && !sellingStr.isEmpty()
                        ? Double.parseDouble(sellingStr)
                        : buying;

                // Ortalama kur
                Double avgRate = (buying + selling) / 2.0;

                ForexRate rate = new ForexRate(code + "/TRY", avgRate, nameStr);
                rate.setBid(buying);
                rate.setAsk(selling);

                rates.put(code + "/TRY", rate);
            }

        } catch (Exception e) {
            log.error("TCMB XML parse hatası: {}", e.getMessage(), e);
        }

        return rates;
    }

    /**
     * XML elementinden text içeriğini güvenli şekilde alır
     */
    private String getElementText(Element parent, String tagName) {
        try {
            NodeList nodeList = parent.getElementsByTagName(tagName);
            if (nodeList.getLength() > 0) {
                return nodeList.item(0).getTextContent();
            }
        } catch (Exception e) {
            log.debug("Element okunamadı: {}", tagName);
        }
        return null;
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
