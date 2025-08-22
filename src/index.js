// Ana giriş dosyası: React uygulamasını DOM'a bağlar
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import './index.css';
// React kök elementini oluştur ve App bileşenini render et
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
