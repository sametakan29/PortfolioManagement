package com.toyotaborsa.finance.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Scheduler configuration
 * Zamanlanmış görevleri aktif eder (periyodik veri çekme için)
 */
@Configuration
@EnableScheduling
public class SchedulerConfig {
    // Scheduler aktif - @Scheduled annotationları çalışacak
}
