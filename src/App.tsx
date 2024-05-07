import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './component/MainPage';
import TestPage from './component/testPage';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" element={<TestPage />} />
          <Route path="/socket" element={<MainPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
