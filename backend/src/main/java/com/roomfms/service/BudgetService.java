package com.roomfms.service;

import com.roomfms.entity.*;
import com.roomfms.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetService {

    @Autowired
    BudgetRepository budgetRepository;

    @Autowired
    BudgetEntryRepository entryRepository;

    @Autowired
    RoomConfigRepository configRepository;

    @Transactional
    public BudgetEntry addEntry(BudgetEntry entry) {
        BudgetEntry saved = entryRepository.save(entry);
        updateBudget(entry.getDate().getMonthValue(), entry.getDate().getYear(), entry.getAmount());
        return saved;
    }

    private void updateBudget(int month, int year, double amount) {
        Budget budget = budgetRepository.findByMonthAndYear(month, year)
                .orElseGet(() -> Budget.builder()
                        .month(month)
                        .year(year)
                        .totalBalance(0.0)
                        .carryForward(0.0)
                        .build());
        budget.setTotalBalance(budget.getTotalBalance() + amount);
        budgetRepository.save(budget);
    }

    @Transactional
    public Budget transferAmount(int fromMonth, int fromYear, int toMonth, int toYear) {
        Budget fromBudget = budgetRepository.findByMonthAndYear(fromMonth, fromYear).orElseThrow();
        double remaining = fromBudget.getTotalBalance();
        
        Budget toBudget = budgetRepository.findByMonthAndYear(toMonth, toYear)
                .orElseGet(() -> Budget.builder()
                        .month(toMonth)
                        .year(toYear)
                        .totalBalance(0.0)
                        .carryForward(0.0)
                        .build());
        
        toBudget.setCarryForward(toBudget.getCarryForward() + remaining);
        toBudget.setTotalBalance(toBudget.getTotalBalance() + remaining);
        budgetRepository.save(toBudget);

        fromBudget.setTotalBalance(0.0); // Reset after transfer
        budgetRepository.save(fromBudget);
        
        return toBudget;
    }

    public RoomConfig getRoomConfig() {
        return configRepository.findAll().stream().findFirst()
                .orElse(RoomConfig.builder().monthlyAmount(5000.0).build());
    }

    public RoomConfig updateMonthlyAmount(Double amount) {
        RoomConfig config = configRepository.findAll().stream().findFirst()
                .orElse(RoomConfig.builder().build());
        config.setMonthlyAmount(amount);
        return configRepository.save(config);
    }

    public List<BudgetEntry> getBudgetHistory() {
        return entryRepository.findAllByOrderByDateDesc();
    }
}
