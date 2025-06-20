import axios from "axios";
import API_BASE_URL from "../config";

// Register (Google / Email / Mobile)
export const registerCustomer = async ({ token, email, mobile_no }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/customer-register`, {
      token,
      email,
      mobile_no,
    },
      {
        withCredentials: true, // ✅ This is what sets the session
        headers: {
          "Content-Type": "application/json",
        },
      });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Registration failed." };
  }
};

// Verify OTP
export const verifyCustomerOtp = async ({ otp, email, mobile_no, first_name, last_name }) => {
  try {
    
    const response = await axios.post(`${API_BASE_URL}/verify-customer-otp`, {
      customer_id : sessionStorage.getItem("customer_id") || "",
      otp,
      email,
      mobile_no,
      first_name,
      last_name,
    },
      {
        withCredentials: true, // ✅ This is what sets the session
        headers: {
          "Content-Type": "application/json",
        },
      });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "OTP verification failed." };
  }
};

export const postSignup = async ({ customer_id, email, mobile_no, first_name, last_name }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/customer-register-sec-phase`, {
      customer_id : sessionStorage.getItem("customer_id"),
      email,
      mobile_no,
      first_name,
      last_name,
    },
      {
        withCredentials: true, // ✅ This is what sets the session
        headers: {
          "Content-Type": "application/json",
        },
      });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Profile completion failed." };
  }
};

export const loginCustomer = async ({ email, mobile_no, token }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customer-login`,
      {
        email,
        mobile_no,
        token,
      },
      {
        withCredentials: true, // ✅ Crucial for setting session cookie
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login failed." };
  }
};


export const verifyLoginOtp = async ({ otp, email, mobile_no }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
      otp,
      email,
      mobile_no,
    }, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Login OTP verification failed." };
  }
};
