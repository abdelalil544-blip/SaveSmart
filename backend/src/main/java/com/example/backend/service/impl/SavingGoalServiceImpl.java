package com.example.backend.service.impl;

import com.example.backend.Entity.enums.GoalStatus;
import com.example.backend.Entity.SavingGoal;
import com.example.backend.Entity.User;
import com.example.backend.dto.savinggoal.GoalProgressResponseDTO;
import com.example.backend.dto.savinggoal.SavingGoalCreateDTO;
import com.example.backend.dto.savinggoal.SavingGoalResponseDTO;
import com.example.backend.dto.savinggoal.SavingGoalUpdateDTO;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.mapper.SavingGoalMapper;
import com.example.backend.repository.SavingGoalRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.SavingGoalService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

@Service
public class SavingGoalServiceImpl implements SavingGoalService {

    private final SavingGoalRepository savingGoalRepository;
    private final UserRepository userRepository;
    private final SavingGoalMapper savingGoalMapper;

    public SavingGoalServiceImpl(
            SavingGoalRepository savingGoalRepository,
            UserRepository userRepository,
            SavingGoalMapper savingGoalMapper
    ) {
        this.savingGoalRepository = savingGoalRepository;
        this.userRepository = userRepository;
        this.savingGoalMapper = savingGoalMapper;
    }

    @Override
    public SavingGoalResponseDTO save(String userId, SavingGoalCreateDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        SavingGoal savingGoal = savingGoalMapper.toEntity(dto);
        if (savingGoal.getCurrentAmount() == null) {
            savingGoal.setCurrentAmount(BigDecimal.ZERO);
        }
        if (savingGoal.getStatus() == null) {
            savingGoal.setStatus(GoalStatus.ACTIVE);
        }
        savingGoal.setUser(user);
        SavingGoal saved = savingGoalRepository.save(savingGoal);
        return savingGoalMapper.toResponseDTO(saved);
    }

    @Override
    public SavingGoalResponseDTO update(String id, SavingGoalUpdateDTO dto) {
        SavingGoal savingGoal = savingGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Saving goal not found: " + id));
        if (dto.getName() != null) {
            savingGoal.setName(dto.getName());
        }
        if (dto.getTargetAmount() != null) {
            savingGoal.setTargetAmount(dto.getTargetAmount());
        }
        if (dto.getCurrentAmount() != null) {
            savingGoal.setCurrentAmount(dto.getCurrentAmount());
        }
        if (dto.getDeadline() != null) {
            savingGoal.setDeadline(dto.getDeadline());
        }
        if (dto.getDescription() != null) {
            savingGoal.setDescription(dto.getDescription());
        }
        if (dto.getStatus() != null) {
            savingGoal.setStatus(dto.getStatus());
        }
        SavingGoal saved = savingGoalRepository.save(savingGoal);
        return savingGoalMapper.toResponseDTO(saved);
    }

    @Override
    public Optional<SavingGoalResponseDTO> findById(String id) {
        return savingGoalRepository.findById(id).map(savingGoalMapper::toResponseDTO);
    }

    @Override
    public List<SavingGoalResponseDTO> findAll() {
        return savingGoalRepository.findAll().stream()
                .map(savingGoalMapper::toResponseDTO)
                .toList();
    }

    @Override
    public void deleteById(String id) {
        savingGoalRepository.deleteById(id);
    }

    @Override
    public List<SavingGoalResponseDTO> findByUserId(String userId) {
        return savingGoalRepository.findByUserId(userId).stream()
                .map(savingGoalMapper::toResponseDTO)
                .toList();
    }

    @Override
    public List<SavingGoalResponseDTO> findByUserIdAndStatus(String userId, GoalStatus status) {
        return savingGoalRepository.findByUserIdAndStatus(userId, status).stream()
                .map(savingGoalMapper::toResponseDTO)
                .toList();
    }

    @Override
    public GoalProgressResponseDTO getGoalProgress(String id) {
        SavingGoal goal = savingGoalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Saving goal not found: " + id));
        GoalProgressResponseDTO response = new GoalProgressResponseDTO();
        response.setTotal(goal.getCurrentAmount());
        response.setStatus(goal.getStatus());

        if (goal.getTargetAmount() == null || goal.getTargetAmount().signum() == 0) {
            response.setPercent(BigDecimal.ZERO);
            response.setRemaining(BigDecimal.ZERO);
            return response;
        }

        BigDecimal percent = goal.getCurrentAmount()
                .multiply(BigDecimal.valueOf(100))
                .divide(goal.getTargetAmount(), 2, RoundingMode.HALF_UP);
        BigDecimal remaining = goal.getTargetAmount().subtract(goal.getCurrentAmount());
        if (remaining.signum() < 0) {
            remaining = BigDecimal.ZERO;
        }

        response.setPercent(percent);
        response.setRemaining(remaining);
        return response;
    }
}
