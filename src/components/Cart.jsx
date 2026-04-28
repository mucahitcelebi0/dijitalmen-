import React, { useState } from 'react';
import './Cart.css';

const Cart = ({ isOpen, onClose, items, total, onRemove, onUpdateQuantity }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    orderType: 'Gel-al Sipariş',
    paymentType: 'Nakit',
    address: '',
    notes: ''
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOrder = () => {
    if (!formData.name || !formData.phone) {
      alert('Lütfen ad soyad ve telefon bilgilerinizi giriniz.');
      return;
    }

    const phoneNumber = "905414748916"; 
    let orderText = `*🍣 SUSHİ NOVA YENİ SİPARİŞ*\n\n`;
    
    orderText += `👤 *Müşteri Bilgileri:*\n`;
    orderText += `Ad Soyad: ${formData.name}\n`;
    orderText += `Telefon: ${formData.phone}\n`;
    orderText += `Sipariş Tipi: ${formData.orderType}\n`;
    if (formData.orderType !== 'Gel-al Sipariş' && formData.address) {
      orderText += `Adres: ${formData.address}\n`;
    }
    orderText += `Ödeme Tipi: ${formData.paymentType}\n`;
    if (formData.notes) {
      orderText += `Not: ${formData.notes}\n`;
    }
    
    orderText += `\n🛒 *Sipariş Detayı:*\n`;
    items.forEach(item => {
      orderText += `• ${item.quantity}x ${item.name} - ${(item.price * item.quantity).toFixed(2)} ₺\n`;
    });
    
    orderText += `\n💵 *Genel Toplam: ${total.toFixed(2)} ₺*`;

    const encodedText = encodeURIComponent(orderText);
    const waUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    
    window.open(waUrl, '_blank');
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className={`cart-container ${isOpen ? 'open' : ''}`} onClick={e => e.stopPropagation()}>
        <div className="cart-header">
          <h2>Siparişim</h2>
          <button className="close-btn" onClick={onClose} aria-label="Kapat">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-body">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Sepetiniz şu an boş.</p>
              <button className="cart-empty-btn" onClick={onClose}>Menüye Dön</button>
            </div>
          ) : (
            <>
              <div className="cart-items-section">
                <ul className="cart-items">
                  {items.map(item => (
                    <li key={item.id} className="cart-item">
                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <span className="cart-item-price">{(item.price * item.quantity).toFixed(2)} ₺</span>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button onClick={() => onUpdateQuantity(item.id, -1)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => onUpdateQuantity(item.id, 1)}>+</button>
                        </div>
                        <button className="cart-item-remove" onClick={() => onRemove(item.id)}>Sil</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="cart-form-section">
                <h3 className="form-title">Teslimat & Ödeme Bilgileri</h3>
                
                <div className="form-group">
                  <label>Ad Soyad *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Adınız Soyadınız" required />
                </div>
                
                <div className="form-group">
                  <label>Telefon *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="05XX XXX XX XX" required />
                </div>

                <div className="form-group">
                  <label>Sipariş Tipi</label>
                  <div className="radio-group">
                    <label className={formData.orderType === 'Gel-al Sipariş' ? 'active' : ''}>
                      <input type="radio" name="orderType" value="Gel-al Sipariş" checked={formData.orderType === 'Gel-al Sipariş'} onChange={handleInputChange} />
                      Gel-al
                    </label>
                    <label className={formData.orderType === 'Paket Sipariş' ? 'active' : ''}>
                      <input type="radio" name="orderType" value="Paket Sipariş" checked={formData.orderType === 'Paket Sipariş'} onChange={handleInputChange} />
                      Paket
                    </label>
                    <label className={formData.orderType === 'Odaya Sipariş' ? 'active' : ''}>
                      <input type="radio" name="orderType" value="Odaya Sipariş" checked={formData.orderType === 'Odaya Sipariş'} onChange={handleInputChange} />
                      Odaya
                    </label>
                  </div>
                </div>

                {formData.orderType !== 'Gel-al Sipariş' && (
                  <div className="form-group animate-slide-down">
                    <label>{formData.orderType === 'Odaya Sipariş' ? 'Oda Numarası' : 'Açık Adres'}</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder={formData.orderType === 'Odaya Sipariş' ? 'Örn: Oda 302' : 'Sokak, bina no, daire no...'} rows="2"></textarea>
                  </div>
                )}

                <div className="form-group">
                  <label>Ödeme Tipi</label>
                  <div className="radio-group">
                    <label className={formData.paymentType === 'Nakit' ? 'active' : ''}>
                      <input type="radio" name="paymentType" value="Nakit" checked={formData.paymentType === 'Nakit'} onChange={handleInputChange} />
                      Nakit
                    </label>
                    <label className={formData.paymentType === 'Kredi Kartı' ? 'active' : ''}>
                      <input type="radio" name="paymentType" value="Kredi Kartı" checked={formData.paymentType === 'Kredi Kartı'} onChange={handleInputChange} />
                      Kredi Kartı
                    </label>
                    <label className={formData.paymentType === 'Havale/EFT' ? 'active' : ''}>
                      <input type="radio" name="paymentType" value="Havale/EFT" checked={formData.paymentType === 'Havale/EFT'} onChange={handleInputChange} />
                      Havale/EFT
                    </label>
                  </div>
                </div>

                {formData.paymentType === 'Havale/EFT' && (
                  <div className="info-box animate-slide-down">
                    <p><strong>Banka Bilgileri (Sushi Nova)</strong></p>
                    <p>TR99 0000 0000 0000 0000 0000 00</p>
                  </div>
                )}

                <div className="form-group">
                  <label>Sipariş Notu</label>
                  <textarea name="notes" value={formData.notes} onChange={handleInputChange} placeholder="Eklemek istedikleriniz..." rows="2"></textarea>
                </div>
              </div>
            </>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Toplam (KDV Dahil)</span>
              <span className="cart-total-price">{total.toFixed(2)} ₺</span>
            </div>
            <button className="checkout-btn" onClick={handleOrder}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
              </svg>
              WhatsApp ile İlet
            </button>
            <div style={{ textAlign: 'center', margin: '8px 0', fontSize: '0.85rem', color: '#adb5bd' }}>
              veya
            </div>
            <a href="tel:05414748916" className="checkout-btn-secondary" style={{ textDecoration: 'none' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px'}}>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              Arayarak İlet
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
