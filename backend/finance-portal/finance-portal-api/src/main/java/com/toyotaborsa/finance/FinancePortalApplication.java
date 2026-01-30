package com.toyotaborsa.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Finance Portal Uygulamasının Ana Sınıfı
 * 
 * - Scheduling: Periyodik veri yenileme görevleri
 * - Caching: Veriler için cache etkinleştirme
 */
@SpringBootApplication
@EnableScheduling
@EnableCaching
public class FinancePortalApplication {

    /**
     * Uygulamayı başlat
     */
    public static void main(String[] args) {
        SpringApplication.run(FinancePortalApplication.class, args);
    }
}
