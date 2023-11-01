// import logo from './logo.svg';
import React from 'react';
import './App.css';
import CarbonCreditDashboard from './pages/CarbonCreditDashboard'
import { Web3Provider } from './contexts/Web3Context';
function App() {

  return (
    <Web3Provider>
      <CarbonCreditDashboard />
    </Web3Provider >
  );
}

export default App;
