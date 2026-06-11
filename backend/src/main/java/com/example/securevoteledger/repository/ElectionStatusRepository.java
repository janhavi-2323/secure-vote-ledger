package com.example.securevoteledger.repository;

import com.example.securevoteledger.entity.ElectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ElectionStatusRepository extends JpaRepository<ElectionStatus, Long> {
}