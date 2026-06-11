package com.example.securevoteledger.repository;

import com.example.securevoteledger.entity.Constituency;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConstituencyRepository extends JpaRepository<Constituency, Long> {
}