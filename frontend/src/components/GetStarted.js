import React from 'react';
import './GetStarted.css';

const GetStarted = ({ onStart }) => {
  const scrollToTop = () => {
    document.getElementById('main-get-started-btn').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="get-started-container">

      {/* 1) Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>🛡️ ProcureShield AI</h1>
          <p className="subtitle">
            Unlock hidden risks. Empower transparency. No login required.
          </p>
          <button id="main-get-started-btn" className="get-started-btn" onClick={onStart}>
            🚀 Get Started
          </button>
        </div>
      </section>

      {/* 2) Why Use ProcureShield? (Second Row in the Middle) */}
      <section className="features-section">
        <h2>Why Use ProcureShield?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>AI-Powered Risk Scoring</h3>
            <p>Advanced fraud detection in real-time.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Analysis</h3>
            <p>Upload data and get instant insights.</p>
          </div>
          <div className="feature-card">
            <h3>Zero Setup Required</h3>
            <p>No login, no complex configurations.</p>
          </div>
        </div>
      </section>

      {/* 3) About Section */}
      <section className="about-section">
        <h2>What is ProcureShield AI?</h2>
        <p>
          ProcureShield AI is a next-generation fraud detection platform built 
          to protect public procurement from fraud, waste, and abuse. Using 
          cutting-edge machine learning, it analyzes procurement records in 
          real-time to flag suspicious transactions, detect fake vendors, and 
          identify high-risk contracts — before damage is done.
        </p>
      </section>

      {/* 4) Three-Grid Section: Built for Governments, Auditors, Procurement Teams */}
      <section className="stakeholders-section">
        <h2>Built for Governments, Auditors &amp; Procurement Teams</h2>
        <div className="stakeholders-grid">
          <div className="stakeholder-box">
            <h3>Governments</h3>
            <p>
              Monitor vendor behavior at scale. Gain immediate visibility into 
              high-risk contracts to safeguard public resources.
            </p>
          </div>
          <div className="stakeholder-box">
            <h3>Auditors</h3>
            <p>
              Quickly uncover patterns of fraud or waste with AI-powered insights 
              and downloadable reports for transparent, data-backed audits.
            </p>
          </div>
          <div className="stakeholder-box">
            <h3>Procurement Teams</h3>
            <p>
              Spot potential red flags in supplier bids, identify fake vendors, 
              and maintain a clean procurement pipeline with minimal overhead.
            </p>
          </div>
        </div>
      </section>

      {/* 5) Final Call Section */}
      <section className="final-call-section">
        <p className="final-call">
          <strong>Ready to uncover what’s hidden in your data?</strong><br />
          Click “Get Started” to upload your procurement records and begin 
          your fraud-free journey.
        </p>
        <button className="get-started-btn" onClick={scrollToTop}>
          🚀 Get Started
        </button>
        <p className="support-note">
          Need help? Visit our Help section or contact the team — we’re here 
          to support your mission for clean, accountable governance.
        </p>
      </section>

    </div>
  );
};

export default GetStarted;
