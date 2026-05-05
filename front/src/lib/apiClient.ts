import axios from "axios";

// ローカルと本番環境でbaseURLを切り替えて作業すること

const apiClient = axios.create({
    // baseURL: "http://localhost:8888/api",
    baseURL: process.env.NEXT_PUBLIC_API_BASEURL,
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
});

export default apiClient;