package com.toyotaborsa.finance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // Zamanlanmış görevleri aktifleştirir
public class FinancePortalApplication {

    public static void main(String[] args) {
        SpringApplication.run(FinancePortalApplication.class, args);
    }
}
