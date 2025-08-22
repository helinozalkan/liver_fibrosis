// KVKK uyumlu form dosyası (FormPage.js)
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PersonalInfoBar from "../components/PersonalInfoBar";
import "./FormPage.css";
import Chatbot from "../components/Chatbot";
import LoadingSpinner from "../components/LoadingSpinner";
import { data } from "./data";

// TC Kimlik No doğrulama fonksiyonu
const isValidTC = (tc) => {
  if (!/^\d{11}$/.test(tc)) return false;
  if (tc[0] === "0") return false;
  // Tek ve çift hanelerin toplamına göre 10. hane kontrolü
  const digits = tc.split("").map(Number);
  const sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
  const sumEven = digits[1] + digits[3] + digits[5] + digits[7];
  const digit10 = ((sumOdd * 7) - sumEven) % 10;
  if (digit10 !== digits[9]) return false;

  const total = digits.slice(0, 10).reduce((a, b) => a + b, 0);
  const digit11 = total % 10;
  if (digit11 !== digits[10]) return false;

  return true;
};

// Ortak Field bileşeni (input alanları için)
const Field = ({ label, value, onChange, type = "text" }) => (
  <div style={{ display: "flex", flexDirection: "column", minWidth: "150px" }}>
    <label
      style={{
        marginBottom: "5px",
        fontWeight: "bold",
        fontSize: "15px",
        color: "#547792",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "8px",
        borderRadius: "4px",
        border: "none",
        boxShadow: "5px 5px 5px rgba(33, 52, 72, 0.51)",
        fontSize: "14px",
        width: "150px",
        outline: "none",
      }}
      placeholder={`${label} giriniz`}
      step={type === "number" ? "1" : undefined}
      inputMode={type === "number" ? "numeric" : undefined}
      pattern={type === "number" ? "\\d*" : undefined}
    />
  </div>
);

