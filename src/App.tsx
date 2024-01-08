// App.tsx

import './App.css';
import React, { useReducer, useEffect, useCallback} from 'react';
import axios from 'axios';
import cryptoLogo from './img/1.jpg';
import cryptoLogo1 from './img/2.jpg';
import cryptoLogo2 from './img/3.jpg';
import cryptoLogo3 from './img/4.jpg';
import cryptoLogo4 from './img/5.jpg';
import cryptoLogo5 from './img/6.jpg';
import cryptoLogo6 from './img/7.jpg';
import cryptoLogo7 from './img/8.jpg';
import cryptoLogo8 from './img/9.jpg';
import { useState } from 'react';
import { io, Socket } from 'socket.io-client';



interface State {
  data: Record<string, { usd: number; eur: number }> | null;
  searchTerm: string;
  searchResults: Record<string, { usd: number; eur: number }> | null;
  loading: boolean;
  error: string | null;
  currency: 'usd' | 'eur';
  searchClicked: boolean;
}

interface Action {
  type: string;
  payload: any;
}

interface CryptoPriceProps {
  data: Record<string, { usd: number; eur: number }>;
  currency: 'usd' | 'eur';
}

type FetchData = () => Promise<void>;

const initialState: State = {
  data: null,
  searchTerm: '',
  searchResults: null,
  loading: false,
  error: null,
  currency: 'usd',
  searchClicked: false,
};

const reducer: React.Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'SET_DATA':
      return { ...state, data: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'SET_SEARCH_CLICKED':
      return { ...state, searchClicked: action.payload };
    default:
      return state;
  }
};

const CryptoPrice: React.FC<CryptoPriceProps> = ({ data, currency }) => {
  return (
    <div>
      <h1 className="crypto-title">Crypto Prices</h1>
      {Object.keys(data).map((crypto) => (
        <div key={crypto}>
          <h2 className="crypto-name">{crypto}</h2>
          {currency === 'usd' ? (
            <p>Current price in $: {data[crypto].usd}</p>
          ) : (
            <p>Current price in €: {data[crypto].eur}</p>
          )}
        </div>
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer<React.Reducer<State, Action>>(reducer, initialState);
  const { searchTerm, searchResults, loading, error, currency, searchClicked } = state;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, setSocket] = useState<Socket | null>(null);

  const fetchData: FetchData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,litecoin&vs_currencies=usd,eur'
      );
      const jsonData = response.data;
      dispatch({ type: 'SET_DATA', payload: jsonData });

      if (searchTerm) {
        const filteredData: Record<string, { usd: number; eur: number }> = {};

        Object.keys(jsonData).forEach((crypto) => {
          if (crypto.toLowerCase().includes(searchTerm.toLowerCase())) {
            filteredData[crypto] = jsonData[crypto];
          }
        });

        dispatch({ type: 'SET_SEARCH_RESULTS', payload: filteredData });
      } else {
        dispatch({ type: 'SET_SEARCH_RESULTS', payload: null });
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: "Une erreur s'est produite lors de la récupération des données.",
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch, searchTerm]);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      dispatch({ type: 'SET_SEARCH_CLICKED', payload: true });
      fetchData();
    }
  };

  const handleCurrencyChange = (selectedCurrency: 'usd' | 'eur') => {
    dispatch({ type: 'SET_CURRENCY', payload: selectedCurrency });
  };

  useEffect(() => {
    fetchData();

    const socketConnection = io('http://localhost:3001');
    setSocket(socketConnection);

    socketConnection.on('priceUpdate', (updatedData) => {
      dispatch({ type: 'SET_DATA', payload: updatedData });

      if (searchTerm) {
        const filteredData: Record<string, { usd: number; eur: number }> = {};

        Object.keys(updatedData).forEach((crypto) => {
          if (crypto.toLowerCase().includes(searchTerm.toLowerCase())) {
            filteredData[crypto] = updatedData[crypto];
          }
        });

        dispatch({ type: 'SET_SEARCH_RESULTS', payload: filteredData });
      }
    });

    return () => {
      socketConnection.disconnect();
    };
  }, [searchTerm, fetchData]);

  return (
    <div>
      <section id="slideshow">
        <div className="entire-content">
          <div className="content-carrousel">
            <figure className="shadow">
              <img src={cryptoLogo} alt="crypto" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo1} alt="crypto1" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo2} alt="crypto2" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo3} alt="crypto3" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo4} alt="crypto4" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo5} alt="crypto5" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo6} alt="crypto6" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo7} alt="crypto7" />
            </figure>
            <figure className="shadow">
              <img src={cryptoLogo8} alt="crypto8" />
            </figure>
          </div>
        </div>
      </section>

      <div className="center-container">
        <h1
          className="crypto-title"
          style={{ fontSize: '24px', color: 'blue', textAlign: 'center' }}
        >
          Chercher les prix de vos cryptomonnaies
        </h1>

        <div
          className="search-container"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => dispatch({ type: 'SET_SEARCH_TERM', payload: e.target.value })}
            placeholder="Donner le nom du Crypto"
            style={{ marginRight: '10px', padding: '5px' }}
          />
          <button
            onClick={handleSearch}
            className="search-button"
            style={{ padding: '5px 10px', backgroundColor: 'blue', color: 'white' }}
          >
            Rechercher
          </button>
        </div>

        <div className="currency-container">
          <label>
            <input
              type="radio"
              value="usd"
              checked={currency === 'usd'}
              onChange={() => handleCurrencyChange('usd')}
            />
            USD
          </label>
          <label>
            <input
              type="radio"
              value="eur"
              checked={currency === 'eur'}
              onChange={() => handleCurrencyChange('eur')}
            />
            EUR
          </label>
        </div>

        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {searchClicked && searchResults && (
          <div className="search-results">
            {Object.keys(searchResults).length > 0 ? (
              <CryptoPrice data={searchResults} currency={currency} />
            ) : (
              <p>Aucun résultat trouvé</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;