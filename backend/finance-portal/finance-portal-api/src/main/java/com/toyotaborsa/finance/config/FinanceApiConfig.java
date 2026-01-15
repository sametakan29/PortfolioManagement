package com.toyotaborsa.finance.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "finance.api")
@Data
public class FinanceApiConfig {

    private ApiConfig forex = new ApiConfig();
    private ApiConfig stock = new ApiConfig();
    private ApiConfig bond = new ApiConfig();
    private ApiConfig viop = new ApiConfig();
    private ApiConfig fund = new ApiConfig();

    /**
     * Generic API configuration for all finance data sources
     * Can be used with ANY API provider
     */
    @Data
    public static class ApiConfig {
        private boolean enabled = false;
        private String apiKey;
        private String apiUrl;

        public boolean isConfigured() {
            // API key opsiyonel (TCMB gibi bazı API'ler key gerektirmez)
            return enabled && apiUrl != null && !apiUrl.isEmpty();
        }
    }
}
