package com.roomfms.service;

import com.roomfms.dto.DashboardResponse;
import com.roomfms.entity.*;
import com.roomfms.enums.PaymentSource;
import com.roomfms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    BudgetRepository budgetRepository;

    @Autowired
    ExpenditureRepository expenditureRepository;

    @Autowired
    RoomConfigRepository configRepository;

    public DashboardResponse getStats(Long userId) {
        LocalDate now = LocalDate.now();
        Budget budget = budgetRepository.findByMonthAndYear(now.getMonthValue(), now.getYear())
                .orElse(Budget.builder().totalBalance(0.0).build());

        Double ownPaid = expenditureRepository.sumAmountByUserAndSourceAfterDate(
                userId, PaymentSource.OWN, now.withDayOfMonth(1));
        if (ownPaid == null) ownPaid = 0.0;

        RoomConfig config = configRepository.findAll().stream().findFirst()
                .orElse(RoomConfig.builder().monthlyAmount(5000.0).build());

        List<Budget> remaining = budgetRepository.findAll().stream()
                .filter(b -> b.getTotalBalance() != 0.0 && !(b.getMonth() == now.getMonthValue() && b.getYear() == now.getYear()))
                .collect(Collectors.toList());

        return DashboardResponse.builder()
                .roomBalance(budget.getTotalBalance())
                .ownAmountPaid(ownPaid)
                .monthlyAmount(config.getMonthlyAmount())
                .nextMonthPay(config.getMonthlyAmount() - ownPaid)
                .remainingBudgets(remaining)
                .build();
    }
}
