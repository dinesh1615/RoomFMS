package com.roomfms.repository;

import com.roomfms.entity.Expenditure;
import com.roomfms.enums.PaymentSource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;

public interface ExpenditureRepository extends JpaRepository<Expenditure, Long> {
    
    @Query("SELECT e FROM Expenditure e WHERE e.date >= :startDate AND e.date <= :endDate ORDER BY e.date DESC")
    List<Expenditure> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT SUM(e.amount) FROM Expenditure e WHERE e.user.id = :userId AND e.paymentSource = :source AND e.date >= :startDate")
    Double sumAmountByUserAndSourceAfterDate(@Param("userId") Long userId, @Param("source") PaymentSource source, @Param("startDate") LocalDate startDate);
}
