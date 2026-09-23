/**import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.30.139:3000/api', // Apne Fastify backend ka IP/URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token to every request
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token from storage:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;**/
// api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.30.139:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      // Fallback Strategy: Check all possible storage keys
      const token =
        (await AsyncStorage.getItem('userToken')) ||
        (await AsyncStorage.getItem('token')) ||
        (await AsyncStorage.getItem('accessToken'));

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn('⚠️ Authentication Bypass Attempt: Token is null in AsyncStorage');
      }
    } catch (error) {
      console.error('AsyncStorage Read Failure:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
