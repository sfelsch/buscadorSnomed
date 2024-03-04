import React, { useState } from 'react';
import InputText from './components/InputText';
import Button from './components/Button';
import Grid from './components/Grid';
import './App.css'

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
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
        const formattedData = data.items.map(item => ({
          conceptId: item.conceptId,
          term: item.fsn.term
        }));
        setSearchResults(formattedData);
      } else {
        throw new Error('La respuesta de la API no contiene la propiedad "items"');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <h1>Nomenclador Snomed</h1>
      <InputText 
        value={searchQuery} 
        onChange={setSearchQuery} 
        onEnter={handleSearch}
      />
      <Button onClick={handleSearch}>Buscar</Button>
      <Grid data={searchResults} />
    </div>
  );
}

export default App;