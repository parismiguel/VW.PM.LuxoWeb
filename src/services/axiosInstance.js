import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL for all API calls
  timeout: 50000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
    OrganizationId: "200201"
  },
});

export default axiosInstance;