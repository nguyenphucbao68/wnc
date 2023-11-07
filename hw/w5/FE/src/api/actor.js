import axios from 'axios';
const API_URL = 'http://localhost:8080/api';

export const getAllActor = () => {
  const token = localStorage.getItem('token');
  return axios.get(`${API_URL}/actor`, {
    headers: {
      authorization: token,
    },
  });
};

export const getActorById = (id) => {
  return axios.get(`${API_URL}/actor/${id}`);
};

export const createActor = (data) => {
  return axios.post(`${API_URL}/actor`, data);
};

export const updateActor = (id, data) => {
  return axios.patch(`${API_URL}/actor/${id}`, data);
};

export const deleteActor = (id) => {
  return axios.delete(`${API_URL}/actor/${id}`);
};

