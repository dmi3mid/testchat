import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';

import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <div>
      <Routes>
        <Route index element={
          <MainPage />
        } />
        <Route path='/settings' element={
          <SettingsPage />
        }/>
      </Routes>
    </div>
  )
}

export default App
