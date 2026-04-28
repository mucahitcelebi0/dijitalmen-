import React from 'react';
import './Footer.css';

const Footer = () => {
  const addressQuery = encodeURIComponent("Sushinova – Sushi & Gel-Al, Küçükbakkalköy, Ali Ay Sk. NO:5/C, 34750 Ataşehir/İstanbul");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;

  return (
    <footer className="site-footer">
      <div className="footer-container">
        <h3 className="footer-title">SUSHINOVA</h3>
        <p className="footer-address">
          Küçükbakkalköy, Ali Ay Sk. No:5/C, 34750 Ataşehir/İstanbul
        </p>
        
        <div className="footer-actions">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="footer-btn">
            Yol Tarifi
          </a>
          <a href="tel:05555555555" className="footer-btn primary">
            Arayarak Sipariş Ver
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
