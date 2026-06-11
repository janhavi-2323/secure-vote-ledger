import axios from "axios";

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://localhost:8080/api"
      : "https://secure-vote-ledger.onrender.com/api",
});

export default api;