package com.roomfms.repository;

import com.roomfms.entity.BudgetEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BudgetEntryRepository extends JpaRepository<BudgetEntry, Long> {
    List<BudgetEntry> findByUserId(Long userId);
    List<BudgetEntry> findAllByOrderByDateDesc();
}
