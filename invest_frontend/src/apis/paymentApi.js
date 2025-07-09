import axios from "axios";
import API_BASE_URL from "../config";

export const createFullPaymentOrder = async ({ email, quantity }) => {
  const total_amount = 1200000 * quantity;
  try {
    const response = await axios.post(
      `${API_BASE_URL}/create-drone-order`,
      {
        email,
        quantity,
        total_amount,
        payment_type: "fullpayment",
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Order creation failed." };
  }
};

export const getPaymentStatus = async () => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/payment-status-check`,
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Failed to check payment status." };
  }
};

export const createInstallmentPaymentOrder = async ({
  email,
  quantity,
  amount,
  total_amount,
}) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/create-drone-installment-order`,
      {
        email,
        quantity,
        amount,
        total_amount,
      },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "Installment order creation failed." };
  }
};
