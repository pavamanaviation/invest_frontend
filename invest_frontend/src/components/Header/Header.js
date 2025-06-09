import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header className="pavaman-header">
            <div >

                <div className="pavaman-container">
                    <div className="menu-icon" onClick={toggleMobileMenu}>
                        {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </div>
                    <div className="logo">
                        <Link to="/home">PAVAMAN</Link>
                    </div>

                    <nav className={`nav-links ${mobileMenuOpen ? "active" : ""}`}>
                        <Link to="/home">Home</Link>
                        <Link to="/products">Our Products</Link>
                        <Link to="/about">About Us</Link>
                        <Link to="/tools">Tools</Link>
                        <Link to="/services">Services</Link>

                    </nav>
                    <div className="login-buttons">
                        <Link to="/login" className="login-btn">Login / Sign Up</Link>

                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;
