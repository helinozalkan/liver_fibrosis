import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 📌 Sayfa bileşenleri import ediliyor
import FormPage from "./pages/FormPage";
import LoginPage from "./pages/LoginPage.jsx";
import ResultPage from "./pages/ResultAndReportPage.js";
import DoktorGirisPage from "./pages/DoktorGirisPage";
import HastaListesiPage from "./pages/HastaListesiPage"; 
import HastaGecmisPage from "./pages/HastaGecmisPage"; 
import EvreDetayPage from "./pages/EvreDetayPage";
import NotEklePage from "./pages/NotEklePage"; 
import NotDetayPage from "./pages/NotDetayPage.jsx";

function App() {
  // 📌 Kullanıcının giriş yapıp yapmadığını tutan state
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 📌 Sayfa açıldığında localStorage'dan giriş bilgisi kontrol ediliyor
  useEffect(() => {
    const isAuth = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(isAuth);
  }, []);

  // 📌 Kullanıcı giriş yaptığında çağrılan fonksiyon
  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  // 📌 Kullanıcı çıkış yaptığında çağrılan fonksiyon
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 📌 Login sayfası */}
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {!isLoggedIn ? (
          // 📌 Eğer giriş yapılmadıysa her rota login sayfasına yönlendiriliyor
          <Route path="*" element={<Navigate to="/login" />} />
        ) : (
          <>
            {/* 📌 Giriş yapılmışsa erişilebilecek sayfalar */}
            <Route path="/" element={<FormPage onLogout={handleLogout} />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/doktor-giris" element={<DoktorGirisPage />} />
            <Route path="/hasta-listesi" element={<HastaListesiPage />} />
            <Route path="/hasta-gecmis" element={<HastaGecmisPage />} />
            <Route path="/not-ekle" element={<NotEklePage />} />
            <Route path="/not-detay" element={<NotDetayPage />} />
            <Route path="/evre-detay" element={<EvreDetayPage />} />

            {/* 📌 Tanımsız rota girilirse ana sayfaya yönlendir */}
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
