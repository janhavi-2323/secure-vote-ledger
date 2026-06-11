package com.example.securevoteledger.controller;

import com.example.securevoteledger.entity.User;
import com.example.securevoteledger.entity.Candidate;
import com.example.securevoteledger.entity.ElectionStatus;
import com.example.securevoteledger.entity.VoteRecord;
import com.example.securevoteledger.repository.VoteRepository;
import com.example.securevoteledger.service.EthereumService;
import com.example.securevoteledger.service.UserService;
import com.example.securevoteledger.util.HashUtil;
import com.example.securevoteledger.repository.CandidateRepository;
import com.example.securevoteledger.repository.ElectionStatusRepository;
import com.example.securevoteledger.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class VoteController {

    @Autowired
    private ElectionStatusRepository electionStatusRepository;
    private final EthereumService ethereumService;
    private final UserService userService;
    private final VoteRepository voteRepository;
    private final CandidateRepository candidateRepository;
    private final UserRepository userRepository;

    public VoteController(UserService userService, VoteRepository voteRepository, EthereumService ethereumService, CandidateRepository candidateRepository, UserRepository userRepository, ElectionStatusRepository electionStatusRepository) {
        this.userService = userService;
        this.voteRepository = voteRepository;
        this.ethereumService=ethereumService;
        this.candidateRepository=candidateRepository;
        this.userRepository=userRepository;
        this.electionStatusRepository=electionStatusRepository;
    }

    @Transactional
    @PostMapping("/vote")
    public ResponseEntity<?> castVote(@RequestBody Map<String, String> body) {

        boolean isOpen = electionStatusRepository
                .findAll()
                .stream()
                .findFirst()
                .map(ElectionStatus::isOpen)
                .orElse(true);

        if(!isOpen){
        return ResponseEntity.status(403)
                .body("Election is closed");
        }
        String username = body.get("username");
        String constituency = body.get("constituency");
        String candidate = body.get("candidate");

        User user = userRepository
                .findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getConstituency().equals(constituency)) {
                return ResponseEntity.status(403)
                        .body("You cannot vote outside your constituency");
        }
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
        VoteRecord voteRecord = new VoteRecord( username, constituency, candidate, previousHash, currentHash );

        // Save once
        voteRepository.save(voteRecord);
        System.out.println("Calling ethereum service...");
        ethereumService.storeVoteHash(currentHash);

        // ✅ Mark user voted
        userService.markUserAsVoted(username);

        return ResponseEntity.ok("Vote cast successfully");
        }


    @GetMapping("/results")
        public ResponseEntity<?> getResultsByConstituency(
                @RequestParam String constituency,
                @RequestParam String role) {

        if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(403).body("Admins only");
        }

        List<Candidate> candidates =
                candidateRepository.findByConstituency(constituency);

        List<VoteRecord> votes =
                voteRepository.findByConstituency(constituency);

        Map<String, Long> voteCounts = votes.stream()
                .collect(Collectors.groupingBy(
                        VoteRecord::getCandidate,
                        Collectors.counting()
                ));

        List<Map<String, Object>> response = new ArrayList<>();

        for (Candidate candidate : candidates) {

                long count = voteCounts.getOrDefault(candidate.getName(), 0L);

                Map<String, Object> result = new HashMap<>();
                result.put("name", candidate.getName());
                result.put("votes", count);
                result.put("party", candidate.getParty());   // ⭐ IMPORTANT

                response.add(result);
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

        List<VoteRecord> allVotes = voteRepository.findAll();

        Map<String, Long> votesByConstituency =
                allVotes.stream().collect(Collectors.groupingBy(
                        VoteRecord::getConstituency,
                        Collectors.counting()
                ));

        Map<String, Long> voteCounts =
        allVotes.stream().collect(Collectors.groupingBy(
                VoteRecord::getCandidate,
                Collectors.counting()
        ));

        List<Map<String, Object>> candidateVotes = new ArrayList<>();
        
        List<Candidate> candidates = candidateRepository.findAll();

        for (Candidate candidate : candidates) {

                long votes = voteCounts.getOrDefault(candidate.getName(), 0L);

                Map<String, Object> c = new HashMap<>();
                c.put("name", candidate.getName());
                c.put("votes", votes);
                c.put("party", candidate.getParty());

                candidateVotes.add(c);
        }
        Map<String, Long> partyVotes = new HashMap<>();

        for (Candidate candidate : candidates) {

                long votes = voteCounts.getOrDefault(candidate.getName(), 0L);

                partyVotes.put(
                        candidate.getParty(),
                        partyVotes.getOrDefault(candidate.getParty(), 0L) + votes
                );
        }
        String leadingCandidate = voteCounts.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("No votes yet");

        Map<String, Object> response = new HashMap<>();
        response.put("totalVotes", totalVotes);
        response.put("totalUsers", totalUsers);
        response.put("votesByConstituency", votesByConstituency);
        response.put("candidateVotes", candidateVotes);
        response.put("partyVotes", partyVotes);
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
        @GetMapping("/admin/turnout")
        public ResponseEntity<?> getTurnout(@RequestParam String role) {

        if (!"ADMIN".equals(role)) {
                return ResponseEntity.status(403).body("Admins only");
        }

        long totalUsers = userRepository.count();
        long votesCast = voteRepository.count();

        double turnout = 0;

        if (totalUsers > 0) {
                turnout = ((double) votesCast / totalUsers) * 100;
        }

        Map<String, Object> response = new HashMap<>();

        response.put("turnout", turnout);

        return ResponseEntity.ok(response);
        }

        @GetMapping("/election-status")
        public boolean getElectionStatus(){

        return electionStatusRepository.findAll()
                .stream()
                .findFirst()
                .map(ElectionStatus::isOpen)
                .orElse(true);
        }

        @PostMapping("/admin/open-election")
        public String openElection(){

        ElectionStatus status =
                electionStatusRepository.findAll().stream().findFirst().orElse(new ElectionStatus());

        status.setOpen(true);

        electionStatusRepository.save(status);

        return "Election opened";
        }

        @PostMapping("/admin/close-election")
        public String closeElection(){

        ElectionStatus status =
                electionStatusRepository.findAll().stream().findFirst().orElse(new ElectionStatus());

        status.setOpen(false);

        electionStatusRepository.save(status);

        return "Election closed";
        }

        @GetMapping("/blockchain")
        public ResponseEntity<?> getBlockchain() {

        List<VoteRecord> votes = voteRepository.findAll();

        List<Map<String, Object>> blocks = new ArrayList<>();

        for (VoteRecord vote : votes) {

                Map<String, Object> block = new HashMap<>();

                block.put("username", vote.getUsername());
                block.put("candidate", vote.getCandidate());
                block.put("constituency", vote.getConstituency());
                block.put("previousHash", vote.getPreviousHash());
                block.put("hash", vote.getVoteHash());
                block.put("timestamp", vote.getTimestamp());

                blocks.add(block);
        }

        return ResponseEntity.ok(blocks);
        }
}