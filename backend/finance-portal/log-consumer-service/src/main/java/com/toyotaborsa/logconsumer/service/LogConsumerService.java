package com.toyotaborsa.logconsumer.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.opensearch.action.index.IndexRequest;
import org.opensearch.action.index.IndexResponse;
import org.opensearch.client.RequestOptions;
import org.opensearch.client.RestHighLevelClient;
import org.opensearch.common.xcontent.XContentType;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class LogConsumerService {

    private final RestHighLevelClient openSearchClient;
    private static final String INDEX_PREFIX = "app-logs-";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy.MM.dd");

    @KafkaListener(topics = "${kafka.topics.app-logs:app-logs}", groupId = "log-consumer-group")
    public void consumeLog(String logMessage) {
        try {
            String indexName = INDEX_PREFIX + LocalDate.now().format(DATE_FORMATTER);

            IndexRequest request = new IndexRequest(indexName)
                    .source(logMessage, XContentType.JSON);

            IndexResponse response = openSearchClient.index(request, RequestOptions.DEFAULT);

            log.debug("Indexed log to OpenSearch: {} - {}", indexName, response.getId());
        } catch (Exception e) {
            log.error("Failed to index log to OpenSearch", e);
        }
    }
}
