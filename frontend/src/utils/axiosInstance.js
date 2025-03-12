//use this utility only for all the axios request to backend
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
	baseURL: apiUrl,
	withCredentials: true,
});

export default axiosInstance;
