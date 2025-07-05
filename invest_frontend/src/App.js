import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import LoginPage from "./pages/Login/Login";
import Home from "./pages/HomePage/HomePage";
import SignupPage from "./pages/Signup/Signup";
import VerifyOtp from "./pages/VerifyOtp/VerifyOtp";
import PostSignupPage from "./pages/PostSignupDetails/PostSignupDetails";
import CustomerDashboard from "./pages/CustomerDashboard/CustomerDashboard";
import Payment from "./pages/Payment/Payment";
import AdminRoutes from "./AdminRoutes";
import KYCPage from "./pages/KYC/KYC";
import InvestPlanA from "./pages/InvestPlanA/InvestPlanA";
import BankNomineeFormPage from "./pages/BankNomineeFormPage/BankNomineeFormPage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/*" element={<AdminRoutes />} />
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/post-signup" element={<PostSignupPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/user-kyc" element={<KYCPage />} />
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/plan-a-invest" element={<InvestPlanA/>}/>
        <Route path="/bank-nominee" element={<BankNomineeFormPage/>}/>

      </Routes>

    </Router>
  );
}

export default App;
