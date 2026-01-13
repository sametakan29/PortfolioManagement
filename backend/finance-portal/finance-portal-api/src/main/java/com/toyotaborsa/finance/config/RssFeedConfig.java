package com.toyotaborsa.finance.config;

import com.toyotaborsa.finance.entity.NewsCategory;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.List;

/**
 * RSS Feed yapılandırması
 * application.yml'den feed kaynaklarını okur
 */
@Configuration
@ConfigurationProperties(prefix = "news.rss")
@Data
public class RssFeedConfig {

    private List<FeedSource> sources = new ArrayList<>();
    private boolean enabled = true;
    private int fetchIntervalMinutes = 30; // Her 30 dakikada bir çek

    @Data
    public static class FeedSource {
        private String name;
        private String url;
        private NewsCategory category;
        private boolean enabled = true;
    }
}
