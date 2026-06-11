package com.example.securevoteledger.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "votes")
public class VoteRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String username;
    private String constituency;
    private String candidate;
    private String previousHash;
    private String voteHash; // blockchain reference
    private LocalDateTime timestamp;

    public VoteRecord() {}

    public VoteRecord(String username, String constituency, String candidate, String previousHash, String voteHash) {
        
        this.username = username;
        this.constituency = constituency;
        this.candidate = candidate;
        this.previousHash = previousHash;
        this.voteHash = voteHash;
        this.timestamp = LocalDateTime.now();
    }


    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getConstituency() { return constituency; }
    public String getCandidate() { return candidate; }
    public String getPreviousHash() { return previousHash; }
    public String getVoteHash() { return voteHash; }
    public LocalDateTime getTimestamp() { return timestamp; }

}