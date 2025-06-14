// panApi.js
import axios from "axios";
import API_BASE_URL from "../config";

export const verifyPan = async ({ pan_number, customer_id }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-pan`, {
      pan_number,
      customer_id,
    },
      {
        withCredentials: true, // ✅ This is what sets the session
        headers: {
          "Content-Type": "application/json",
        },
      });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "PAN verification failed." };
  }
};


export const verifyAadhar = async ({ aadhar_number, customer_id }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/verify-aadhar-lite`, {
      aadhar_number,
      customer_id,
    },
      {
        withCredentials: true, // ✅ This is what sets the session
        headers: {
          "Content-Type": "application/json",
        },
      });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Aadhaar verification failed." };
  }
};

export const savePersonalDetails = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/customer-more-details`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to save personal details." };
  }
};

export const fetchCustomerProfile = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/customer-profile`,
      {}, // ✅ Don't send customer_id
      {
        withCredentials: true, // ✅ Required for session cookie
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to fetch customer profile" };
  }
};



// src/apis/locationApi.js

export const getLocationByPincode = async (pincode) => {
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();

    if (data[0].Status === "Success" && data[0].PostOffice.length > 0) {
      const postOffice = data[0].PostOffice[0];
      return {
        city: postOffice.Name || "",
        mandal: postOffice.Block || "",
        district: postOffice.District || "",
        state: postOffice.State || "",
        country: postOffice.Country || "",
      };
    } else {
      throw new Error("Invalid pincode or no data found.");
    }
  } catch (error) {
    console.error("Failed to fetch location:", error);
    throw error;
  }
};
