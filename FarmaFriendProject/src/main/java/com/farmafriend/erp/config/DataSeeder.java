package com.farmafriend.erp.config;

import com.farmafriend.erp.constants.RoleName;
import com.farmafriend.erp.entity.User;
import com.farmafriend.erp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
    }

    private void seedAdmin() {
        if (!userRepository.existsByEmail("admin@farmafriend.com")) {
            User admin = User.builder()
                    .name("System Administrator")
                    .email("admin@farmafriend.com")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(RoleName.ADMIN)
                    .enabled(true)
                    .build();
            userRepository.save(admin);
            log.info("Seeded default admin account: admin@farmafriend.com / Admin@123");
        }
    }
}
