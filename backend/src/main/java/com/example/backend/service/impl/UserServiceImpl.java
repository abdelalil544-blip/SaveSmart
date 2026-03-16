package com.example.backend.service.impl;

import com.example.backend.Entity.User;
import com.example.backend.dto.user.UserCreateDTO;
import com.example.backend.dto.user.UserResponseDTO;
import com.example.backend.dto.user.UserUpdateDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.UserMapper;
import com.example.backend.repository.BudgetRepository;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.IncomeRepository;
import com.example.backend.repository.SavingGoalRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.UserService;
import com.example.backend.dto.user.UserStatsDTO;
import com.example.backend.Entity.enums.GoalStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final IncomeRepository incomeRepository;
    private final ExpenseRepository expenseRepository;
    private final BudgetRepository budgetRepository;
    private final SavingGoalRepository savingGoalRepository;

    public UserServiceImpl(
            UserRepository userRepository,
            UserMapper userMapper,
            PasswordEncoder passwordEncoder,
            IncomeRepository incomeRepository,
            ExpenseRepository expenseRepository,
            BudgetRepository budgetRepository,
            SavingGoalRepository savingGoalRepository
    ) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.incomeRepository = incomeRepository;
        this.expenseRepository = expenseRepository;
        this.budgetRepository = budgetRepository;
        this.savingGoalRepository = savingGoalRepository;
    }

    @Override
    public UserResponseDTO save(UserCreateDTO dto) {
        User user = userMapper.toEntity(dto);
        User saved = userRepository.save(user);
        return userMapper.toResponseDTO(saved);
    }

    @Override
    public UserResponseDTO update(String id, UserUpdateDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        if (dto.getFirstName() != null) {
            user.setFirstName(dto.getFirstName());
        }
        if (dto.getLastName() != null) {
            user.setLastName(dto.getLastName());
        }
        if (dto.getEmail() != null) {
            user.setEmail(dto.getEmail());
        }
        if (dto.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        }
        if (dto.getPhoneNumber() != null) {
            user.setPhoneNumber(dto.getPhoneNumber());
        }
        if (dto.getActive() != null) {
            user.setActive(dto.getActive());
        }
        if (dto.getRole() != null) {
            user.setRole(dto.getRole());
        }
        User saved = userRepository.save(user);
        return userMapper.toResponseDTO(saved);
    }

    @Override
    public Optional<UserResponseDTO> findById(String id) {
        return userRepository.findById(id).map(userMapper::toResponseDTO);
    }

    @Override
    public List<UserResponseDTO> findAll() {
        return userRepository.findAll().stream()
                .map(userMapper::toResponseDTO)
                .toList();
    }

    @Override
    public void deleteById(String id) {
        userRepository.deleteById(id);
    }

    @Override
    public Optional<UserResponseDTO> findByEmail(String email) {
        return userRepository.findByEmail(email).map(userMapper::toResponseDTO);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public UserResponseDTO resetPassword(String id, String rawPassword) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setPassword(passwordEncoder.encode(rawPassword));
        User saved = userRepository.save(user);
        return userMapper.toResponseDTO(saved);
    }

    @Override
    public UserStatsDTO getUserStats(String id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found: " + id);
        }

        UserStatsDTO stats = new UserStatsDTO();
        stats.setTotalIncome(incomeRepository.sumByUserId(id));
        stats.setTotalExpense(expenseRepository.sumByUserId(id));
        stats.setBudgetTotal(budgetRepository.sumByUserId(id));
        stats.setBudgetCount(budgetRepository.countByUserId(id));
        stats.setGoalCount(savingGoalRepository.countByUserId(id));
        stats.setActiveGoals(savingGoalRepository.countByUserIdAndStatus(id, GoalStatus.ACTIVE));
        stats.setCompletedGoals(savingGoalRepository.countByUserIdAndStatus(id, GoalStatus.COMPLETED));
        stats.setCancelledGoals(savingGoalRepository.countByUserIdAndStatus(id, GoalStatus.CANCELLED));
        return stats;
    }
}
