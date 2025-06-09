import axios from "axios";
import API_BASE_URL from "../config";

// Register (Google / Email / Mobile)
export const registerCustomer = async ({ token, email, mobile_no }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/customer-register`, {
      token,
      email,
      mobile_no,
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
      otp,
      email,
      mobile_no,
      first_name,
      last_name,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "OTP verification failed." };
  }
};
