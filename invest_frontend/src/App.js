import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import LoginPage from "./pages/Login/Login";
import Home from "./pages/HomePage/HomePage";
import SignupPage from "./pages/Signup/Signup";
import VerifyOtp from "./pages/VerifyOtp/VerifyOtp";
import PostSignupPage from "./pages/PostSignupDetails/PostSignupDetails";
import CustomerDashboard from "./pages/CustomerDashboard/CustomerDashboard";
import Kyc from "./pages/KYC/KYC";
import DronePayment from "./pages/Payment/Payment";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/post-signup" element={<PostSignupPage />} />

        <Route path="/home" element={<Home />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/user-kyc" element={<Kyc />} />
        <Route path="/payment" element={<DronePayment/>}/>
      </Routes>

    </Router>
  );
}

export default App;
