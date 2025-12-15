package com.example.user_service.service;

import com.example.user_service.domain.User;
import com.example.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User createUser(com.example.user_service.dto.RegisterRequest request) {
        User user = User.builder()
                .fullName(request.getName())
                .email(request.getEmail())
                .passwordHash(new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder()
                        .encode(request.getPassword()))
                .roles(java.util.Collections.singleton(com.example.user_service.domain.Role.USER))
                .build();
        return userRepository.save(user);
    }

    public User updateUserRole(Long id, String roleName) {
        User user = getUserById(id);
        try {
            com.example.user_service.domain.Role role = com.example.user_service.domain.Role
                    .valueOf(roleName.toUpperCase());
            user.setRoles(java.util.Collections.singleton(role));
            return userRepository.save(user);
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role: " + roleName);
        }
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }
}
