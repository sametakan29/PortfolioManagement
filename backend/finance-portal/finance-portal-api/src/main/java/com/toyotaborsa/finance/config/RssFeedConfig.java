package com.toyotaborsa.finance.config;

import com.toyotaborsa.finance.entity.NewsCategory;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * RSS Feed Konfigürasyonu
 * 
 * application.yml dosyasından news.rss prefix'i ile haber kaynaklarını okur
 * Farklı finansal kaynakları düzenli aralıklarla tarayan scheduler'ı yönetir
 */
@Configuration
@ConfigurationProperties(prefix = "news.rss")
@Data
public class RssFeedConfig {

    // Tüm RSS feed kaynaklarının listesi (Bloomberg, Dünya, Hürriyet vb.)
    private List<FeedSource> sources = new ArrayList<>();

    // RSS feed çekme özelliği (true = aktif, false = devre dışı)
    private boolean enabled = true;

    // Feed'leri ne sıklıkta güncelleyelim (dakika cinsinden)
    private int fetchIntervalMinutes = 30;

    /**
     * Tek Bir RSS Feed Kaynağının Yapılandırması
     * 
     * application.yml'de şu şekilde tanımlanır:
     * - name: "Bloomberg HT"
     * url: "https://www.bloomberght.com/rss"
     * category: GENERAL_ECONOMY
     * enabled: true
     */
    @Data
    public static class FeedSource {
        // Kaynağın adı (kullanıcı dostu)
        private String name;

        // RSS feed URL'i (mutlaka http/https ile başlamalı)
        private String url;

        // Haber kategorisi (GENERAL_ECONOMY, STOCK_MARKET, FOREX)
        private NewsCategory category;

        // Bu kaynağı çekmek istiyorum mu? (false = bu kaynağı at)
        private boolean enabled = true;
    }
}
