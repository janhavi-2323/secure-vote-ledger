package com.example.securevoteledger.controller;

import com.example.securevoteledger.entity.VoteRecord;
import com.example.securevoteledger.repository.VoteRepository;
import com.example.securevoteledger.service.UserService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class VoteController {

    private final UserService userService;
    private final VoteRepository voteRepository;

    public VoteController(UserService userService, VoteRepository voteRepository) {
        this.userService = userService;
        this.voteRepository = voteRepository;
    }

    @Transactional
    @PostMapping("/vote")
    public ResponseEntity<?> castVote(@RequestBody Map<String, String> body) {

        String username = body.get("username");
        String constituency = body.get("constituency");
        String candidate = body.get("candidate");

        if (username == null || constituency == null || candidate == null) {
            return ResponseEntity.badRequest().body("Invalid vote data");
        }

        // 🔐 CHECK IF USER HAS ALREADY VOTED
        if (userService.hasUserVoted(username)) {
            return ResponseEntity.status(403).body("User has already voted");
        }

        // ✅ CREATE VOTE RECORD
        VoteRecord voteRecord = new VoteRecord(
                username,
                constituency,
                candidate,
                "hash_" + System.currentTimeMillis()
        );

        // ✅ SAVE VOTE TO DATABASE
        voteRepository.save(voteRecord);

        // ✅ MARK USER AS VOTED
        userService.markUserAsVoted(username);

        return ResponseEntity.ok("Vote cast successfully");
    }
}
