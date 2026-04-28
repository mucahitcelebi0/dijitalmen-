import React, { useState, useEffect } from 'react';
import './Hero.css';

const sliderData = [
  {
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=1600',
    title: 'Gerçek Asya Lezzeti',
    subtitle: 'Taptaze malzemeler, usta ellerden sushiler.'
  },
  {
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&q=80&w=1600',
    title: 'Özel Set Menüler',
    subtitle: 'En çok tercih edilen kombinasyonlar şimdi menüde.'
  },
  {
    image: 'https://images.unsplash.com/photo-1583623025817-d180a2221dce?auto=format&fit=crop&q=80&w=1600',
    title: 'Limitsiz Lezzet',
    subtitle: 'Sushilerinizi seçin, özenle hazırlayalım.'
  }
];

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000); // Change image every 5 seconds
    
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-slider">
      {sliderData.map((slide, index) => (
        <div 
          key={index}
          className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="hero-overlay"></div>
          
          {index === currentSlide && (
            <div className="hero-content">
              <h2 className="hero-title animate-slide-up">
                {slide.title.split(' ').map((word, i) => 
                  i === 1 ? <span key={i} className="highlight"> {word} </span> : <span key={i}>{word} </span>
                )}
              </h2>
              <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.2s', marginTop: '10px' }}>
                {slide.subtitle}
              </p>
            </div>
          )}
        </div>
      ))}
      
      {/* Slider Indicators */}
      <div className="slider-indicators">
        {sliderData.map((_, index) => (
          <button
            key={index}
            className={`indicator-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Slayt ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
