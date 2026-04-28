import { useState } from 'react';
import './index.css';
import { categories, menuItems } from './data';
import Header from './components/Header';
import Hero from './components/Hero';
import CategoryNav from './components/CategoryNav';
import MenuList from './components/MenuList';
import Cart from './components/Cart';
import Footer from './components/Footer';

function App() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.id === item.id);
      if (existing) {
        return prevCart.map((i) => 
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    
    // Show Toast
    setToast(`${item.name} sepete eklendi!`);
    setTimeout(() => setToast(null), 2500);
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter(i => i.id !== itemId));
  };

  const updateQuantity = (itemId, change) => {
    setCart((prevCart) => prevCart.map(i => {
      if (i.id === itemId) {
        const newQty = i.quantity + change;
        return newQty > 0 ? { ...i, quantity: newQty } : i;
      }
      return i;
    }));
  };

  const filteredItems = menuItems.filter(item => item.categoryId === activeCategory);
  
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      <Header cartItemCount={cartItemCount} onCartClick={() => setIsCartOpen(true)} />
      <Hero />
      
      <main className="menu-sections">
        <CategoryNav 
          categories={categories} 
          activeCategory={activeCategory} 
          onSelectCategory={setActiveCategory} 
        />
        
        <MenuList items={filteredItems} onAddToCart={addToCart} />
      </main>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        total={cartTotal}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
      <Footer />
      
      {/* Toast Notification */}
      <div className={`toast-container ${toast ? 'show' : ''}`}>
        {toast && (
          <div className="toast-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '8px', color: '#1dd1a1'}}>
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
