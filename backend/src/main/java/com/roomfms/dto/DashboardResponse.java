package com.roomfms.dto;

import lombok.*;
import com.roomfms.entity.Budget;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class DashboardResponse {
    private Double roomBalance;
    private Double ownAmountPaid;
    private Double monthlyAmount;
    private Double nextMonthPay;
    private List<Budget> remainingBudgets;
}
