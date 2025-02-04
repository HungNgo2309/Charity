import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useSelector } from 'react-redux';

// Tạo một instance Axios với baseURL và timeout mặc định
const apiClient = axios.create({
  baseURL: 'https://desktop-fakfvcn.tailaff69d.ts.net', // URL API cơ bản
  timeout: 10000, // Thời gian chờ tối đa cho mỗi request
});

// Thêm interceptor để thêm token vào mỗi request tự động
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem('@user_token');
      //.log(token)
      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Thêm token vào header
      }
    } catch (error) {
      console.log('Error fetching token', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Xử lý lỗi nếu có vấn đề khi tạo request
  }
);

// Interceptor cho response để xử lý lỗi toàn cục (nếu cần)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Xử lý lỗi 401 (Unauthorized) nếu token không hợp lệ
      console.log('Token không hợp lệ hoặc đã hết hạn.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
