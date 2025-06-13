// panApi.js
import axios from "axios";
import API_BASE_URL from "../config";

export const verifyPan = async ({ pan_number, customer_id }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-pan`, {
      pan_number,
      customer_id,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "PAN verification failed." };
  }
};


export const verifyAadhar = async ({ aadhar_number, customer_id }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/aadhar-verify`, {
      aadhar_number,
      customer_id,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Aadhaar verification failed." };
  }
};