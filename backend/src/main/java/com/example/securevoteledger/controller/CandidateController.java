package com.example.securevoteledger.controller;

import com.example.securevoteledger.entity.Candidate;
import com.example.securevoteledger.repository.CandidateRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/candidates")
public class CandidateController {

    private final CandidateRepository candidateRepository;

    public CandidateController(CandidateRepository candidateRepository){
        this.candidateRepository = candidateRepository;
    }

    @GetMapping
    public List<Candidate> getCandidates(@RequestParam String constituency){
        return candidateRepository.findByConstituency(constituency);
    }

}