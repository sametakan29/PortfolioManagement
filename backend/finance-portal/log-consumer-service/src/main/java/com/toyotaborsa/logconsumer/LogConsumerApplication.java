package com.toyotaborsa.logconsumer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

//Spring Boot uygulamasının giriş noktasıdır; SpringApplication.run ile tüm konteyneri ve servisleri başlatır.
@SpringBootApplication
public class LogConsumerApplication {
    // Bu paketten aşağıya doğru her şeyi Spring uygulaması olarak kabul et.
    public static void main(String[] args) {
        // Bütün uygulama burada sırayla ayağa kalkar.
        SpringApplication.run(LogConsumerApplication.class, args);
    }
}
