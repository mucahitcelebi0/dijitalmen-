import React from 'react';
import './Footer.css';

const Footer = () => {
  const addressQuery = encodeURIComponent("Sushinova – Sushi & Gel-Al, Küçükbakkalköy, Ali Ay Sk. NO:5/C, 34750 Ataşehir/İstanbul");
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${addressQuery}`;

  return (
    <footer className="site-footer" itemScope itemType="https://schema.org/Restaurant">
      <div className="footer-container">
        <h3 className="footer-title" itemProp="name">SUSHINOVA</h3>
        <p className="footer-tagline">Ataşehir Küçükbakkalköy Sushi &amp; Gel-Al · Gerçek Asya Lezzeti</p>
        <p className="footer-address" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
          <span itemProp="streetAddress">Küçükbakkalköy, Ali Ay Sk. No:5/C</span>,{' '}
          <span itemProp="postalCode">34750</span>{' '}
          <span itemProp="addressLocality">Ataşehir</span>/<span itemProp="addressRegion">İstanbul</span>
        </p>
        <p className="footer-hours">
          <strong>Çalışma Saatleri:</strong> Her gün 12:00 - 23:00
        </p>

        <div className="footer-actions">
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="footer-btn">
            Yol Tarifi
          </a>
          <a href="tel:+905340576558" className="footer-btn primary" itemProp="telephone">
            Arayarak Sipariş Ver · 0534 057 65 58
          </a>
        </div>

        <p className="footer-copy">
          &copy; {new Date().getFullYear()} SushiNOVA · Ataşehir Sushi Restoran · Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
