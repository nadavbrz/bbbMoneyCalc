import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4040/users",
  headers: {
    "Content-Type": "application/json",
  },
});

export const addWorkday = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:4040/users/workday",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding workday:", error);
    throw error;
  }
};

export const getWorkdays = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:4040/users/allWorkDays", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.workDays;
  } catch (error) {
    console.error("Error fetching workdays:", error);
    throw error;
  }
};

export const getWorkdayById = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`http://localhost:4040/users/allWorkDays/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching workday by ID:", error);
    throw error;
  }
};

export const editWorkday = async (id, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `http://localhost:4040/users/workDay/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error editing workday:", error);
    throw error;
  }
};

export const deleteWorkday = async (id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.delete(`http://localhost:4040/users/workDay/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting workday:", error);
    throw error;
  }
};

const registerUser = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

const loginUser = async (userData) => {
  try {
    const response = await api.post("/login", userData);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post("http://localhost:4040/users/send-reset-password-email", {
      mail: email,
    });
    return response.data;
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

const resetPassword = async (data) => {
  try {
    const response = await api.post("/reset-password", data);
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export default {
  addWorkday,
  registerUser,
  loginUser,
  getWorkdays,
  getWorkdayById,
  editWorkday,
  deleteWorkday,
  requestPasswordReset,
  resetPassword,
};
