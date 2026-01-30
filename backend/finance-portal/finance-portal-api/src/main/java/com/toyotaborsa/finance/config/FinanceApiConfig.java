package com.toyotaborsa.finance.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Finans API Konfigürasyonu
 * 
 * application.yml dosyasından finance.api prefix'i ile değerleri okur
 * Her veri kategorisi için bağımsız API ayarları tutar
 */
@Configuration
@ConfigurationProperties(prefix = "finance.api")
@Data
public class FinanceApiConfig {

    // Her finans veri kategorisi için ayrı API konfigürasyonu
    private ApiConfig forex = new ApiConfig();
    private ApiConfig stock = new ApiConfig();
    private ApiConfig bond = new ApiConfig();
    private ApiConfig viop = new ApiConfig();
    private ApiConfig fund = new ApiConfig();

    /**
     * Genel API Konfigürasyonu - Tüm API sağlayıcılarla uyumlu
     * 
     * Her veri kategorisinin kendi API key ve URL'si olabilir
     * API sağlayıcısı değişikliği sadece config dosyasında yapılır
     */
    @Data
    public static class ApiConfig {
        // API etkinleştir/devre dışı bırak (false ise bu API çağrılmaz)
        private boolean enabled = false;
        // API erişim anahtarı (opsiyonel - TCMB gibi bazı API'ler gerektirmez)
        private String apiKey;
        // API endpoint URL'i
        private String apiUrl;

        /**
         * Bu API'nin kullanıma hazır olup olmadığını kontrol et
         * 
         * @return true olur eğer enabled ve URL varsa
         */
        public boolean isConfigured() {
            // API key opsiyonel (bazı API'ler public)
            return enabled && apiUrl != null && !apiUrl.isEmpty();
        }
    }
}
