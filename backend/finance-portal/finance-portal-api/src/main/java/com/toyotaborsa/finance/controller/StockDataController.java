package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.service.StockDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stocks")
@RequiredArgsConstructor
public class StockDataController {

    private final StockDataService stockDataService;

    @GetMapping
    public ResponseEntity<Map<String, StockDataService.StockData>> getStocks(
            @RequestParam(required = false) String[] symbols) {
        List<String> symbolList = symbols != null ? Arrays.asList(symbols) : null;
        return ResponseEntity.ok(stockDataService.getStocks(symbolList));
    }

    @GetMapping("/{symbol}")
    public ResponseEntity<StockDataService.StockData> getStock(@PathVariable String symbol) {
        Map<String, StockDataService.StockData> stocks = stockDataService.getStocks(Arrays.asList(symbol));
        StockDataService.StockData stock = stocks.get(symbol);

        if (stock == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(stock);
    }
}
