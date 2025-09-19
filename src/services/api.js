import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`, // use .env variable
});

// ✅ Get all sweets
export const getAllSweets = async () => {
  try {
    const response = await API.get("/sweets/");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// ✅ Register User
export const registerUser = async (userData) => {
  try {
    const response = await API.post("/auth/register", userData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// ✅ Login User
export const loginUser = async (credentials) => {
  try {
    const response = await API.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// ✅ Add Sweet (with images)
export const addSweet = async (formData, token) => {
  try {
    const response = await API.post("/sweets", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// ✅ Update Sweet
export const updateSweet = async (id, formData, token) => {
  try {
    const response = await API.put(`/sweets/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// ✅ Delete Sweet
export const deleteSweet = async (id, token) => {
  try {
    const response = await API.delete(`/sweets/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// ✅ Search Sweets (public)
export const searchSweets = async (query) => {
  try {
    const { data } = await API.get(`/sweets/search?name=${query}`);
    return data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// ✅ Purchase Sweet (User)
export const purchaseSweet = async (id, data, token) => {
  try {
    const response = await API.post(`/sweets/${id}/purchase`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// ✅ Restock Sweet (Admin only)
export const restockSweet = async (id, data) => {
  try {
    const response = await API.post(`/sweets/${id}/restock`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
