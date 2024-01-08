import React from 'react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import reducer from './App.tsx'; 
import App from './App';   
import axios from 'axios'; 

jest.mock('axios');
jest.mock('socket.io-client');

describe('Reducer', () => {
  it('should set data in the state', () => {
    const initialState = { data: null };
    const action = { type: 'SET_DATA', payload: { crypto: { usd: 100, eur: 90 } } };
    const newState = reducer(initialState, action);
    expect(newState.data).toEqual({ crypto: { usd: 100, eur: 90 } });
  });

  it('should set search term in the state', () => {
    const initialState = { searchTerm: '' };
    const action = { type: 'SET_SEARCH_TERM', payload: 'bitcoin' };
    const newState = reducer(initialState, action);
    expect(newState.searchTerm).toEqual('bitcoin');
  });

  it('should set search results in the state', () => {
    const initialState = { searchResults: null };
    const action = { type: 'SET_SEARCH_RESULTS', payload: { bitcoin: { usd: 100 } } };
    const newState = reducer(initialState, action);
    expect(newState.searchResults).toEqual({ bitcoin: { usd: 100 } });
  });

  it('should set loading state', () => {
    const initialState = { loading: false };
    const action = { type: 'SET_LOADING', payload: true };
    const newState = reducer(initialState, action);
    expect(newState.loading).toEqual(true);
  });

  it('should set error state', () => {
    const initialState = { error: null };
    const action = { type: 'SET_ERROR', payload: 'An error occurred' };
    const newState = reducer(initialState, action);
    expect(newState.error).toEqual('An error occurred');
  });

  it('should set currency in the state', () => {
    const initialState = { currency: 'usd' };
    const action = { type: 'SET_CURRENCY', payload: 'eur' };
    const newState = reducer(initialState, action);
    expect(newState.currency).toEqual('eur');
  });

  it('should set search clicked in the state', () => {
    const initialState = { searchClicked: false };
    const action = { type: 'SET_SEARCH_CLICKED', payload: true };
    const newState = reducer(initialState, action);
    expect(newState.searchClicked).toEqual(true);
  });

  it('should handle default case', () => {
    const initialState = { data: null };
    const action = { type: 'UNKNOWN_ACTION', payload: 'value' };
    const newState = reducer(initialState, action);
    expect(newState).toEqual(initialState);
  });
});

describe('App Component', () => {
  test('renders App component correctly', async () => {
    render(<App />);

    // Mocking API response for axios
    axios.get.mockResolvedValueOnce({
      data: {
        bitcoin: { usd: 50000, eur: 40000 },
        ethereum: { usd: 3000, eur: 2500 },
        litecoin: { usd: 150, eur: 120 },
      },
    });

    // Wait for the component to fetch data
    await waitFor(() => screen.getByText('Chercher les prix de vos cryptomonnaies'));

    // Check if the component renders the initial content
    expect(screen.getByText('Chercher les prix de vos cryptomonnaies')).toBeInTheDocument();

    // Simulate user search
    fireEvent.change(screen.getByPlaceholderText('Donner le nom du Crypto'), { target: { value: 'bitcoin' } });
    fireEvent.click(screen.getByText('Rechercher'));

    // Wait for the component to update after the search
    await waitFor(() => screen.getByText('Current price in $: 50000'));

    // Check if the search results are rendered
    expect(screen.getByText('Current price in $: 50000')).toBeInTheDocument();
  });
});


describe('App Integration Test - Happy Path', () => {
  test('renders App component and successfully fetches and displays crypto prices', async () => {
    // Mock API response for axios
    axios.get.mockResolvedValueOnce({
      data: {
        bitcoin: { usd: 50000, eur: 40000 },
        ethereum: { usd: 3000, eur: 2500 },
        litecoin: { usd: 150, eur: 120 },
      },
    });

    render(<App />);

    // Wait for the component to fetch data
    await waitFor(() => screen.getByText('Chercher les prix de vos cryptomonnaies'));

    // Check if the component renders the initial content
    expect(screen.getByText('Chercher les prix de vos cryptomonnaies')).toBeInTheDocument();

    // Simulate user search
    fireEvent.change(screen.getByPlaceholderText('Donner le nom du Crypto'), { target: { value: 'bitcoin' } });
    fireEvent.click(screen.getByText('Rechercher'));

    // Wait for the component to update after the search
    await waitFor(() => screen.getByText('Current price in $: 50000'));

    // Check if the search results are rendered
    expect(screen.getByText('Current price in $: 50000')).toBeInTheDocument();
    expect(screen.queryByText('Aucun résultat trouvé')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Une erreur s\'est produite lors de la récupération des données.')).not.toBeInTheDocument();
  });
});



describe('App Integration Test - Unhappy Path', () => {
  test('renders App component and handles error when fetching crypto prices', async () => {
    // Mocking a failed API request for axios
    axios.get.mockRejectedValueOnce(new Error('Failed to fetch data'));

    render(<App />);

    // Wait for the component to attempt fetching data
    await waitFor(() => screen.getByText('Chercher les prix de vos cryptomonnaies'));

    // Check if the component renders the initial content
    expect(screen.getByText('Chercher les prix de vos cryptomonnaies')).toBeInTheDocument();

    // Simulate user search
    fireEvent.change(screen.getByPlaceholderText('Donner le nom du Crypto'), { target: { value: 'bitcoin' } });
    fireEvent.click(screen.getByText('Rechercher'));

    // Wait for the component to handle the error
    await waitFor(() => screen.getByText('Une erreur s\'est produite lors de la récupération des données.'));

    // Check if the error message is displayed
    expect(screen.getByText('Une erreur s\'est produite lors de la récupération des données.')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Aucun résultat trouvé')).not.toBeInTheDocument();
  });
});