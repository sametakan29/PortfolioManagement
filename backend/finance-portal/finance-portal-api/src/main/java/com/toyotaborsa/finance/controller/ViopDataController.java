package com.toyotaborsa.finance.controller;

import com.toyotaborsa.finance.service.ViopDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/viop")
@RequiredArgsConstructor
public class ViopDataController {

    private final ViopDataService viopDataService;

    @GetMapping
    public ResponseEntity<List<ViopDataService.ViopData>> getViopInstruments() {
        return ResponseEntity.ok(viopDataService.getViopInstruments());
    }
}
