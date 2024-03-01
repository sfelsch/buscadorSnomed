import React from 'react';
import '../styles/inputStyles.css';
const InputText = ({ value, onChange }) => {
  return (
    <input
    className="input-text"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Ingresa tu búsqueda..."
    />
  );
};

export default InputText;