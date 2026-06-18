package com.roomfms.config;

import com.roomfms.entity.RoomConfig;
import com.roomfms.entity.User;
import com.roomfms.enums.Role;
import com.roomfms.repository.RoomConfigRepository;
import com.roomfms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoomConfigRepository configRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.findByMobile("roomfms").isEmpty()) {
            User admin = User.builder()
                    .name("Finance Manager")
                    .mobile("roomfms")
                    .password(encoder.encode("roomfms"))
                    .role(Role.FIN_MGR)
                    .build();
            userRepository.save(admin);
        }

        if (configRepository.findAll().isEmpty()) {
            RoomConfig config = RoomConfig.builder()
                    .monthlyAmount(5000.0)
                    .build();
            configRepository.save(config);
        }
    }
}
