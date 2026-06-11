package com.example.securevoteledger.dto;

public class RegisterRequest {
    private String username;
    private String password;
    private String role;
    private String voterId;
    private String constituency;

    public RegisterRequest() {}

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getVoterId() { return voterId; }
    public void setVoterId(String voterId) { this.voterId = voterId; }

    public String getConstituency() { return constituency; }
    public void setConstituency(String constituency) { this.constituency = constituency; }
}