# Secure Vote Ledger

Secure Vote Ledger is a blockchain-based electronic voting system designed to ensure transparency, security, and integrity in the voting process. The system allows registered users to vote securely while administrators can monitor election statistics and validate the blockchain to verify that votes have not been tampered with.

Each vote is recorded in a database and its cryptographic hash is stored on an Ethereum blockchain, creating an immutable ledger that ensures vote authenticity.

## Features

### Voter Features
- User registration and login
- Vote for candidates based on constituency
- One vote per user restriction
- Secure vote confirmation
- Vote receipt after successful voting

### Admin Features
- Admin dashboard with election statistics
- View total users and votes
- Constituency-wise vote results
- Overall vote distribution charts
- Open and close election control
- Blockchain integrity validation
- Blockchain explorer for stored vote hashes

## Technologies Used

### Frontend
- React.js
- CSS
- Recharts (for charts)

### Backend
- Spring Boot
- Spring Security
- REST APIs

### Database
- PostgreSQL

### Blockchain
- Ethereum
- Ganache (local blockchain)
- Web3j

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: Render PostgreSQL

## System Architecture

Frontend (React)  
↓  
Backend (Spring Boot API)  
↓  
PostgreSQL Database  
↓  
Ethereum Blockchain (Ganache)

Votes are stored in the database and the vote hash is recorded on blockchain to maintain integrity.

## Installation and Setup

### 1. Clone the Repository

git clone https://github.com/your-username/secure-vote-ledger.git  
cd secure-vote-ledger

### 2. Backend Setup (Spring Boot)

Navigate to backend folder:

cd backend

Run the backend:

./mvnw spring-boot:run

### 3. Frontend Setup (React)

Navigate to frontend folder:

cd frontend

Install dependencies:

npm install

Run the frontend:

npm start

## Smart Contract

The Ethereum smart contract stores vote hashes to ensure immutability.

Functions include:

storeVote() – stores vote hash on blockchain  
getVote() – retrieves vote hash  
getTotalVotes() – returns total stored hashes

## Security Features

- One vote per registered user
- Blockchain hash linking between votes
- Admin-only access to results and dashboard
- Election open/close control
- Blockchain integrity validation

## Future Improvements

- Integration with public Ethereum network
- Voter identity verification
- Mobile application support
- Advanced analytics dashboard
- Multi-region election support

## Contributors

Dhwani Falakiya  
Janhavi Chikhaliya

## License

This project is developed for educational purposes.