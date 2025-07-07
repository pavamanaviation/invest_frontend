import axios from "axios";
import API_BASE_URL from "../config";

export const createFullPaymentOrder = async ({ customer_id, email, price,quantity }) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/create-drone-order`,
      { customer_id, email, price,quantity },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Order creation failed." };
  }
};

export const getPaymentStatus = async (customer_id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payment-status-check`, {
      params: { customer_id },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to check payment status." };
  }
};

export const createInstallmentPaymentOrder = async ({ email, quantity, installment_amount, total_price }) => {
  try { const response = await axios.post(
    `${API_BASE_URL}/create-drone-installment-order`,
    { email, quantity, installment_amount, total_price },
    { withCredentials: true }
  );
  return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Order creation failed." };
  }
};
