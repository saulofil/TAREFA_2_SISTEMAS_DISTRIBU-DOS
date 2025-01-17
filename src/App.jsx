import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css'; // Importando o arquivo de estilo

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countryNames = [
          'argentina', 'bolivia', 'brazil', 'chile', 'colombia',
          'ecuador', 'guyana', 'paraguay', 'peru', 'suriname',
          'uruguay', 'venezuela'
        ];

        const responses = await Promise.all(
          countryNames.map((countryName) =>
            axios.get(`https://restcountries.com/v3.1/name/${countryName}`)
          )
        );

        const allCountries = responses.map((response) => response.data[0]);
        setCountries(allCountries);
        setLoading(false);
      } catch (error) {
        setError('Erro ao buscar países');
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);

  const handleCountrySelect = (cca3) => {
    const country = countries.find((country) => country.cca3 === cca3);
    setSelectedCountry(country);
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <h1>Selecione um país da América do Sul</h1>
      <select onChange={(e) => handleCountrySelect(e.target.value)} className="select-country">
        <option value="">Selecione um país da América do Sul</option>
        {countries.map((country) => (
          <option key={country.cca3} value={country.cca3}>
            {country.name.common}
          </option>
        ))}
      </select>

      {selectedCountry && (
        <div className="country-details">
          <h2>{selectedCountry.name.common}</h2>
          <p><strong>Continente:</strong> {selectedCountry.region}</p>
          <p><strong>Capital:</strong> {selectedCountry.capital ? selectedCountry.capital[0] : 'Não disponível'}</p>
          <p><strong>Línguas:</strong> {selectedCountry.languages ? Object.values(selectedCountry.languages).join(', ') : 'Não disponível'}</p>
          <p><strong>Moeda:</strong> {selectedCountry.currencies ? Object.values(selectedCountry.currencies)[0].name : 'Não disponível'}</p>
          <p><strong>População:</strong> {selectedCountry.population}</p>
          <p><strong>Área (km²):</strong> {selectedCountry.area}</p>
          <p><strong>Fuso Horário:</strong> {selectedCountry.timezones ? selectedCountry.timezones[0] : 'Não disponível'}</p>
        </div>
      )}
    </div>
  );
};

export default App;
