import React from 'react';
import './Header.css';

const Header = ({ cartItemCount, onCartClick }) => {
  return (
    <header className="site-header">
      <div className="header-container">
        <div className="logo-container">
          <h1 className="brand-name">
            Sushi<span className="brand-accent">NOVA</span>
          </h1>
        </div>
        
        <button className="cart-toggle" onClick={onCartClick} aria-label="Open Cart">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          {cartItemCount > 0 && (
            <span className="cart-badge animate-fade-in">{cartItemCount}</span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
