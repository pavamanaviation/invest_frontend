import React, { useState, useEffect } from 'react';
import "./Payment.css";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { createFullPaymentOrder, getPaymentStatus, createInstallmentPaymentOrder } from "../../apis/paymentApi";
import API_BASE_URL from "../../../src/config";
import axios from "axios";

const Payment = () => {
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popup, setPopup] = useState({ isOpen: false, message: "", type: "info" });
  const [showInstallmentPopup, setShowInstallmentPopup] = useState(false);
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [installmentError, setInstallmentError] = useState("");

  const customer_id = sessionStorage.getItem("customer_id");
  const email = sessionStorage.getItem("customer_email");
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [latestOrderId, setLatestOrderId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const unitPrice = 1200000;

useEffect(() => {
  const fetchLatestPaymentStatus = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/payment-status-check`,
        {},
        { withCredentials: true }
      );

      const data = res.data;

      if (data.paid) {
        setIsPaymentComplete(true);
        setPopup({ isOpen: true, message: data.message, type: "success" });
      } else {
        setIsPaymentComplete(false);

        if (data.payment_status === 0 && data.drone_order_id) {
          await axios.post(
            `${API_BASE_URL}/delete-cancelled-order`,
            { drone_order_id: data.drone_order_id },
            { withCredentials: true }
          );
          console.log("Cancelled order deleted");
        }
      }

      setLatestOrderId(data.drone_order_id);
    } catch (error) {
      console.error("Error checking payment status:", error);
    }
  };

  if (customer_id) {
    fetchLatestPaymentStatus();
  }
}, [customer_id]);



  const handleFullPayment = async () => {
    if (isPaymentComplete) {
      setPopup({
        isOpen: true,
        message: "Previous order fully paid. You can now proceed with a new order.",
        type: "success",
      });
    }
    setSelectedPayment("full");
    setShowPopup("full");
  };

  const handleInstallmentPayment = () => {
    setSelectedPayment("installment");
    setShowInstallmentPopup(true);
  };

  const handleCancelPayment = () => {
    setSelectedPayment("");
    setShowPopup(false);
    setInstallmentAmount("");
  };

  const handleProceedToPay = async () => {
    const totalAmount = unitPrice * quantity;
    try {
      const response = await createFullPaymentOrder({
        customer_id,
        email,
        price: totalAmount,
        quantity,
      });

      if (!response.orders || response.orders.length === 0) {
        setPopup({
          isOpen: true,
          message: "No orders returned. Cannot proceed.",
          type: "error",
        });
        return;
      }

      for (const order of response.orders) {
        await new Promise((resolve, reject) => {
          const options = {
            key: order.razorpay_key,
            amount: order.amount * 100,
            currency: order.currency,
            name: "Pavaman Aviation",
            description: `Drone Payment - Part ${order.part_number}`,
            order_id: order.order_id,
            prefill: { email: order.email },
            handler: function () {
              setPopup({
                isOpen: true,
                message: `Payment of ₹${order.amount.toLocaleString()} successful (Part ${order.part_number})`,
                type: "success",
              });
              resolve();
            },
            modal: {
              ondismiss: function () {
                setPopup({
                  isOpen: true,
                  message: `Payment cancelled (Part ${order.part_number}). Remaining payment halted.`,
                  type: "error",
                });
                reject();
              },
            },
            theme: { color: "#3399cc" },
          };

          const rzp = new window.Razorpay(options);
          rzp.open();
        });
      }
    } catch (error) {
      setPopup({
        isOpen: true,
        message: error?.error || "Payment failed.",
        type: "error",
      });
    }
  };

  const handleCancelInstallment = () => {
    setSelectedPayment("");
    setShowInstallmentPopup(false);
    setInstallmentAmount("");
  };

const handleProceedInstallment = async () => {
  const amount = parseFloat(installmentAmount);

  if (!amount || amount < 100000) {
    setInstallmentError("Minimum installment amount must be ₹1,00,000.");
    return;
  }

  try {
    const data = await createInstallmentPaymentOrder({
      email,
      quantity,
      installment_amount: amount,
      total_price: unitPrice * quantity,
    });

    const order = data.order;

    if (window.Razorpay) {
      const options = {
        key: order.razorpay_key,
        amount: order.amount * 100,
        currency: order.currency,
        name: "Pavaman Aviation Pvt Ltd",
        description: "Drone Installment Payment",
        order_id: order.razorepay_order_id,
        prefill: { email: order.email },
        notes: {
          drone_order_id: data.drone_order_id,
          part: data.installment_number,
        },
        handler: function () {
          setPopup({
            isOpen: true,
            message: `Installment payment of ₹${order.amount.toLocaleString()} successful.`,
            type: "success",
          });
          setShowInstallmentPopup(false);
          setInstallmentAmount("");
        },
        modal: {
          ondismiss: function () {
            setPopup({
              isOpen: true,
              message: `Installment payment cancelled.`,
              type: "error",
            });
          },
        },
        theme: { color: "#1976d2" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      setInstallmentError("Razorpay SDK not loaded.");
    }
  } catch (error) {
    const errMsg = error?.response?.data?.error || "Failed to create installment order.";
    setInstallmentError(errMsg);
  }
};


  return (
    <div className='payment-section container'>
      <div className='payment-container'>
        <div className='payment-header'>Purchase Details</div>

        <table className='payment-table'>
          <thead>
            <tr>
              <th>S. No.</th>
              <th>Description</th>
              <th>Amount / Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Rate of each TEJAS Drone with accessories and 66 months AMC (Rs)</td>
              <td>₹12,00,000/-</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Number of Drones Applicable for Purchase</td>
              <td>
                <input
                  type="text"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => {
                    let val = parseInt(e.target.value) || 1;
                    if (val > 10) val = 10;
                    if (val < 1) val = 1;
                    setQuantity(val);
                  }}
                  className="quantity-input"
                />
                {quantity === 10 && (
                  <div className="quantity-warning" style={{ color: "red", fontSize: "12px" }}>
                    Max limit is 10 drones
                  </div>
                )}
              </td>
            </tr>
            <tr>
              <td>3</td>
              <td>Total Amount Payable (Rs)</td>
              <td>₹{(quantity * unitPrice).toLocaleString("en-IN")}/-</td>
            </tr>
            {isPaymentComplete && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "green" }}>
                   Previous Order ({latestOrderId}) payment is complete.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className='payment-note'>
          <strong>Note:</strong> I undertake to pay the above balance amount within <strong>90 days.</strong> In case I fail to pay the amount, <strong>Pavaman Aviation Pvt Ltd</strong> will deduct <strong>Rs 10,000/-</strong> towards its operational expenses and refund the balance within <strong>45 days</strong> after I request in writing for cancellation of this application to purchase TEJAS Drone.
        </div>

        <div className='payment-btns'>
          <button
            className='primary-button full-payment-btn'
            onClick={handleFullPayment}
            disabled={selectedPayment === "installment"}
          >
            Full Payment
          </button>
          <button
            className='primary-button inst-payment-btn'
            onClick={handleInstallmentPayment}
            disabled={selectedPayment === "full"}
          >
            Installment Payment
          </button>
        </div>

        {showPopup === "full" && (
          <div className="pay-popup-overlay">
            <div className="pay-popup-box">
              <h3 className="pay-popup-header">Confirm Full Payment</h3>
              <div className="pay-popup-summary">
                <p><strong>Number of Drones:</strong> {quantity}</p>
                <p><strong>Total Amount Payable:</strong> ₹{(unitPrice * quantity).toLocaleString("en-IN")}/-</p>
              </div>
              <div className="pay-popup-buttons">
                <button className="secondary-button" onClick={handleCancelPayment}>Cancel</button>
                <button className="primary-button" onClick={handleProceedToPay}>Proceed to Pay</button>
              </div>
            </div>
          </div>
        )}

        {showInstallmentPopup && (
          <div className="pay-popup-overlay">
            <div className="pay-popup-box">
              <h3 className='pay-popup-header'>Installment Payment</h3>
              <div className="pay-popup-summary">
                <p><strong>Number of Drones:</strong> {quantity}</p>
                <p><strong>Total Amount Payable:</strong> ₹{(unitPrice * quantity).toLocaleString("en-IN")}/-</p>
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
                <strong>Note:</strong> I undertake to pay the above balance amount within <strong>90 days.</strong> In case I fail to pay the amount, <strong>Pavaman Aviation Pvt Ltd</strong> will deduct <strong>Rs 10,000/-</strong> towards its operational expenses and refund the balance within <strong>45 days</strong> after I request in writing for cancellation of this application to purchase TEJAS Drone.
              </div>
              <div className="pay-popup-buttons">
                <button className="secondary-button" onClick={handleCancelInstallment}>Cancel</button>
                <button className="primary-button" onClick={handleProceedInstallment}>Proceed to Pay</button>
              </div>
            </div>
          </div>
        )}


        <PopupMessage
          isOpen={popup.isOpen}
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup({ ...popup, isOpen: false })}
        />
      </div>
    </div>
  );
};

export default Payment;