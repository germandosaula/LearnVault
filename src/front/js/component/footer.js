import React from "react";
import "../../styles/footer.css";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <ul className="footer-links">
          <li><a href="#">How it works</a></li>
          <li><a href="#">Terms and Conditions</a></li>
          <li><a href="#">Privacy Policy</a></li>
        </ul>
        <div className="footer-brand">
          <p>© 2025 LearnVault</p>
        </div>
      </div>
    </footer>
  );
};