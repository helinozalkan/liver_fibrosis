// LoadingSpinner.js
// Bu bileşen sayfa veya veri yüklenirken kullanıcıya gösterilen spinner (yükleniyor) ekranıdır.
import React from "react";
import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
