import axios from "axios";

const api = axios.create({
  baseURL: "https://bbb-server.brzcode.site/users",
  headers: {
    "Content-Type": "application/json",
  },
});

export const addWorkday = async (data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "https://bbb-server.brzcode.site/users/workday",
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
    const response = await axios.get("https://bbb-server.brzcode.site/users/allWorkDays", {
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
    const response = await axios.get(`https://bbb-server.brzcode.site/users/allWorkDays/${id}`, {
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
      `https://bbb-server.brzcode.site/users/workDay/${id}`,
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
    const response = await axios.delete(`https://bbb-server.brzcode.site/users/workDay/${id}`, {
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
    const { role, token } = response.data;

    // Save role and token to localStorage
    localStorage.setItem("role", role);
    localStorage.setItem("token", token);

    // Return the response data for further use (if needed)
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

const requestPasswordReset = async (email) => {
  try {
    const response = await axios.post("https://bbb-server.brzcode.site/users/send-reset-password-email", {
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
const getUsers = async (token) => {
  try {
    const response = await axios.get(`https://bbb-server.brzcode.site/users/getAllUsers`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // List of users
  } catch (error) {
    console.error("Error fetching users:", error);
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
  getUsers
};
