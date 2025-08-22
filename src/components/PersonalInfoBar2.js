import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import SystemInfoModal from "./SystemInfoModal";

// Kullanıcı Bilgi ve Menü Çubuğu Bileşeni (Responsive ve Şifre Popup Destekli)
const PersonalInfoBar2 = ({ onLogout }) => {
  // State tanımlamaları
  const [userName, setUserName] = useState(""); // Kullanıcı adı
  const [menuOpen, setMenuOpen] = useState(false); // Menü açık/kapalı durumu
  const [passwordPopup, setPasswordPopup] = useState(false); // Şifre popup durumu
  const [password, setPassword] = useState(""); // Şifre input değeri
  const [error, setError] = useState(""); // Hata mesajı
  const [showModal, setShowModal] = useState(false); // Yardım modal durumu
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Pencere genişliği (responsive için)
  const navigate = useNavigate();

  // Component mount edildiğinde kullanıcı adı al, modal kontrolü yap ve pencere resize listener ekle
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);

    const modalKey = `hasSeenSystemInfoModal_${storedName || "guest"}`;
    const hasSeenModal = localStorage.getItem(modalKey);
    if (!hasSeenModal) {
      setShowModal(true);
      localStorage.setItem(modalKey, "true");
    }

    // Pencere boyutu değişikliklerini takip et
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    // Component unmount olduğunda event listener temizle
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Kullanıcının adının ilk harfi (profil simgesi için)
  const firstLetter = userName?.charAt(0).toUpperCase();

  // Şifre kontrol fonksiyonu
  const handleCheckPassword = () => {
    if (password === "1234") {
      setPasswordPopup(false);
      setPassword("");
      setError("");
      navigate("/doktor-giris"); // Başarılı şifre sonrası yönlendirme
    } else {
      setError("Şifre hatalı. Lütfen tekrar deneyin.");
    }
  };

  // Küçük ekran kontrolü (responsive)
  const isSmallScreen = windowWidth <= 768; // Breakpoint isteğe göre değiştirilebilir

  return (
    <div
      style={{
        backgroundColor: "#213448",
        padding: isSmallScreen ? "10px 15px" : "10px 30px",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        minHeight: "60px",
        boxSizing: "border-box",
        position: "relative",
        flexWrap: isSmallScreen ? "wrap" : "nowrap",
        gap: isSmallScreen ? "10px" : "0",
      }}
    >
      {/* Logo */}
      <img
        src="/images/istun.logo.white.png"
        alt="İstun Logo"
        style={{
          height: isSmallScreen ? "25px" : "35px",
          transform: isSmallScreen ? "scale(1.5)" : "scale(1.8)",
          transformOrigin: "left center",
        }}
      />

      {/* Uygulama İsmi */}
      <div
        style={{
          flex: isSmallScreen ? "1 1 100%" : "0.35",
          textAlign: "center",
          fontStyle: "italic",
          fontSize: isSmallScreen ? "20px" : "35px",
          color: "#ffffffff",
          order: isSmallScreen ? 3 : "unset",
          marginTop: isSmallScreen ? "10px" : "0",
        }}
      >
        FibroCheck
      </div>

      {/* Panel başlığı */}
      <div
        style={{
          flex: isSmallScreen ? "1 1 100%" : "1",
          textAlign: "center",
          fontSize: isSmallScreen ? "16px" : "30px",
          color: "#ffffffff",
          order: isSmallScreen ? 4 : "unset",
          marginTop: isSmallScreen ? "5px" : "0",
        }}
      >
        Doktor Paneli
      </div>

      {/* Sağ Panel: Kullanıcı Menüsü */}
      <div
        style={{
          position: "relative",
          marginLeft: isSmallScreen ? "auto" : "0",
          order: isSmallScreen ? 2 : "unset",
        }}
      >
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
            {/* Ana Sayfa */}
            <div
              style={menuItemStyle}
              onClick={() => {
                setMenuOpen(false);
                navigate("/form");
              }}
            >
              👨‍⚕️ Ana Sayfa
            </div>

            {/* Yardım */}
            <div style={menuItemStyle} onClick={() => setShowModal(true)}>
              ❓ Yardım
            </div>

            {/* Çıkış */}
            <div
              style={{ ...menuItemStyle, color: "#c0392b", fontWeight: "bold" }}
              onClick={() => {
                setMenuOpen(false);
                localStorage.removeItem("userName");
                onLogout();
                navigate("/login");
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
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "30px",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
              width: isSmallScreen ? "90%" : "300px",
              maxWidth: "300px",
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
            <h3
              style={{
                marginBottom: "25px",
                fontWeight: "bold",
                fontSize: isSmallScreen ? "18px" : "20px",
                color: "#213448",
              }}
            >
              Lütfen şifrenizi giriniz
            </h3>

            {/* Şifre input */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
  padding: "10px 16px",
  cursor: "pointer",
  borderBottom: "1px solid #eee",
  display: "flex",
  alignItems: "center",
};

export default PersonalInfoBar2;
