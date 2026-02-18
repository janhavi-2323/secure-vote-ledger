package com.example.securevoteledger.service;

import com.example.securevoteledger.entity.User;
import com.example.securevoteledger.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;


@Service
public class UserService {

    private final UserRepository userRepository;

   private final BCryptPasswordEncoder passwordEncoder;

     public UserService(UserRepository userRepository,
                   BCryptPasswordEncoder passwordEncoder) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    }

    public User register(String username, String password, String role) {

        Optional<User> existingUser = userRepository.findByUsername(username);
        if (existingUser.isPresent()) {
            throw new RuntimeException("User already exists");
        }
      
        String encodedPassword = passwordEncoder.encode(password);
        User user = new User(username, encodedPassword, role);

        return userRepository.save(user);
    }

    public User login(String username, String password) {

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return null;
        }
        User user = userOpt.get();
       if (!passwordEncoder.matches(password, user.getPassword())) {
        return null;
        }

        return user;
    }

    public boolean hasUserVoted(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return false;
        }
        return userOpt.get().isHasVoted();
    }

    public void markUserAsVoted(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setHasVoted(true);
            userRepository.save(user);
        }
    }
    public long getTotalUsers() {
    return userRepository.count();
}

}