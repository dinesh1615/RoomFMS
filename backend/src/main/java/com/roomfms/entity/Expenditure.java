package com.roomfms.entity;

import com.roomfms.enums.PaymentSource;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "expenditures")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Expenditure {
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

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentSource paymentSource;
}
