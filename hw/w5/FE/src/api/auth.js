import axios from 'axios';
const API_URL = 'http://localhost:8080/api';

export const login = (data) => {
  return axios.post(`${API_URL}/auth/login`, data);
};

