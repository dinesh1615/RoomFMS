package com.roomfms.controller;

import com.roomfms.dto.DashboardResponse;
import com.roomfms.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    DashboardService dashboardService;

    @GetMapping("/{userId}")
    public ResponseEntity<DashboardResponse> getStats(@PathVariable Long userId) {
        return ResponseEntity.ok(dashboardService.getStats(userId));
    }
}
