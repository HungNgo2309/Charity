import apiClient from "./ApiClient";


// Hàm callApi để gọi API với phương thức, endpoint và dữ liệu động
export const callApi = async (method, endpoint, data = {}) => {
  try {
    const response = await apiClient({
      method: method,          // Phương thức (GET, POST, PUT, DELETE)
      url: endpoint,           // Endpoint API (có thể động)
      data: method !== 'GET' ? data : null, // Dữ liệu nếu là POST, PUT
      params: method === 'GET' ? data : {}, // Tham số query nếu là GET
    });
    return response.data; // Trả về dữ liệu từ API
  } catch (error) {
    console.log(`Error calling API: ${endpoint}`, error);
    //throw error; // Ném lỗi để xử lý bên ngoài nếu cần
  }
};
