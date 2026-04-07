import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Diagnose from './pages/Diagnose';
import Report from './pages/Report';
import History from './pages/History';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/diagnose" element={<Diagnose />} />
        <Route path="/report" element={<Report />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
