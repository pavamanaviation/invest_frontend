import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { FiMenu, FiX } from "react-icons/fi";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const navigate = useNavigate();

    const dropdownRef = useRef(null);
    const isLoggedIn = sessionStorage.getItem("is_logged_in") === "true";

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const toggleUserDropdown = () => {
        setShowUserDropdown((prev) => !prev);
    };
    const handleLogout = () => {
        sessionStorage.clear();
        navigate("/home", { replace: true });
        window.location.reload();
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowUserDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);
    return (
        <header className="pavaman-header">
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
                    <Link to="/services">Services</Link>
                    <Link to="">My Payments</Link>
                    <Link to="">Scheme Details</Link>

                </nav>

                <div className="login-buttons">
                    {!isLoggedIn ? (
                        <Link to="/login" className="login-btn">Login / Sign Up</Link>
                    ) : (
                        <div className="user-menu" ref={dropdownRef}>
                            <FaUserCircle
                                className="user-icon"
                                size={28}
                                onClick={toggleUserDropdown}
                            />
                            {showUserDropdown && (
                                <div className="dropdown-menu">
                                    <Link to="/my-account">My Account</Link>
                                    <Link to="/payment">My Payments</Link>
                                    <Link to="">Scheme Details</Link>

                                    <Link onClick={handleLogout}>Logout</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;