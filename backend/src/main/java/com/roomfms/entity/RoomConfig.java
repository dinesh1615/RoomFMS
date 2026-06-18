package com.roomfms.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "room_config")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Double monthlyAmount;
}
