package com.mercure.utils;

import com.mercure.entity.UserEntity;
import com.mercure.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.util.ArrayUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Class used to fill the database on startup
 * Uncomment @Service annotation to enable CommandLineRunner
 */
//@Service
public class DbInit implements CommandLineRunner {

    static Logger log = LoggerFactory.getLogger(DbInit.class);

    private UserService userService;

    private PasswordEncoder passwordEncoder;

    public DbInit(UserService userService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        List<String> sourceList = Arrays.asList("Thibaut", "Gatien", "John", "Luc", "Antoine");
        sourceList.forEach(val -> {
            UserEntity user = new UserEntity();
            user.setFirstName(val);
            user.setLastName("Doe" + val);
            user.setPassword(passwordEncoder.encode("root"));
            user.setMail(val + ".fastlitemessage@software.com");
            user.setEnabled(true);
            user.setCredentialsNonExpired(true);
            user.setAccountNonLocked(true);
            user.setAccountNonExpired(true);
            user.setWsToken(UUID.randomUUID().toString());
            user.setRole(1);
            userService.save(user);
            log.info("UserEntity has been created");
        });
    }
}
