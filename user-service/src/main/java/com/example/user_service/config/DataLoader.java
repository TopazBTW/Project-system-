package com.example.user_service.config;

import com.example.user_service.domain.Role;
import com.example.user_service.domain.User;
import com.example.user_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;

@Configuration
@RequiredArgsConstructor
public class DataLoader {

    @Bean
    CommandLineRunner initAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if admin already exists
            if (userRepository.findByEmail("admin@gmail.com").isPresent()) {
                return;
            }

            // Create default admin account
            User admin = User.builder()
                    .fullName("Administrator")
                    .email("admin@gmail.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .roles(Collections.singleton(Role.ADMIN))
                    .build();

            userRepository.save(admin);

            System.out.println("✅ Default admin account created!");
            System.out.println("   Email: admin@gmail.com");
            System.out.println("   Password: admin123");
            System.out.println("   ⚠️  Please change the password after first login!");
        };
    }
}
