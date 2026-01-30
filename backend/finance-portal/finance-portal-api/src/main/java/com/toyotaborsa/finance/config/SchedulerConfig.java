package com.toyotaborsa.finance.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Scheduler Konfigürasyonu
 * 
 * Periyodik (zamanlanmış) görevleri aktif eder
 * 
 * @Scheduled annotationları ile tanımlanan metodlar çalışır:
 *            - Döviz kurları her 5 dakikada güncelle
 *            - Hisse verileri her 10 dakikada güncelle
 *            - Tahvil verileri her 1 saatte güncelle
 *            - Haber feed'leri her 30 dakikada tarama
 * 
 *            application.yml'deki cron ifadeleri ile kontrol edilir
 */
@Configuration
@EnableScheduling
public class SchedulerConfig {
    // Spring'e şunu söyle: @Scheduled annotationları olan metodları çalıştır
    // Örn: @Scheduled(cron = "0 */5 * * * *") → Her 5 dakikada bir
}