const FormPage = ({ onLogout}) => {
  const navigate = useNavigate();
  // Hasta bilgileri state'leri
  const [tc, setTc] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  // Kan değerleri state'leri
  const [ast, setAst] = useState("");
  const [alt, setAlt] = useState("");
  const [alp, setAlp] = useState("");
  const [totalBilirubin, setTotalBilirubin] = useState("");
  const [directBilirubin, setDirectBilirubin] = useState("");
  const [albumin, setAlbumin] = useState("");
  const [agRatio, setAgRatio] = useState("");
  const [proteins, setProteins] = useState("");
  // Dosya ve görsel state'leri
  const [ultrasoundFile, setUltrasoundFile] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [kanDegeriDosyasi, setKanDegeriDosyasi] = useState(null);
  const [loading, setLoading] = useState(false);

  const [vlmOutput, setVlmOutput] = useState("");
  const [vlmLoading, setVlmLoading] = useState(false);
  // Ultrason görseli yükleme ve VLM analiz
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUltrasoundFile(file);
      setSelectedImage(URL.createObjectURL(file));

      

      const formData = new FormData();
      formData.append("Total_Bilirubin", totalBilirubin || "0");
      formData.append("Direct_Bilirubin", directBilirubin || "0");
      formData.append("ALP", alp || "0");
      formData.append("ALT", alt || "0");
      formData.append("AST", ast || "0");
      formData.append("Albumin", albumin || "0");
      formData.append("AG_Ratio", agRatio || "0");
      formData.append("Proteins", proteins || "0");
      formData.append("image", file);

      try {
        setVlmLoading(true);
        const response = await fetch("http://localhost:5001/predict", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("VLM API çağrısı başarısız.");
        const result = await response.json();

        setVlmOutput(result.vlm_explanation || "VLM çıktısı boş.");
      } catch (error) {
        setVlmOutput("VLM hatası: " + error.message);
      } finally {
        setVlmLoading(false);
      }
    }
  };
  // PDF ile kan değerlerini otomatik çekme
  const handleKanDegeriUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setKanDegeriDosyasi(file);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("http://localhost:5001/parse", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("PDF dosyası okunamadı.");
        const result = await response.json();

        console.log("Backend'den gelen sonuç:", result); // Backend yanıtını kontrol et

        // State güncellemeleri
        setAst(result.ast || "");
        setAlt(result.alt || "");
        setAlp(result.alp || "");
        setTotalBilirubin(result.totalBilirubin || "");
        setDirectBilirubin(result.directBilirubin || "");
        setAlbumin(result.albumin || "");
      

        // Debugging için input alanlarına yazılan değerleri kontrol et
        console.log("AST:", result.ast);
        console.log("ALT:", result.alt);
        console.log("ALP:", result.alp);
        console.log("Total Bilirubin:", result.totalBilirubin);
        console.log("Direct Bilirubin:", result.directBilirubin);
        console.log("Albumin:", result.albumin);
      } catch (error) {
        console.error("PDF işlenemedi:", error); // Hata mesajını konsola yazdır
        alert("PDF işlenemedi: " + error.message);
      }
    }
  };

  const handleSubmit = async () => {
    if (!isValidTC(tc)) {
      alert("Geçerli bir T.C. Kimlik numarası giriniz.");
      return;
    }

    if (!ultrasoundFile) {
      alert("Lütfen bir ultrason görüntüsü yükleyin.");
      return;
    }

    setLoading(true);
  
    try {
      // Kan verilerini JSON olarak backend'e gönderiyoruz, tarih otomatik
      const labResponse = await fetch("http://localhost:5001/lab_values", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tc,
          tarih: new Date().toISOString(),
          AST: Number(ast) || null,
          ALT: Number(alt) || null,
          ALP: Number(alp) || null,
          Protein: Number(proteins) || null,
          AG_Ratio: Number(agRatio) || null,
          Total_Bilirubin: Number(totalBilirubin) || null,
          Direkt_Bilirubin: Number(directBilirubin) || null,
          Albumin: Number(albumin) || null
        }),
      });

      if (!labResponse.ok) throw new Error("Laboratuvar verisi kaydedilemedi.");


    // Ultrason ve laboratuvar verilerini göndererek tahmin alma
    const formData = new FormData();
    formData.append("Total_Bilirubin", totalBilirubin || "0");
    formData.append("Direct_Bilirubin", directBilirubin || "0");
    formData.append("ALP", alp || "0");
    formData.append("ALT", alt || "0");
    formData.append("AST", ast || "0");
    formData.append("Proteins", proteins || "0");
    formData.append("Albumin", albumin || "0");
    formData.append("AG_Ratio", agRatio || "0");
    formData.append("image", ultrasoundFile);

    const predictResponse = await fetch("http://localhost:5001/predict", {
        method: "POST",
        body: formData,
      });

      if (!predictResponse.ok) throw new Error("Tahmin API çağrısı başarısız.");
      const result = await predictResponse.json();

      setLoading(false);

      // Sonuç sayfasına yönlendirme ve state gönderimi
      navigate("/result", {
        state: {
          tc,
          name,
          surname,
          age,
          gender,
          labValues: {
            Total_Bilirubin: totalBilirubin,
            Direct_Bilirubin: directBilirubin,
            ALP: alp,
            ALT: alt,
            AST: ast,
            Proteins: proteins,
            Albumin: albumin,
            AG_Ratio: agRatio,
          },
          ultrasoundImage: selectedImage,
          prediction: result.clinic_result,
          imagePrediction: result.image_result,
          confidence: result.confidence,
          llmExplanation: result.llm_explanation,
        },
      });
    } catch (error) {
      setLoading(false);
      alert("Tahmin sırasında bir hata oluştu: " + error.message);
    }
  };

  return (
    <div>
      <PersonalInfoBar onLogout={onLogout} />
      <Chatbot />
      <div className="formpage-container">
        <div className="formpage-image-section">
          <h2 className="formpage-title">Ultrason Görüntüsü</h2>
          <div
            className="formpage-image-box clickable-image-box"
            onClick={() => document.getElementById("imageUpload").click()}
          >
            {selectedImage ? (
              <img src={selectedImage} alt="Ultrason" className="formpage-ultrasound-img" />
            ) : (
              <img src="/images/image.png" alt="img" style={{ width: "100px", height: "100px" }} />
            )}
          </div>
          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            disabled={loading}
          />

          <h2 className="formpage-title">Ultrason Ön Yorumu</h2>
          <div
            className="vlmcikti"
            style={{
              marginTop: "28px",
              width: "100%",
              maxWidth: "570px",
              padding: "16px",
              backgroundColor: "#f9f4ec",
              border: "2px solid #c6b08c",
              borderRadius: "10px",
              boxShadow: "0 4px 12px #A08963",
              fontFamily: "Poppins, sans-serif",
              color: "#213448",
              textAlign: "left",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              overflow: "hidden",
              margin: "0 0 20px 30px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {vlmLoading ? "🔄 Görsel analiz ediliyor, lütfen bekleyin..." : (vlmOutput || "Henüz çıktı alınmadı.")}
          </div>
        </div>

        <div className="formpage-info-section">
        <h2 className="formpage-title">Hasta Bilgileri</h2>
          <div className="patient-info-container">
            <div className="formpage-fields-row">
  <Field
    label="T.C."
    value={tc}
    onChange={(val) => {
      if (/^\d*$/.test(val)) {
        setTc(val);
      }
    }}
  />
              <Field
                label="İsim"
                value={name}
                onChange={(val) => {
                  if (/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]*$/.test(val)) {
                    setName(val);
                  }
                }}
              />
              <Field
                label="Soyisim"
                value={surname}
                onChange={(val) => {
                  if (/^[a-zA-ZçÇğĞıİöÖşŞüÜ\s]*$/.test(val)) {
                    setSurname(val);
                  }
                }}
              />
              <Field
                label="Yaş"
                value={age}
                onChange={(val) => {
                  if (/^\d*$/.test(val)) {
                    setAge(val);
                  }
                }}
                type="number"
              />
              <div
                style={{ display: "flex", flexDirection: "column", minWidth: "150px" }}
              >
                <label
                  style={{
                    marginBottom: "5px",
                    fontWeight: "bold",
                    fontSize: "15px",
                    color: "#547792",
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  Cinsiyet
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "none",
                    boxShadow: "5px 5px 5px rgba(33, 52, 72, 0.51)",
                    fontSize: "14px",
                    width: "150px",
                    outline: "none",
                    fontFamily: "Poppins, sans-serif",
                  }}
                  disabled={loading}
                >
                  <option value="">Seçiniz</option>
                  <option value="Kadın">Kadın</option>
                  <option value="Erkek">Erkek</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>
            </div>
          </div>

          <h2 className="formpage-title">Kan Değerleri</h2>
          <div className="lab-values-container">
            
            <div style={{ marginBottom: "15px" }}>
              <button
                style={{
                  backgroundColor: "#213448",
                  color: "white",
                  padding: "0px 15px",
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "16px",
                  fontWeight: "400",
                  boxShadow: "0 4px 8px rgba(33, 52, 72, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onClick={() => document.getElementById("kanDegeriUpload").click()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#304a6e";
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 6px 12px rgba(33, 52, 72, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#213448";
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(33, 52, 72, 0.3)";
                }}
                disabled={loading}
              >
                <img
                  src="/images/pdf.png"
                  alt="PDF"
                  style={{ width: "30px", height: "30px", marginRight: "5px",marginTop:"15px"}}
                />
                PDF Olarak Yükle
                
              </button>



              <input
            id="kanDegeriUpload"
            type="file"
            accept="application/pdf"
            style={{ display: "none" }}
            onChange={handleKanDegeriUpload}
          />






              {kanDegeriDosyasi && (
                <span style={{ marginLeft: 10, fontSize: "14px" }}>
                  {kanDegeriDosyasi.name}
                </span>
              )}


<p style={{ color: "#913025ff", fontSize: "13px", marginTop: "8px", fontFamily: "Poppins, sans-serif" }}>
  *Kan değerlerini içeren PDF dosyasını yüklerseniz, manuel veri girişine gerek kalmaz. Sistem otomatik olarak değerleri algılar.
  
</p>



              <input
                id="kanDegeriUpload"
                type="file"
                accept="application/pdf"
                onChange={handleKanDegeriUpload}
                style={{ display: "none" }}
                disabled={loading}
              />
            </div>
            <div className="formpage-fields-row">
              <Field label="AST" value={ast} onChange={setAst} type="number" />
              <Field label="ALT" value={alt} onChange={setAlt} type="number" />
              <Field label="ALP" value={alp} onChange={setAlp} type="number" />
              <Field label="Protein" value={proteins} onChange={setProteins} type="number" />
              <Field label="AG Oranı" value={agRatio} onChange={setAgRatio} type="number" />
              <Field
                label="Total Bilirubin"
                value={totalBilirubin}
                onChange={setTotalBilirubin}
                type="number"
              />
              <Field
                label="Direkt Bilirubin"
                value={directBilirubin}
                onChange={setDirectBilirubin}
                type="number"
              />
              <Field label="Albumin" value={albumin} onChange={setAlbumin} type="number" />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="formpage-submit-btn"
            disabled={loading}
          >
            Tahmin Et
          </button>

          {loading && <LoadingSpinner />}
        </div>



      </div>
    </div>
  );
};

export default FormPage;
