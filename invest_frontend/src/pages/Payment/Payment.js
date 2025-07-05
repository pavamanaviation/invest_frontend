import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Payment.css";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { createFullPaymentOrder, getPaymentStatus } from "../../apis/paymentApi";

const Payment = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });
  const [showInstallmentPopup, setShowInstallmentPopup] = useState(false);
  const [installmentAmount, setInstallmentAmount] = useState("");
  const [installmentError, setInstallmentError] = useState("");

  const customer_id = sessionStorage.getItem("customer_id");
  const email = sessionStorage.getItem("customer_email");
  const [fullPaymentAmount, setFullPaymentAmount] = useState("");
  const [fullPaymentError, setFullPaymentError] = useState("");

  const [paymentDone, setPaymentDone] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const [quantity, setQuantity] = useState(1);
  const unitPrice = 1200000;
  const totalPrice = unitPrice * quantity;

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        const response = await getPaymentStatus(customer_id); // Make sure this API hits `/payment-status-check`
        if (response.completed) {
          setIsPaymentComplete(true);
        }
      } catch (error) {
        console.error("Error fetching payment status:", error);
      }
    };

    if (customer_id) {
      fetchPaymentStatus();
    }
  }, [customer_id]);


  const handleFullPayment = async () => {
    try {
      const status = await getPaymentStatus(customer_id);
      if (status.completed) {
        setPopup({
          isOpen: true,
          message: "✅ Full payment of ₹12,00,000 has already been completed.",
          type: "success",
        });
        return;
      }

      setSelectedPayment("full");
      setShowPopup("full");
    } catch (error) {
      setPopup({
        isOpen: true,
        message: error.message || "Unable to verify payment status.",
        type: "error",
      });
    }
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

      // Sequentially process each order using Razorpay
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

      // ✅ Final success popup after all parts are paid
      setPopup({
        isOpen: true,
        message: `✅ Total payment of ₹${totalAmount.toLocaleString()} completed successfully! Redirecting to dashboard...`,
        type: "success",
      });

      // Redirect to customer-dashboard after 3 seconds
      setTimeout(() => {
        navigate("/customer-dashboard");
      }, 3000);

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

  const handleProceedInstallment = () => {
    if (!installmentAmount || parseInt(installmentAmount) < 100000) {
      setInstallmentError("Minimum installment amount must be ₹1,00,000.");
      return;
    }

    setInstallmentError("");
    setPopup({
      isOpen: true,
      message: "Proceeding with installment payment of: ₹" + installmentAmount,
      type: "info",
    });

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

          </tbody>
        </table>

        <div className="payment-note">
          <strong>Note:</strong> I undertake to pay the above balance amount within <strong>90 days.</strong> In case I fail to pay the amount, <strong>Pavaman Aviation Pvt Ltd</strong> will deduct <strong>Rs 10,000/-</strong> towards its operational expenses and refund the balance within <strong>45 days</strong> after I request in writing for cancellation of this application to purchase TEJAS Drone.
        </div>



        <div className='payment-btns'>
          <button
            className='primary-button full-payment-btn'
            onClick={handleFullPayment}
            disabled={isPaymentComplete || selectedPayment === "installment"}
          >
            Full Payment
          </button>
          <button
            className='primary-button inst-payment-btn'
            onClick={handleInstallmentPayment}
            disabled={isPaymentComplete || selectedPayment === "full"}
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
                <button className="secondary-button" onClick={handleCancelPayment}>
                  Cancel
                </button>
                <button className="primary-button" onClick={handleProceedToPay}>
                  Proceed to Pay
                </button>
              </div>

              {isPaymentComplete && (
                <div className="payment-complete-msg">
                  ✅ Full payment of ₹{(unitPrice * quantity).toLocaleString("en-IN")} has already been completed.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Installment Popup */}
        {showInstallmentPopup && (
          <div className="pay-popup-overlay">
            <div className="pay-popup-box">
              <h3 className='pay-popup-header'>Installment Payment</h3>
              <p><strong>Total Amount:</strong> ₹12,00,000/-</p>
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
