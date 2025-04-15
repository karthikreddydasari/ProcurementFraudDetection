// App.js
import React, { useState } from 'react';
import UploadForm from './components/UploadForm';
import Dashboard from './components/Dashboard';
import GetStarted from './components/GetStarted';
import './App.css';

function App() {
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState([]);

  return (
    <div className="AppWrapper">
      <header className="AppHeader">
        <div className="logo">🛡️ ProcureShield AI</div>
        <nav>
          <a href="#dashboard">Dashboard</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main className="App">
        {!started ? (
          <GetStarted onStart={() => setStarted(true)} />
        ) : (
          <>
            <h1>Procurement Fraud Detection Platform</h1>
            <UploadForm setResults={setResults} />
            <Dashboard results={results} />
          </>
        )}
      </main>

      <footer className="AppFooter">
        <p>&copy; {new Date().getFullYear()} ProcureShield AI. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
