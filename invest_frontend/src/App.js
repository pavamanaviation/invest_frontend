import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header/Header";
import LoginPage from "./pages/Login/Login";
import Home from "./pages/HomePage/HomePage";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
       <Route path="/login" element={<LoginPage/>} />
       <Route path="/home" element={<Home/>}/>
      </Routes>

    </Router>
  );
}

export default App;
