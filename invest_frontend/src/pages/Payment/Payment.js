import React, { useState } from 'react';
import API_BASE_URL from "../../../src/config";

const DronePayment = () => {
  const [customerId, setCustomerId] = useState('');
  const [email, setEmail] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  const handlePayment = async () => {
    setIsPaying(true);
    try {
      // Step 1: Create orders for all parts
      const response = await fetch(`${API_BASE_URL}/create-drone-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include',  // needed for session-based auth
        body: JSON.stringify({
          customer_id: customerId,
          email: email,
          price: 1200000
        })
      });

      const data = await response.json();
      if (!data.orders) {
        alert("Failed to create orders: " + data.error);
        return;
      }

      // Step 2: Loop through each order (3 parts)
      for (const order of data.orders) {
        await openRazorpay(order);
      }

    } catch (err) {
      alert("Payment error: " + err.message);
    } finally {
      setIsPaying(false);
    }
  };

  const openRazorpay = (order) => {
    return new Promise((resolve, reject) => {
      const options = {
        key: order.razorpay_key,
        amount: order.amount * 100, // paise
        currency: "INR",
        name: "Drone Payment",
        description: `Drone Installment Part ${order.part_number}`,
        order_id: order.order_id,
        prefill: {
          email: order.email
        },
        handler: function (response) {
          alert(`Payment Part ${order.part_number} Successful: ${response.razorpay_payment_id}`);
          resolve(true);
        },
        modal: {
          ondismiss: () => {
            alert("Payment canceled.");
            reject();
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    });
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: "2rem" }}>
      <h2>Drone Payment (₹12,00,000)</h2>
      <input
        type="text"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />
      <input
        type="email"
        placeholder="Email ID"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 20 }}
      />
      <button onClick={handlePayment} disabled={isPaying}>
        {isPaying ? "Processing..." : "Pay ₹12L (Split in 3 parts)"}
      </button>
    </div>
  );
};

export default DronePayment;