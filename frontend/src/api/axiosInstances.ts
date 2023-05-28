import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACK_END_URL;

const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const getToken = () => localStorage.getItem("token");

export const getAuthorizationHeader = () =>
  `Token ${localStorage.getItem("token")}`;

const axiosPrivate = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: getAuthorizationHeader(),
  },
  withCredentials: true,
});

const axiosFiles = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: getAuthorizationHeader(),
  },
  withCredentials: true,
});

export { axiosPrivate, axiosPublic, axiosFiles };
