import React, { useState } from 'react';
import Modal from '../components/Modal';
import '../styles/gridStyles.css';

const isValidCIE10Code = (code) => {
  const regex = /^[A-TV-Z][0-9]{2}\.[0-9]*$/;
  return regex.test(code);
};

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text)
    .then(() => console.log('Texto copiado al portapapeles:', text))
    .catch((error) => console.error('Error al copiar al portapapeles:', error));
};

const escapeCsvCell = (cell) => {
  
  if (cell.includes(',')) {
    return `"${cell}"`;
  }
  return cell;
};

const exportToCsv = (filename, data) => {
  const csvContent = "data:text/csv;charset=utf-8," +
    data.map(row => row.map(cell => escapeCsvCell(cell)).join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
};

const Grid = ({ data }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedConceptId, setSelectedConceptId] = useState('');
  const [cie10Code, setCie10Code] = useState('');
  const [isValidCode, setIsValidCode] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 7;

  const handleVerCie10Click = async (conceptId) => {
    setSelectedConceptId(conceptId);
    try {
      const response = await fetch(`/snowstorm/MAIN/members?referencedComponentId=${conceptId}`, {
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en'
        }
      });
      const jsonData = await response.json();

      let cie10Code = 'Código no encontrado';
      for (const item of jsonData.items) {
        if (item.additionalFields && item.additionalFields.mapTarget && isValidCIE10Code(item.additionalFields.mapTarget)) {
          cie10Code = item.additionalFields.mapTarget;
          break;
        }
      }

      if (cie10Code !== 'Código no encontrado') {
        setIsValidCode(true);
        setCie10Code(cie10Code);
        setModalIsOpen(true);
      } else {
        setIsValidCode(false);
        setModalIsOpen(true); // Abrir el modal cuando no se encuentra el código CIE-10
      }
    } catch (error) {
      console.error('Error fetching CIE-10 code:', error);
    }
  };

  const handleExportClick = () => {
    exportToCsv('grid_data.csv', data.map(row => [row.conceptId, row.term]));
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = data.slice(indexOfFirstResult, indexOfLastResult);

  return (
    <div>
      <div className="divGrid">
        <table className="grid-table">
          <thead>
            <tr>
              <th>Concept ID</th>
              <th>Diagnósticos</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentResults.map((item, index) => (
              <tr key={index}>
                <td>{item.conceptId}</td>
                <td>{item.term}</td>
                <td>
                  <button className="ver-cie-10" onClick={() => handleVerCie10Click(item.conceptId)}>CIE-10</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        {Array.from({ length: Math.ceil(data.length / resultsPerPage) }, (_, index) => (
          <button key={index + 1} onClick={() => handlePageChange(index + 1)}>{index + 1}</button>
        ))}
      </div>
      <div className="contenedorExportar">
        <button onClick={handleExportClick} className='botonExportar'>Exportar a CSV</button>
      </div>
      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
        {isValidCode ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h2 style={{ marginRight: '10px' }}>Código CIE-10: {cie10Code}</h2>
              <button className="copy-button" onClick={() => copyToClipboard(cie10Code)}>
                <img src="/src/img/copiar.png" alt="Copiar" style={{ width: '17px'}} />
              </button>
            </div>
            <button onClick={() => setModalIsOpen(false)}>Cerrar</button>
          </>
        ) : (
          <>
            <h2>Error</h2>
            <p>El código CIE-10 no es válido.</p>
            <button onClick={() => setModalIsOpen(false)}>Aceptar</button>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Grid;
