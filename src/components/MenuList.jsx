
import React from 'react';
import './MenuList.css';

const MenuList = ({ items, onAddToCart }) => {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>Bu kategoride ürün bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="menu-list-container">
      <div className="menu-grid">
        {items.map((item) => (
          <div key={item.id} className="menu-card animate-fade-in">
            <div className="menu-card-image-wrap">
              <img src={item.image} alt={item.name} className="menu-card-image" loading="lazy" />
            </div>
            <div className="menu-card-content">
              <div>
                <h3 className="menu-card-title">{item.name}</h3>
                <p className="menu-card-desc">{item.description}</p>
              </div>
              <div className="menu-card-footer">
                <span className="menu-card-price">{item.price.toFixed(2)} ₺</span>
                <button
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(item)}
                  aria-label="Sepete Ekle"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Ekle
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuList;
