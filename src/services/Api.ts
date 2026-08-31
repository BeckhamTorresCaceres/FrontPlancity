import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.API_URL || "http://localhost:3000/api" ,
});
export default API;