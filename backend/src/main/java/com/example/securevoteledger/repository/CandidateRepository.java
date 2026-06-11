package com.example.securevoteledger.repository;

import com.example.securevoteledger.entity.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate,Long> {

    List<Candidate> findByConstituency(String constituency);

}