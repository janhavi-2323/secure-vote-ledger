package com.example.securevoteledger.controller;

import com.example.securevoteledger.entity.VoteRecord;
import com.example.securevoteledger.repository.VoteRepository;
import com.example.securevoteledger.service.UserService;
import com.example.securevoteledger.util.HashUtil;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

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
        // 🔗 Get previous hash
        String previousHash = voteRepository.findAll().stream()
        .reduce((first, second) -> second)
        .map(VoteRecord::getVoteHash)
        .orElse("0");

// 🔐 Generate new vote hash
        String data = username + constituency + candidate + previousHash;
        String voteHash = HashUtil.generateHash(data);

// 💾 Save vote record
        VoteRecord votes =new VoteRecord(username, constituency, candidate, voteHash);

        voteRepository.save(votes);

        return ResponseEntity.ok("Vote cast successfully");
    }

  @GetMapping("/results")
public ResponseEntity<?> getResultsByConstituency(
        @RequestParam String constituency,
        @RequestParam String role) {

    // 🔐 Allow only ADMIN
    if (!"ADMIN".equals(role)) {
        return ResponseEntity.status(403)
                .body("Access denied. Admins only.");
    }

    List<VoteRecord> votes =
            voteRepository.findByConstituency(constituency);

    Map<String, Long> resultMap = votes.stream()
            .collect(Collectors.groupingBy(
                    VoteRecord::getCandidate,
                    Collectors.counting()
            ));

    List<Map<String, Object>> response = new ArrayList<>();

    for (Map.Entry<String, Long> entry : resultMap.entrySet()) {
        Map<String, Object> candidateResult = new HashMap<>();
        candidateResult.put("name", entry.getKey());
        candidateResult.put("votes", entry.getValue());
        response.add(candidateResult);
    }

    return ResponseEntity.ok(response);
}


@GetMapping("/admin/stats")
public ResponseEntity<?> getAdminStats(@RequestParam String role) {

    if (!"ADMIN".equals(role)) {
        return ResponseEntity.status(403)
                .body("Access denied. Admin only.");
    }

    long totalVotes = voteRepository.count();
    long totalUsers = userService.getTotalUsers();

    // Votes per constituency
    List<VoteRecord> allVotes = voteRepository.findAll();

    Map<String, Long> votesByConstituency =
            allVotes.stream().collect(Collectors.groupingBy(
                    VoteRecord::getConstituency,
                    Collectors.counting()
            ));

    // Overall candidate aggregation
    Map<String, Long> candidateVotes =
            allVotes.stream().collect(Collectors.groupingBy(
                    VoteRecord::getCandidate,
                    Collectors.counting()
            ));

    // Find overall winner
    String leadingCandidate = candidateVotes.entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("No votes yet");

    Map<String, Object> response = new HashMap<>();
    response.put("totalVotes", totalVotes);
    response.put("totalUsers", totalUsers);
    response.put("votesByConstituency", votesByConstituency);
    response.put("candidateVotes", candidateVotes);
    response.put("leadingCandidate", leadingCandidate);

    return ResponseEntity.ok(response);
}


}
