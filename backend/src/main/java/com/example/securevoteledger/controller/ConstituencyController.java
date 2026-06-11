package com.example.securevoteledger.controller;

import com.example.securevoteledger.entity.Constituency;
import com.example.securevoteledger.repository.ConstituencyRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/constituencies")
public class ConstituencyController {

    private final ConstituencyRepository constituencyRepository;

    public ConstituencyController(ConstituencyRepository constituencyRepository) {
        this.constituencyRepository = constituencyRepository;
    }

    @GetMapping
    public List<Constituency> getAllConstituencies() {
        return constituencyRepository.findAll();
    }
}