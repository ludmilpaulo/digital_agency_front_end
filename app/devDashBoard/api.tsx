import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/slices/authSlice';
import { baseAPI } from '@/useAPI/api';

const useApi = () => {
  const user = useSelector(selectUser);
  console.log("user data", user)
  const API = axios.create({
    baseURL: `${baseAPI}/task/`,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Use an interceptor to inject the token into the headers of each request
  API.interceptors.request.use(
    config => {
      if (user && user.token) {
        config.headers['Authorization'] = `Bearer ${user.token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  return API;
};

export default useApi;
