package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.service.ForexDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/forex")
@RequiredArgsConstructor
public class ForexDataController {

    private final ForexDataService forexDataService;

    @GetMapping("/rates")
    public ResponseEntity<Map<String, ForexDataService.ForexRate>> getForexRates() {
        return ResponseEntity.ok(forexDataService.getForexRates());
    }
}
