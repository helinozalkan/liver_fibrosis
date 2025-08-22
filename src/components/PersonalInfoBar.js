import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import SystemInfoModal from "./SystemInfoModal";

// Kullanıcı Bilgi ve Menü Çubuğu Bileşeni
const PersonalInfoBar = ({ onLogout }) => {
  // State tanımlamaları
  const [userName, setUserName] = useState(""); // Kullanıcı adı
  const [menuOpen, setMenuOpen] = useState(false); // Menü açık/kapalı durumu
  const [passwordPopup, setPasswordPopup] = useState(false); // Şifre popup durumu
  const [password, setPassword] = useState(""); // Şifre input değeri
  const [error, setError] = useState(""); // Hata mesajı
  const [showModal, setShowModal] = useState(false); // Yardım modal durumu
  const navigate = useNavigate();

  // Component mount edildiğinde kullanıcı adını al ve modal kontrolü yap
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
    const modalKey = `hasSeenSystemInfoModal_${storedName || "guest"}`;
    const hasSeenModal = localStorage.getItem(modalKey);
    if (!hasSeenModal) {
      setShowModal(true);
      localStorage.setItem(modalKey, "true");
    }
  }, []);

  // Kullanıcının adının ilk harfi (profil simgesi için)
  const firstLetter = userName?.charAt(0).toUpperCase();

  // Şifre kontrol fonksiyonu
  const handleCheckPassword = () => {
    if (password === "1234") {
      setPasswordPopup(false);
      setPassword("");
      setError("");
      navigate("/doktor-giris");
    } else {
      setError("Şifre hatalı. Lütfen tekrar deneyin.");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#213448",
        padding: "10px 30px",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100vw",
        height: "60px",
        boxSizing: "border-box",
        position: "relative",
      }}
    >
      {/* Logo */}
      <img
        src="/images/istun.logo.white.png"
        alt="İstun Logo"
        style={{
          height: "35px",
          transform: "scale(1.8)",
          transformOrigin: "left center",
        }}
      />

      {/* Uygulama İsmi */}
      <div
        style={{
          flex: 0.3,
          textAlign: "center",
          fontStyle: "italic",
          fontSize: "35px",
          color: "#ffffffff",
        }}
      >
        FibroCheck
      </div>

      {/* Slogan */}
      <div
        style={{
          flex: 1,
          textAlign: "center",
          fontStyle: "italic",
          fontSize: "30px",
          color: "#ffffffff",
        }}
      >
        "Erken teşhis hayat kurtarır!"
      </div>

      {/* Sağ Panel: Kullanıcı Menüsü */}
      <div style={{ position: "relative" }}>
        {/* Menü başlığı ve açma/kapama */}
        <div
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            backgroundColor: "#ffffff33",
            borderRadius: "20px",
            padding: "5px 10px",
          }}
        >
          {/* Profil simgesi */}
          <div
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              backgroundColor: "white",
              color: "#213448",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "14px",
              marginRight: "8px",
            }}
          >
            {firstLetter}
          </div>

          {/* Kullanıcı adı */}
          <div style={{ fontWeight: "bold", color: "white", marginRight: "5px" }}>
            {userName}
          </div>

          {/* Menü ikonu */}
          {menuOpen ? <FaChevronUp color="white" /> : <FaChevronDown color="white" />}
        </div>

        {/* Menü içerikleri */}
        {menuOpen && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "100%",
              marginTop: "8px",
              backgroundColor: "white",
              color: "#213448",
              borderRadius: "8px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
              zIndex: 999,
              overflow: "hidden",
              minWidth: "170px",
            }}
          >
            {/* Hastalarım butonu */}
            <div
              style={menuItemStyle}
              onClick={() => setPasswordPopup(true)}
            >
              👨‍⚕️ Hastalarım
            </div>

            {/* Yardım butonu */}
            <div
              style={menuItemStyle}
              onClick={() => setShowModal(true)}
            >
              ❓ Yardım
            </div>

            {/* Çıkış butonu */}
            <div
              style={{ ...menuItemStyle, color: "#c0392b", fontWeight: "bold" }}
              onClick={() => {
                localStorage.removeItem("userName");
                onLogout();
              }}
            >
              <FiLogOut style={{ marginRight: "6px" }} />
              Çıkış Yap
            </div>
          </div>
        )}
      </div>

      {/* Şifre Giriş Popup */}
      {passwordPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px 30px 20px 30px",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              width: "300px",
              textAlign: "center",
              position: "relative",
            }}
          >
            {/* Çarpı butonu */}
            <button
              onClick={() => {
                setPassword("");
                setPasswordPopup(false);
                setError("");
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "transparent",
                border: "none",
                fontSize: "18px",
                cursor: "pointer",
                fontWeight: "bold",
                color: "#213448",
                lineHeight: 1,
              }}
              aria-label="Kapat"
            >
              ×
            </button>

            {/* Başlık */}
            <h3 style={{ marginBottom: "25px", fontWeight: "bold", fontSize: "20px", color: "#213448" }}>
              Lütfen şifrenizi giriniz
            </h3>

            {/* Şifre input */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCheckPassword()}
              style={{
                width: "100%",
                padding: "10px 4px",
                borderRadius: "8px",
                border: "1.5px solid #ccc",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                fontSize: "16px",
                fontWeight: "500",
                outline: "none",
                transition: "border-color 0.3s ease, box-shadow 0.3s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#213448";
                e.target.style.boxShadow = "0 0 8px rgba(33, 52, 72, 0.6)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#ccc";
                e.target.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
              }}
            />

            {/* Hata mesajı */}
            {error && (
              <div style={{ color: "red", marginTop: "8px", fontSize: "14px" }}>{error}</div>
            )}

            {/* Devam butonu */}
            <div style={{ marginTop: "20px", display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={handleCheckPassword}
                style={{
                  padding: "8px 16px",
                  borderRadius: "5px",
                  border: "none",
                  backgroundColor: "#213448",
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Devam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Yardım Modal */}
      {showModal && <SystemInfoModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

// Menü öğeleri stili
const menuItemStyle = {
  padding: "12px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
  display: "flex",
  alignItems: "center",
};

export default PersonalInfoBar;
