// InstallmentPopup.js
import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config"; // update if your config path is different

const InstallmentPopup = ({ show, onClose, quantity, unitPrice, email }) => {
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [installmentError, setInstallmentError] = useState("");

  const handleProceedInstallment = async () => {
    const amount = parseFloat(installmentAmount);

    if (!amount || amount <= 0) {
      setInstallmentError("Please enter a valid amount.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/create-drone-installment-order`,
        {
          email,
          quantity,
          installment_amount: amount,
          total_price: unitPrice * quantity,
        },
        { withCredentials: true }
      );

      const data = response.data;
      const order = data.order;

      if (window.Razorpay) {
        const options = {
          key: order.razorpay_key,
          amount: order.amount * 100,
          currency: order.currency,
          name: "Pavaman Aviation Pvt Ltd",
          description: "Drone Installment Payment",
          order_id: order.razorepay_order_id,
          handler: function (response) {
            // Handle success - e.g. update status or navigate to success page
            alert("Payment successful!");
            onClose();
          },
          prefill: {
            email: order.email,
          },
          notes: {
            drone_order_id: data.drone_order_id,
            part: data.installment_number,
          },
          theme: {
            color: "#1976d2",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Razorpay SDK not loaded.");
      }
    } catch (error) {
      const err = error.response?.data?.error || "Something went wrong.";
      setInstallmentError(err);
    }
  };

  if (!show) return null;

  return (
    <div className="pay-popup-overlay">
      <div className="pay-popup-box">
        <h3 className="pay-popup-header">Installment Payment</h3>
        <div className="pay-popup-summary">
          <p>
            <strong>Number of Drones:</strong> {quantity}
          </p>
          <p>
            <strong>Total Amount Payable:</strong> ₹
            {(unitPrice * quantity).toLocaleString("en-IN")}/-
          </p>
        </div>
        <div className="pay-popup-input-group">
          <label>Enter Amount to Pay:</label>
          <input
            type="text"
            value={installmentAmount}
            onChange={(e) => {
              setInstallmentAmount(e.target.value);
              setInstallmentError("");
            }}
            placeholder="Enter amount"
            className="pay-popup-input"
          />
          {installmentError && (
            <p className="pay-popup-error">{installmentError}</p>
          )}
        </div>
        <div className="payment-note">
          <strong>Note:</strong> I undertake to pay the above balance amount
          within <strong>90 days.</strong> In case I fail to pay the amount,{" "}
          <strong>Pavaman Aviation Pvt Ltd</strong> will deduct{" "}
          <strong>Rs 10,000/-</strong> towards its operational expenses and
          refund the balance within <strong>45 days</strong> after I request in
          writing for cancellation of this application to purchase TEJAS Drone.
        </div>
        <div className="pay-popup-buttons">
          <button className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button className="primary-button" onClick={handleProceedInstallment}>
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallmentPopup;
