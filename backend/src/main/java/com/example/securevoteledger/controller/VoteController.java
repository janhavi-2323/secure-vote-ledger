package com.example.securevoteledger.controller;

import com.example.securevoteledger.entity.VoteRecord;
import com.example.securevoteledger.repository.VoteRepository;
import com.example.securevoteledger.service.EthereumService;
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
     private final EthereumService ethereumService;
    public VoteController(UserService userService, VoteRepository voteRepository,EthereumService ethereumService) {
        this.userService = userService;
        this.voteRepository = voteRepository;
        this.ethereumService=ethereumService;
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

    if (voteRepository.existsByUsername(username)) {
        return ResponseEntity.status(403).body("User has already voted");
    }

    // Get last vote
        VoteRecord lastVote = voteRepository.findAll().stream()
                .reduce((first, second) -> second)
                .orElse(null);

        String previousHash = (lastVote == null) ? "0" : lastVote.getVoteHash();

// Generate current hash
        String data = username + constituency + candidate + previousHash;
        String currentHash = HashUtil.generateHash(data);

// Create new block
        VoteRecord voteRecord = new VoteRecord(
                username,
                constituency,
                candidate,
                previousHash,
                currentHash
                );

// Save once
        voteRepository.save(voteRecord);
        ethereumService.storeVoteHash(currentHash);

    // ✅ Mark user voted
    userService.markUserAsVoted(username);

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
@GetMapping("/admin/validate-chain")
public ResponseEntity<?> validateChain(@RequestParam String role) {

    if (!"ADMIN".equals(role)) {
        return ResponseEntity.status(403)
                .body("Access denied. Admin only.");
    }

    List<VoteRecord> votes = voteRepository.findAll();

   String previousHash = "0";

        for (VoteRecord vote : votes) {

                if (!vote.getPreviousHash().equals(previousHash)) {
                return ResponseEntity.ok("❌ Blockchain broken (previous hash mismatch)");
    }

    String recalculatedHash = HashUtil.generateHash(
            vote.getUsername()
            + vote.getConstituency()
            + vote.getCandidate()
            + vote.getPreviousHash()
    );

    if (!vote.getVoteHash().equals(recalculatedHash)) {
        return ResponseEntity.ok("❌ Blockchain tampered (hash mismatch)");
    }

    previousHash = vote.getVoteHash();
}


    return ResponseEntity.ok("✅ Blockchain is valid and untampered.");
}



}
