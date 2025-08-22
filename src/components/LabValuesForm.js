import React from "react";
import "./LabValuesForm.css";

const LabValuesForm = () => {
  // Tüm laboratuvar alanları burada tanımlanıyor
  const fields = [
    { label: "AST (Aspartat Aminotransferaz)", placeholder: "AST değeri", step: "0.01" },
    { label: "ALT (Alanin Aminotransferaz)", placeholder: "ALT değeri", step: "0.01" },
    { label: "ALP (Alkalen Fosfataz)", placeholder: "ALP değeri", step: "0.01" },
    { label: "Total Bilirubin", placeholder: "Total Bilirubin", step: "0.01" },
    { label: "Direkt Bilirubin", placeholder: "Direkt Bilirubin", step: "0.01" },
    { label: "Albumin", placeholder: "Albumin", step: "0.01" },
    { label: "INR (International Normalized Ratio)", placeholder: "INR", step: "0.01" },
    { label: "LDH", placeholder: "LDH", step: "0.01" },
    { label: "Tam kan sayımı (CBC)", placeholder: "CBC", step: "1" },
  ];

  return (
    <div className="lab-values-form">
      {fields.map((field, index) => (
        <div className="form-field" key={index}>
          <label>{field.label}</label>
          <input
            type="number"
            step={field.step}
            placeholder={field.placeholder}
          />
        </div>
      ))}
    </div>
  );
};

export default LabValuesForm;
