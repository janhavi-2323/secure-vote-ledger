package com.example.securevoteledger.entity;

import jakarta.persistence.*;

@Entity
@Table(name="candidates")
public class Candidate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String party;
    private String symbol;
    private String color;
    private String constituency;

    public Long getId(){ return id; }

    public String getName(){ return name; }

    public String getParty(){ return party; }

    public String getSymbol(){ return symbol; }

    public String getColor(){ return color; }

    public String getConstituency(){ return constituency; }

}