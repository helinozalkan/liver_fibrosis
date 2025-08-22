//  Bilgilendirme modal bileşeni: Kullanıcıya uygulama hakkında rehber görseller gösterir
import React, { useState } from "react";
import "./SystemInfoModal.css";
//  Modal içindeki rehber görselleri
const imageData = [
  { src: "/images/1.png"},
  { src: "/images/2.png"},
  { src: "/images/3.png"},
  { src: "/images/4.png"},
  { src: "/images/5.png"},
  { src: "/images/6.png"},
  { src: "/images/7.png"},
  { src: "/images/8.png"},
  { src: "/images/9.png"},
  { src: "/images/10.png"},
  { src: "/images/11.png"},
  { src: "/images/12.png"},
];

const SystemInfoModal = ({ onClose }) => {
  const [pageIndex, setPageIndex] = useState(0); //  Hangi sayfanın göründüğünü takip eder

  //  Sonraki sayfaya geçiş
  const nextPage = () => {
    if (pageIndex < imageData.length - 1) {
      setPageIndex(pageIndex + 1);
    }
  };

  //  Önceki sayfaya geçiş
  const prevPage = () => {
    if (pageIndex > 0) {
      setPageIndex(pageIndex - 1);
    }
  };

  const currentImage = imageData[pageIndex]; //  Şu anda gösterilen görsel

  return (
    <div className="modal-overlay"> {/*  Modal arka planı */}
      <div className="modal-content"> {/*  Modal kutusu */}
        <div className="modal-header"> {/*  Başlık ve kapatma butonu */}
          <h2>FibroCheck Bilgilendirme</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-body"> {/* 📌 Görseller ve açıklamalar */}
          <div className="modal-image-block">
            <img
              className="carousel-image enlarged"
              src={currentImage.src}
              alt={'Görsel ${pageIndex + 1}'}
            />
            <p className="image-description">{currentImage.desc}</p> {/* opsiyonel açıklama */}
          </div>
        </div>

        <div className="modal-footer"> {/*  Navigasyon ve son sayfa butonu */}
          <div className="footer-controls-fixed">
            <button onClick={prevPage} disabled={pageIndex === 0}>⬅</button>
            <span className="page-indicator">
              Sayfa {pageIndex + 1} / {imageData.length}
            </span>
            <button onClick={nextPage} disabled={pageIndex === imageData.length - 1}>➡</button>
          </div>

          {pageIndex === imageData.length - 1 && ( //  Son sayfadaysa "Anladım" butonu göster
            <button className="modal-button final-button" onClick={onClose}>
              Anladım
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemInfoModal;
