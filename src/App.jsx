import React, { useState } from 'react';
import InputText from './components/InputText';
import Button from './components/Button';
import Grid from './components/Grid';
import Spinner from './components/Spinner';
import './App.css';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const encodedSearchQuery = encodeURIComponent(searchQuery);
      const response = await fetch(`https://snowstorm-test.msal.gob.ar/MAIN/concepts?term=${encodedSearchQuery}&offset=0&limit=50`, {
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'es'
        }
      });
      if (!response.ok) {
        throw new Error('La solicitud no pudo completarse correctamente');
      }
      const data = await response.json();
      if (data.items) {
        const filteredData = data.items.filter(item => {
          // filtro los q tienen trastorno
          const hasTrastorno = item.fsn.term.includes('(trastorno)');
          // saco los SAI
          const noSAI = !item.fsn.term.includes('SAI');
          return hasTrastorno && noSAI;
        });
        const formattedData = filteredData.map(item => ({
          conceptId: item.conceptId,
          term: item.fsn.term
        }));
        setSearchResults(formattedData);
      }else {
        throw new Error('La respuesta de la API no contiene la propiedad "items"');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="contenedor">
        <div className="contH1">
        <h1>Nomenclador Snomed</h1>
        </div>
      <div className="contInputButton">
      <InputText
      value={searchQuery}
      onChange={setSearchQuery}
      onEnter={handleSearch}
    />
    <Button onClick={handleSearch}>Buscar</Button>
      </div>
 
      </div>
    
    <Grid data={searchResults} />
    {loading && <Spinner />}
  </div>
  );
}

export default App;
