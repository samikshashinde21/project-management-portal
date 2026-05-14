import axios from "axios";

const API = axios.create({
  baseURL: "https://project-management-portal-tq2d.onrender.com/api",
});

export default API;