package com.roomfms.service;

import com.roomfms.entity.*;
import com.roomfms.enums.PaymentSource;
import com.roomfms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExpenditureService {

    @Autowired
    ExpenditureRepository expenditureRepository;

    @Autowired
    BudgetRepository budgetRepository;

    @Transactional
    public Expenditure addExpenditure(Expenditure expenditure) {
        if (expenditure.getPaymentSource() == PaymentSource.BUDGET) {
            Budget budget = budgetRepository.findByMonthAndYear(
                    expenditure.getDate().getMonthValue(), 
                    expenditure.getDate().getYear())
                .orElseThrow(() -> new RuntimeException("Budget not found for this month"));
            
            if (budget.getTotalBalance() < expenditure.getAmount()) {
                throw new RuntimeException("Insufficient budget balance");
            }
            budget.setTotalBalance(budget.getTotalBalance() - expenditure.getAmount());
            budgetRepository.save(budget);
        }
        return expenditureRepository.save(expenditure);
    }

    public List<Expenditure> getHistory(LocalDate startDate, LocalDate endDate) {
        if (startDate == null) startDate = LocalDate.now().withDayOfMonth(1);
        if (endDate == null) endDate = LocalDate.now();
        return expenditureRepository.findByDateRange(startDate, endDate);
    }
}
