package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.service.BondDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bonds")
@RequiredArgsConstructor
public class BondDataController {

    private final BondDataService bondDataService;

    @GetMapping
    public ResponseEntity<List<BondDataService.BondData>> getBonds() {
        return ResponseEntity.ok(bondDataService.getBonds());
    }
}
