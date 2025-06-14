import React, { useState, useEffect } from "react";
import "./HomePage.css";
import { FaCheckCircle } from "react-icons/fa";
import sampleImage from "../../assets/sample-1.png";
import revenuemodel from "../../assets/revenuemodel.jpg";
import agritech from "../../assets/agritech.png"
import fixedreturns from "../../assets/fixed returns.png"
import zero from "../../assets/zero maintainence.png"
import trust from "../../assets/trust.png"
import PopupMessage from "../../components/PopupMessage/PopupMessage";
import { useLocation, useNavigate } from "react-router-dom";

const Home = () => {
    const navigate = useNavigate();

    const customer_id = sessionStorage.getItem("customer_id");
    const [popup, setPopup] = useState({
        isOpen: false,
        message: "",
        type: "info",
    });

    const handleExploreBtn = () => {
        if (!customer_id) {
            setPopup({ isOpen: true, message: "Please log in to view this page", type: "info", });
            setTimeout(() => { navigate("/login"); }, 3000);
            return;
        }
        navigate("/customer-dashboard");
    }
    return (
        <div className="homepage">
            <PopupMessage
                isOpen={popup.isOpen}
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, isOpen: false })}
            />
            <div className="home-hero-section  container">
                <div className="home-hero-content">
                    <div className="home-hero-heading"><span>High Yield</span> Investment Platform</div>
                    <div className="home-hero-text">
                        <div><span className="home-hero-icon"><FaCheckCircle /></span><p><span className="home-hero-bold">High returns </span>of up to 18%* annually</p></div>
                        <div><span className="home-hero-icon"><FaCheckCircle /></span><p><span className="home-hero-bold">Stability </span>of fixed-income</p></div>
                    </div>
                    <div className="home-hero-button ">
                        <button className="primary-button" onClick={handleExploreBtn}>Explore Investment</button>
                    </div>
                </div>

                <div className="home-hero-video">
                    <div className="video-wrapper">

                        <iframe
                            width="560"
                            height="315"
                            src="https://www.youtube.com/embed/JA1d6S14Txg?controls=1"
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            </div>

            <div className="home-metrics-section">
                <div className="container">
                    <div className="home-metrics-container">
                        <div className="home-metrics-content">
                            <div className="home-metrics-image"> <img src={fixedreturns} /></div>
                            <div className="home-metrics-text"> Fixed Returns</div>
                            <div className="home-metrics-text-caption">No market risk</div>
                        </div>
                        <div className="home-metrics-content">
                            <div className="home-metrics-image"> <img src={zero} /></div>
                            <div className="home-metrics-text">Zero Maintenance Hassle </div>
                            <div className="home-metrics-text-caption">We take careof everything</div>
                        </div>
                        <div className="home-metrics-content">
                            <div className="home-metrics-image"> <img src={agritech} /></div>
                            <div className="home-metrics-text"> Agri Tech Investment</div>
                            <div className="home-metrics-text-caption">Promoting green innovation</div>
                        </div>
                        <div className="home-metrics-content">
                            <div className="home-metrics-image"> <img src={trust} /></div>
                            <div className="home-metrics-text">Kapil Group Product</div>
                            <div className="home-metrics-text-caption">45+ years of trust</div>
                        </div>
                    </div>
                </div>

            </div>
            <div className="home-revenue-model container">
                <div>
                    <img src={revenuemodel} className="home-revenue-image" />
                </div>
            </div>
        </div>
    );

}

export default Home;