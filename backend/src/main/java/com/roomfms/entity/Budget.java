package com.roomfms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "budget")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Budget {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer month;

    @Column(nullable = false)
    private Integer year;

    @Column(nullable = false)
    private Double totalBalance;

    @Column(nullable = false)
    private Double carryForward;
}
