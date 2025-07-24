import React, { useState, useEffect } from 'react';
import "./Payment.css";
import { useNavigate } from 'react-router-dom';
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { createFullPaymentOrder, getPaymentStatus, createInstallmentPaymentOrder, createInvoice } from "../../apis/paymentApi";
import API_BASE_URL from "../../../src/config";
import axios from "axios";

const Payment = () => {
  const navigate = useNavigate();
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
  const [remainingAmount, setRemainingAmount] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [daysLeft, setDaysLeft] = useState(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState("");
  const [isGeneratingInvoices, setIsGeneratingInvoices] = useState(false);
  const [droneOrderId, setorderid] = useState("");
  const [paytype, setpaytype] = useState("");

  useEffect(() => {
    const fetchLatestPaymentStatus = async () => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/payment-status-check`,
          {},
          { withCredentials: true }
        );

        const data = res.data;
        const justPaid = sessionStorage.getItem("just_paid") === "true";

        if (data.paid) {
          setIsPaymentComplete(true);
          if (justPaid) {
            setPopup({
              isOpen: true,
              message: data.message,
              type: "success",
            });

            // Clear the flag so it doesn’t show again
            sessionStorage.removeItem("just_paid");
          }
        } else {
          setIsPaymentComplete(false);


        }

        setLatestOrderId(data.drone_order_id);
        setorderid(data.drone_order_id);
        setpaytype(data.payment_type);
        if (data.payment_status === 1 && data.total_invoice_status !== 1) {
          setShowAddressPopup(true);
      }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    };

    if (customer_id) {
      fetchLatestPaymentStatus();
    }
  }, [customer_id]);


  const handleFullPayment = async () => {
    if (!isPaymentComplete && latestOrderId) {
      // Block new payment if previous one is still pending
      setPopup({
        isOpen: true,
        message: `You already have a pending payment (Order ID: ${latestOrderId}). Please complete that first.`,
        type: "info",
      });
      return;
    }

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

  const handleInstallmentPayment = async () => {
    setSelectedPayment("installment");
    setShowInstallmentPopup(true);

    try {
      const res = await axios.post(
        `${API_BASE_URL}/payment-status-check`,
        { payment_type: "installment" },
        { withCredentials: true }
      );

      const { total_amount, paid_amount, remaining_amount, days_left } = res.data;

      const summary = {
        total_amount: parseFloat(total_amount || 0),
        total_paid: parseFloat(paid_amount || 0),
        remaining: parseFloat(remaining_amount || 0),
        days_left: days_left || 90,

      };

      setInstallmentSummary(summary);
    } catch (err) {
      console.error("Failed to fetch summary:", err);
    }
  };


  const handleCancelPayment = () => {
    setSelectedPayment("");
    setShowPopup(false);
    setInstallmentAmount("");
  };

  const handleProceedToPay = async () => {
    setIsPaymentProcessing(true);
    try {
      const response = await createFullPaymentOrder({ email, quantity });

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
            handler: () => resolve(),
            modal: {
              ondismiss: () => {
                setPopup({
                  isOpen: true,
                  message: `Payment cancelled (Part ${order.part_number}).`,
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
      setorderid(response.drone_order_id);
      setpaytype(response.payment_type);

      redirectAfterPayment(`Full payment of ₹${(unitPrice * quantity).toLocaleString()} completed.`);

    } catch (error) {
      setPopup({
        isOpen: true,
        message: error?.message || "Payment failed.",
        type: "error",
      });
    } finally {
      setIsPaymentProcessing(false);
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
    setIsPaymentProcessing(true);

    try {
      const data = await createInstallmentPaymentOrder({
        email,
        quantity,
        amount,
        total_amount: unitPrice * quantity,
      });

      const order = data.order;

      const options = {
        key: order.razorpay_key,
        amount: order.amount * 100,
        currency: order.currency,
        name: "Pavaman Aviation Pvt Ltd",
        description: `Installment ${data.installment_number} of Drone Order`,
        order_id: order.razorpay_order_id,
        prefill: { email: order.email },
        notes: {
          drone_order_id: data.drone_order_id,
          part: data.installment_number,
        },
        handler: async () => {
          try {
            const statusRes = await axios.post(
              `${API_BASE_URL}/payment-status-check`,
              { payment_type: "installment" },
              { withCredentials: true }
            );

            const { remaining_amount = 0 } = statusRes.data;

            if (parseFloat(remaining_amount) <= 0) {
              redirectAfterPayment(`All installments completed successfully. Redirecting to dashboard...`);
            } else {
              setPopup({
                isOpen: true,
                message: `Installment payment of ₹${order.amount.toLocaleString()} successful. ₹${parseFloat(remaining_amount).toLocaleString()} remaining.`,
                type: "success",
              });
              setShowInstallmentPopup(false);
              setInstallmentAmount("");
            }
          } catch (err) {
            setPopup({
              isOpen: true,
              message: "Payment succeeded, but failed to verify remaining amount.",
              type: "warning",
            });
          }
        },
        modal: {
          ondismiss: () =>
            setPopup({
              isOpen: true,
              message: `Installment payment cancelled.`,
              type: "error",
            }),
        },
        theme: { color: "#1976d2" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      setInstallmentError(error?.message || "Failed to create installment order.");
    }
    finally {
      setIsPaymentProcessing(false);
    }
  };
  ;


  const redirectAfterPayment = (message) => {
    setPopup({
      isOpen: true,
      message,
      type: "success",
    });

    setTimeout(() => {
      setShowAddressPopup(true);  // Show address selection popup
      sessionStorage.setItem("just_paid", "true");
    }, 2000);
  };

  const handleInvoiceGenerate = async () => {
    setIsGeneratingInvoices(true);

   try {
  setIsGeneratingInvoices(true);

  // Step 0: Check payment status
  const paymentStatusRes = await axios.post(
    `${API_BASE_URL}/payment-status-check`,
    { customer_id, drone_order_id: droneOrderId, payment_type: paytype },
    {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    }
  );

  const drone_order_id = paymentStatusRes.data?.drone_order_id;
  const totalInvoiceStatus = paymentStatusRes.data?.total_invoice_status;

  const commonData = {
    customer_id,
    address_type: selectedAddressType,
    drone_order_id,
  };

  // Step 1: Generate DRONE invoice (optional)
  let droneInvoiceNumber = "";
  try {
    const droneResponse = await axios.post(
      `${API_BASE_URL}/create-invoice`,
      {
        ...commonData,
        invoice_for: "drone",
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (droneResponse.data.uni_no) {
      droneInvoiceNumber = droneResponse.data.uni_no;
    }
  } catch (droneErr) {
    const msg = droneErr?.response?.data?.message;
    if (!msg?.toLowerCase()?.includes("already exists")) {
      throw droneErr;
    }
  }

  // Step 2: If total_invoice_status = 0, proceed with Accessory & AMC
  if (totalInvoiceStatus === 0) {
    const uinList = droneInvoiceNumber
      ? droneInvoiceNumber.split(",").map((u) => u.trim())
      : [];

    const dependentPayloads = [
      {
        ...commonData,
        invoice_for: "accessory",
        uin_list: uinList,
      },
      {
        ...commonData,
        invoice_for: "amc",
        uin_list: uinList,
      },
    ];

    const dependentResponses = await Promise.all(
      dependentPayloads.map((p) =>
        axios
          .post(`${API_BASE_URL}/create-invoice`, p, {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          })
          .catch((err) => err.response) // Catch and process individual invoice errors
      )
    );

    const accessoryRes = dependentResponses[0].data;
    const amcRes = dependentResponses[1].data;

    const accessoryInvoiceNumber =
      accessoryRes.invoice_number || accessoryRes.invoice_no || "";
    const amcInvoiceNumber = amcRes.invoice_number || amcRes.invoice_no || "";

    // Step 3: Show popup success message
    setPopup({
      isOpen: true,
      message: `
      DRONE Invoice: ${droneInvoiceNumber || "Already exists"}
      ACCESSORY Invoice: ${accessoryInvoiceNumber || "Already exists"}
      AMC Invoice: ${amcInvoiceNumber || "Already exists"}
      Invoices generated successfully.`,
      type: "success",
    });
  } else {
    // total_invoice_status = 1, nothing to do
    setPopup({
      isOpen: true,
      message: `All invoices are already generated.`,
      type: "info",
    });
  }

  // Final redirect
  setShowAddressPopup(false);
  setTimeout(() => {
    navigate("/customer-dashboard");
  }, 3000);
} catch (error) {
  console.error("Invoice generation failed:", error);
  const errData = error?.response?.data;
  const msg = errData?.error || errData?.message || "Invoice generation failed.";
  setPopup({
    isOpen: true,
    message: msg,
    type: "error",
  });
} finally {
  setIsGeneratingInvoices(false);
}
}


  const [installmentSummary, setInstallmentSummary] = useState({
    total_amount: 0,
    total_paid: 0,
    remaining: 0,
    days_left: 90,
    installment_number: 1
  });

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
                  type="number"
                  min={1}
                  max={10}
                  value={quantity}
                  onChange={(e) => {
                    let val = parseInt(e.target.value) || 1;
                    if (val > 10) val = 10;
                    if (val < 1) val = 1;
                    setQuantity(val);
                  }}
                  // disabled={isPaymentProcessing}
                  disabled={isPaymentProcessing || (!isPaymentComplete && latestOrderId)}

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
            {/* {isPaymentComplete && (
              <tr>
                <td colSpan={3} style={{ textAlign: "center", color: "green" }}>
                  Previous Order ({latestOrderId}) payment is complete.
                </td>
              </tr>
            )} */}
          </tbody>
        </table>

        <div className='payment-note'>
          <strong>Note:</strong> I undertake to pay the above balance amount within <strong>90 days.</strong> In case I fail to pay the amount, <strong>Pavaman Aviation Pvt Ltd</strong> will deduct <strong>Rs 10,000/-</strong> towards its operational expenses and refund the balance within <strong>45 days</strong> after I request in writing for cancellation of this application to purchase TEJAS Drone.
        </div>

        <div className='payment-btns'>
          <button
            className='primary-button full-payment-btn'
            onClick={handleFullPayment}
            disabled={selectedPayment === "installment" || isPaymentProcessing || (!isPaymentComplete && latestOrderId)}
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
              <table className="popup-summary-table">
                <tbody>
                  <tr>
                    <td>Number of Drones</td>
                    <td>{quantity}</td>
                  </tr>
                  <tr>
                    <td>Total Amount Payable</td>
                    <td>₹{(unitPrice * quantity).toLocaleString("en-IN")}/-</td>
                  </tr>
                </tbody>
              </table>
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
              <table className="popup-summary-table">
                <tbody>
                  <tr>
                    <td>Number of Drones</td>
                    <td>{quantity}</td>
                  </tr>
                  <tr>
                    <td>Total Amount</td>
                    <td>₹{installmentSummary.total_amount.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td>Total Paid</td>
                    <td>₹{installmentSummary.total_paid.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td>Remaining</td>
                    <td>₹{installmentSummary.remaining.toLocaleString("en-IN")}</td>
                  </tr>
                  <tr>
                    <td>Installment #{installmentSummary.installment_number}</td>
                    <td>{installmentSummary.days_left} days left</td>
                  </tr>
                </tbody>
              </table>


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

        {showAddressPopup && (
          <div className="pay-popup-overlay">
            <div className="pay-popup-box">
              <h3 className="pay-popup-header">Agreement Address Selection</h3>
              <p>Which address should we use to generate your agreement?</p>

              <div className="address-options">
                <label>
                  <input
                    type="radio"
                    name="address"
                    value="present"
                    checked={selectedAddressType === "present"}
                    onChange={() => setSelectedAddressType("present")}
                  />
                  Present Address
                </label>
                <label>
                  <input
                    type="radio"
                    name="address"
                    value="permanent"
                    checked={selectedAddressType === "permanent"}
                    onChange={() => setSelectedAddressType("permanent")}
                  />
                  Permanent Address
                </label>
              </div>

              <div className="pay-popup-buttons">

                <button
                  className="primary-button"
                  onClick={handleInvoiceGenerate}
                  disabled={!selectedAddressType || isGeneratingInvoices}
                >
                  {isGeneratingInvoices ? "Generating..." : "Submit"}
                </button>
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