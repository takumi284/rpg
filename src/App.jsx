import React from 'react';
import './App.css';
import Game from './components/Game';

function App() {
  return (
    <div className="App">
      <div className="App-header">
        <h1>Turn Based Fighting Game</h1>
      </div>
      <Game />
    </div>
  );
}

export default App;