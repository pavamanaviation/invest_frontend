import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import LoginPage from "./pages/Login/Login";
import Home from "./pages/HomePage/HomePage";
import SignupPage from "./pages/Signup/Signup";
import VerifyOtp from "./pages/VerifyOtp/VerifyOtp";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/signup" element={<SignupPage/>} />
       <Route path="/login" element={<LoginPage/>} />
       <Route path="/verify-otp" element={<VerifyOtp/>} />

       <Route path="/home" element={<Home/>}/>
      </Routes>

    </Router>
  );
}

export default App;
