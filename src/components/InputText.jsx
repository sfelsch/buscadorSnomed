
import React from 'react';
import '../styles/inputStyles.css';

const InputText = ({ value, onChange, onEnter }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onEnter();
    }
  };

  return (
    <input
      className="input-text"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder="Ingresa tu búsqueda..."
    />
  );
};

export default InputText;