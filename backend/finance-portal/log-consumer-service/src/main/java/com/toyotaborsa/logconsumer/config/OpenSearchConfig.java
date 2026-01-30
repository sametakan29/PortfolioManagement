package com.toyotaborsa.logconsumer.config;

import org.apache.http.HttpHost;
import org.opensearch.client.RestClient;
import org.opensearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

//openSearche bağlanmak için gereken client nesnesini springe vermeye yarar burası
@Configuration
public class OpenSearchConfig {

    @Value("${opensearch.host:opensearch}") // Docker Compose’ta servis adı opensearch
    // ise otomatik çalışır yoksa default değerler kullanılıyor
    private String host;

    @Value("${opensearch.port:9200}")
    private int port;

    @Bean // tek bağlantı nesnesi oluştur tüm uygulama erişebilir buna!
    public RestHighLevelClient openSearchClient() {
        return new RestHighLevelClient(
                RestClient.builder(new HttpHost(host, port, "http")));
    }
}
