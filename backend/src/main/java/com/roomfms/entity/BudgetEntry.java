package com.roomfms.entity;

import com.roomfms.enums.EntryType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "budget_entries")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private LocalDate date;

    @Enumerated(EnumType.STRING)
    private EntryType entryType;

    private String description;
}
