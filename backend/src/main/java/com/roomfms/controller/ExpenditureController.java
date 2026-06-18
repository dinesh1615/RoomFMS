package com.roomfms.controller;

import com.roomfms.entity.Expenditure;
import com.roomfms.service.ExpenditureService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/expenditures")
public class ExpenditureController {

    @Autowired
    ExpenditureService expenditureService;

    @PostMapping
    public ResponseEntity<?> addExpenditure(@RequestBody Expenditure expenditure) {
        try {
            return ResponseEntity.ok(expenditureService.addExpenditure(expenditure));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(expenditureService.getHistory(startDate, endDate));
    }
}
