package com.roomfms.controller;

import com.roomfms.entity.*;
import com.roomfms.service.BudgetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
public class BudgetController {

    @Autowired
    BudgetService budgetService;

    @PostMapping("/entry")
    @PreAuthorize("hasRole('FIN_MGR')")
    public ResponseEntity<?> addEntry(@RequestBody BudgetEntry entry) {
        return ResponseEntity.ok(budgetService.addEntry(entry));
    }

    @PostMapping("/transfer")
    @PreAuthorize("hasRole('FIN_MGR')")
    public ResponseEntity<?> transfer(@RequestParam int fromMonth, @RequestParam int fromYear, 
                                    @RequestParam int toMonth, @RequestParam int toYear) {
        return ResponseEntity.ok(budgetService.transferAmount(fromMonth, fromYear, toMonth, toYear));
    }

    @PutMapping("/config")
    @PreAuthorize("hasRole('FIN_MGR')")
    public ResponseEntity<?> updateConfig(@RequestParam Double amount) {
        return ResponseEntity.ok(budgetService.updateMonthlyAmount(amount));
    }

    @GetMapping("/history")
    public ResponseEntity<?> getBudgetHistory() {
        return ResponseEntity.ok(budgetService.getBudgetHistory());
    }
}
