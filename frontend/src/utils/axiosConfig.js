import axios from "axios";

// Configure global Axios request interceptor for Authorization header
axios.interceptors.request.use(
  (config) => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const token = parsedUser?.accessToken;
        if (token && !config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error("Error setting Authorization header in Axios interceptor:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
