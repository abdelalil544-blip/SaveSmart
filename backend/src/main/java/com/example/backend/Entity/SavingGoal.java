package com.example.backend.Entity;

import com.example.backend.Entity.enums.GoalStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.GenericGenerator;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "saving_goals")
@Getter
@Setter
public class SavingGoal {

    @Id
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(
            name = "uuid",
            strategy = "org.hibernate.id.UUIDGenerator"
    )
    @Column(length = 36, updatable = false)
    private String id;

    private String name;

    private BigDecimal targetAmount;

    private BigDecimal currentAmount = BigDecimal.ZERO;

    private LocalDate deadline;

    private String description;

    @Enumerated(EnumType.STRING)
    private GoalStatus status = GoalStatus.ACTIVE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
