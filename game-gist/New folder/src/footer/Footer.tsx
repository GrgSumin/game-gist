import React from "react";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";
import "../App.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <h1>GameGist</h1>
        <p>Contact us: info@example.com</p>
        <p>&copy; 2024 Your Company</p>
        <p>All rights reserved</p>
      </div>
      <div className="footer-right">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebook />
        </a>
        <a
          href="https://www.twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
