import React from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaChevronUp,
} from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Section */}
        <div className="footer-contact">
          <ul>
            <li className="footer-item">
              <FaMapMarkerAlt className="footer-icon" />
              <div>
                <strong>Hengam Street</strong>
                <br />
                Tehran, Iran
              </div>
            </li>
            <li className="footer-item">
              <FaPhoneAlt className="footer-icon" />
              <span>+1 555 123456</span>
            </li>
            <li className="footer-item">
              <FaEnvelope className="footer-icon" />
              <a href="mailto:support@company.com" className="footer-link">
                support@company.com
              </a>
            </li>
          </ul>
        </div>

        {/* About Section */}
        <div className="footer-about">
          <h3>About the Company</h3>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            euismod convallis velit, eu auctor lacus vehicula sit amet.
          </p>
        </div>

        {/* Social Media Section */}
        <div className="footer-social">
          <h3>Social Media</h3>
          <div className="social-links">
            <a href="#" className="footer-social-link" aria-label="Facebook">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="footer-social-link" aria-label="Twitter">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="footer-social-link" aria-label="LinkedIn">
              <FaLinkedin size={24} />
            </a>
            <a href="#" className="footer-social-link" aria-label="GitHub">
              <FaGithub size={24} />
            </a>
          </div>
        </div>
      <button className="scroll-to-top" onClick={scrollToTop} aria-label="Scroll to Top">
        <FaChevronUp size={20} />
      </button>
      </div>


    </footer>
  );
};

export default Footer;