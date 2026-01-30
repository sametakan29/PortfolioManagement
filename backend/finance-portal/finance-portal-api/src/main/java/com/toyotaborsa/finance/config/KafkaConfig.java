package com.toyotaborsa.finance.config;

import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;
import java.util.Map;

/**
 * Kafka Producer Konfigürasyonu
 * 
 * Amaç: Log4j2 Appender ve uygulamada Kafka'ya mesaj göndermek
 * Kafka Broker bağlantısı ve Serializer ayarları yapılandırılır
 */
@Configuration
public class KafkaConfig {

    // Kafka broker sunucu adresleri (örn: kafka:9092)
    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    /**
     * Producer Factory Bean - Kafka Producer'ı oluşturur
     * 
     * Önemli ayarlar:
     * - ACKS_CONFIG: 1 = broker kabul ettiğinde gönder (hız-güvenilirlik dengesi)
     * - RETRIES_CONFIG: 3 = hata durumunda 3 kez yeniden deneme
     * - LINGER_MS_CONFIG: 10ms = mesajları toplayıp beraber gönder (verimlilik)
     * - BATCH_SIZE_CONFIG: 16KB = toplu gönderim boyutu
     */
    @Bean
    public ProducerFactory<String, String> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        // Kafka broker adresleri
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        // Mesaj key'i String olarak serializ et
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        // Mesaj değeri String olarak serializ et
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        // Broker'dan onay türü: 1 = leading replica onayladı
        configProps.put(ProducerConfig.ACKS_CONFIG, "1");
        // Başarısız gönderimleri 3 kez yeniden dene
        configProps.put(ProducerConfig.RETRIES_CONFIG, 3);
        // 10ms bekleme = mesajları grupla, verimli gönder
        configProps.put(ProducerConfig.LINGER_MS_CONFIG, 10);
        // 16KB olunca gönder (batch optimizasyonu)
        configProps.put(ProducerConfig.BATCH_SIZE_CONFIG, 16384);

        return new DefaultKafkaProducerFactory<>(configProps);
    }

    /**
     * KafkaTemplate Bean - Mesaj gönderimi için kullanılan ana araç
     * 
     * Uygulama kodunda @Autowired ile enjekte edilerek Kafka'ya mesaj gönderir
     */
    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}
