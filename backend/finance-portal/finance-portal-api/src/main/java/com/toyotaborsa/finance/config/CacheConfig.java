package com.toyotaborsa.finance.config;

// Caffeine: Yüksek performanslı in-memory cache kütüphanesi
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
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
     * Cache Manager Bean - Tüm cache'leri yönetir
     * Her veri tipi için ayrı cache oluşturur ve yapılandırır
     */
    @Bean
    public CacheManager cacheManager() {
        SimpleCacheManager cacheManager = new SimpleCacheManager();
        cacheManager.setCaches(Arrays.asList(
                buildCache("forexRates", 8), // Döviz: 8 dk
                buildCache("stockData", 15), // Hisse: 15 dk
                buildCache("stockChart", 5), // Hisse Grafik: 5 dk
                buildCache("bondData", 90), // Tahvil: 90 dk
                buildCache("viopData", 15), // VIOP: 15 dk
                buildCache("fundData", 90) // Fon: 90 dk
        ));
        return cacheManager;
    }

    /**
     * Caffeine Cache Builder - Her cache için özel konfigürasyon
     * 
     * @param cacheName  Cache adı (Spring @Cacheable'da kullanılır)
     * @param ttlMinutes Verinin geçerliliği süresi (dakika)
     * @return Yapılandırılmış CaffeineCache nesnesi
     */
    private CaffeineCache buildCache(String cacheName, int ttlMinutes) {
        return new CaffeineCache(cacheName, Caffeine.newBuilder()
                // Maksimum 1000 kayıt sakla (overflow'u önle)
                .maximumSize(1000)
                // TTL: Yazıldıktan sonra otomatik silinme
                .expireAfterWrite(ttlMinutes, TimeUnit.MINUTES)
                // İstatistik topla (hit/miss oranları - monitoring için)
                .recordStats()
                .build());
    }
}
