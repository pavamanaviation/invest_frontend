import React, { useState, useEffect } from 'react';
import "./Payment.css";
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { createFullPaymentOrder, getPaymentStatus} from "../../apis/paymentApi";

const Payment = () => {
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
  const totalPrice = 1200000;
const [fullPaymentAmount, setFullPaymentAmount] = useState("");
const [fullPaymentError, setFullPaymentError] = useState("");

const [paymentDone, setPaymentDone] = useState(false);
const [isPaymentComplete, setIsPaymentComplete] = useState(false);



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

  // const handleProceedToPay = async () => {
  //   try {
  //     const response = await createFullPaymentOrder({ customer_id, email, price: totalPrice });
  //     if (response.orders?.length) {
  //       response.orders.forEach(order => {
  //         const options = {
  //           key: order.razorpay_key,
  //           amount: order.amount * 100,
  //           currency: order.currency,
  //           name: "Pavaman Aviation",
  //           description: `Drone Order - Part ${order.part_number}`,
  //           order_id: order.order_id,
  //           prefill: {
  //             email: order.email,
  //           },
  //           handler: function (resp) {
  //             setPopup({
  //               isOpen: true,
  //               message: `Part ${order.part_number} payment completed.`,
  //               type: "success",
  //             });
  //           },
  //           theme: {
  //             color: "#3399cc",
  //           },
  //         };

  //         const rzp = new window.Razorpay(options);
  //         rzp.open();
  //       });
  //     }
  //   } catch (error) {
  //     setPopup({
  //       isOpen: true,
  //       message: error?.message || "Payment failed",
  //       type: "error",
  //     });
  //   } finally {
  //     setShowPopup(false);
  //   }
  // };

const handleProceedToPay = async () => {
  const amount = parseInt(fullPaymentAmount);

  if (!amount || amount < 100000) {
    setFullPaymentError("Minimum payment must be ₹1,00,000.");
    return;
  }

  try {
    const response = await createFullPaymentOrder({
      customer_id,
      email,
      price: amount,
    });

    if (response.orders?.length) {
      const order = response.orders[0];
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
            message: `Payment of ₹${amount.toLocaleString()} successful for Part ${order.part_number}`,
            type: "success",
          });
          setFullPaymentAmount("");
        },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }
  } catch (error) {
    if (
      error?.error ===
      "Full payment of ₹12L already completed."
    ) {
      setIsPaymentComplete(true);
    }

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
    // TODO: Implement API logic for installment
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
              <td>1</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Total Amount Payable (Rs)</td>
              <td>₹12,00,000/-</td>
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

        {/* Full Payment Popup */}
        {/* {showPopup === "full" && (
          <div className="pay-popup-overlay">
            <div className="pay-popup-box">
              <h3 className='pay-popup-header'>Confirm Full Payment</h3>
              <p><strong>Number of Drones:</strong> 1</p>
              <p><strong>Amount Payable:</strong> ₹12,00,000/-</p>
              <div className="pay-popup-buttons">
                <button className="secondary-button" onClick={handleCancelPayment}>Cancel</button>
                <button className="primary-button" onClick={handleProceedToPay}>Continue</button>
              </div>
            </div>
          </div>
        )} */}
{showPopup === "full" && (
  <div className="pay-popup-overlay">
    <div className="pay-popup-box">
      <h3 className='pay-popup-header'>Pay Towards Full Amount</h3>
      <p><strong>Total Amount:</strong> ₹12,00,000/-</p>
      <div className="pay-popup-input-group">
        <label>Enter Amount to Pay:</label>
        <input
          type="text"
          value={fullPaymentAmount}
          onChange={(e) => {
            setFullPaymentAmount(e.target.value);
            setFullPaymentError("");
          }}
          placeholder="Enter amount (Min ₹1,00,000)"
          className="pay-popup-input"
        />
        {fullPaymentError && (
          <p className="pay-popup-error">{fullPaymentError}</p>
        )}
      </div>

      <div className="pay-popup-buttons">
        <button className="secondary-button" onClick={handleCancelPayment}>Cancel</button>
        <button className="primary-button" onClick={handleProceedToPay}>Proceed to Pay</button>
      </div>

      {isPaymentComplete && (
        <div className="payment-complete-msg">
          ✅ Full payment of ₹12,00,000 has already been completed.
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
