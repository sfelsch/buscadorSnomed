import React, { useState } from 'react';
import Modal from '../components/Modal'; // Suponiendo que tienes un componente Modal
import '../styles/gridStyles.css';

const Grid = ({ data }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedConceptId, setSelectedConceptId] = useState('');
  const [cie10Code, setCie10Code] = useState('');

  const handleVerCie10Click = async (conceptId) => {
    setSelectedConceptId(conceptId);
    try {
      const response = await fetch(`https://snowstorm-test.msal.gob.ar/MAIN/members?referencedComponentId=${conceptId}&offset=0&limit=50`, {
  headers: {
    'Accept': 'application/json',
    'Accept-Language': 'en'
  }
});
      const jsonData = await response.json();
      const cie10Code = jsonData.items.find(item => item.additionalFields && item.additionalFields.mapTarget)?.additionalFields.mapTarget || 'Código no encontrado';
      // Obtener el primer código CIE-10 encontrado o mostrar un mensaje si no se encontró
      setCie10Code(cie10Code);
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching CIE-10 code:', error);
    }
  };

  return (
    <div>
      <table className="grid-table">
        <thead>
          <tr>
            <th>Concept ID</th>
            <th>Term</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.conceptId}</td>
              <td>{item.term}</td>
              <td>
                <button className="ver-cie-10" onClick={() => handleVerCie10Click(item.conceptId)}>Ver CIE-10</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        <h2>Código CIE-10 para el Concept ID: {selectedConceptId}</h2>
        <p>{cie10Code}</p>
        <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
      </Modal>
    </div>
  );
};

export default Grid;