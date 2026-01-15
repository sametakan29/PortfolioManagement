package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.service.FundDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/funds")
@RequiredArgsConstructor
public class FundDataController {

    private final FundDataService fundDataService;

    @GetMapping
    public ResponseEntity<List<FundDataService.FundData>> getFunds() {
        return ResponseEntity.ok(fundDataService.getFunds());
    }
}
