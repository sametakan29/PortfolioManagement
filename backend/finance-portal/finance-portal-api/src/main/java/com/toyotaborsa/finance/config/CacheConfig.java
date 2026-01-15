package com.toyotaborsa.finance.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

/**
 * Cache configuration using Caffeine (in-memory cache)
 * Önbellek yapılandırması - performans için sık kullanılan verileri bellekte
 * tutar
 */
@Configuration
@EnableCaching
public class CacheConfig {

    /**
     * Cache Manager bean
     * Her veri tipi için farklı sürelerde cache tutar
     */
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager(
                "forexRates", // Döviz kurları
                "stockData", // Hisse verileri
                "bondData", // Tahvil verileri
                "viopData", // VIOP verileri
                "fundData" // Fon verileri
        );

        cacheManager.setCaffeine(caffeineCacheBuilder());
        return cacheManager;
    }

    /**
     * Caffeine cache builder
     * Cache özellikleri:
     * - Maksimum 1000 kayıt
     * - 5 dakika sonra otomatik temizlenir
     * - Son erişimden 3 dakika sonra otomatik temizlenir
     */
    private Caffeine<Object, Object> caffeineCacheBuilder() {
        return Caffeine.newBuilder()
                .maximumSize(1000) // Max 1000 kayıt
                .expireAfterWrite(5, TimeUnit.MINUTES) // 5 dk sonra sil
                .expireAfterAccess(3, TimeUnit.MINUTES) // 3 dk erişilmezse sil
                .recordStats(); // İstatistik tut (monitoring için)
    }
}
