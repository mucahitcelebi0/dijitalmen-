import React from 'react';
import './CategoryNav.css';

const CategoryNav = ({ categories, activeCategory, onSelectCategory }) => {
  return (
    <nav className="category-nav">
      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat.id} className="category-item">
            <button
              className={`category-button ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default CategoryNav;
