package com.example.securevoteledger.repository;

import com.example.securevoteledger.entity.VoteRecord;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VoteRepository extends JpaRepository<VoteRecord, Long> {

     // All votes in a constituency
    List<VoteRecord> findByConstituency(String constituency);

    // Count votes for a candidate
    long countByCandidate(String candidate);

    // (Optional) Check if user already voted at DB level
    boolean existsByUsername(String username);
}
