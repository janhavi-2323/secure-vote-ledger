package com.example.securevoteledger.repository;

import com.example.securevoteledger.entity.VoteRecord;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VoteRepository extends JpaRepository<VoteRecord, Long> {

    // All votes in a constituency
    List<VoteRecord> findByConstituency(String constituency);

    // Count votes for a candidate
    long countByCandidate(String candidate);

    // Check if user already voted
    boolean existsByUsername(String username);

    // ⭐ NEW: Count votes grouped by candidate
    @Query("SELECT v.candidate, COUNT(v) FROM VoteRecord v GROUP BY v.candidate")
    List<Object[]> countVotesByCandidate();
}
