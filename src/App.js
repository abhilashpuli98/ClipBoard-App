import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClipProvider } from './context/ClipContext';
import { useTheme } from './hooks/useTheme';

import Navbar from './components/Navbar';
import ToastContainer from './components/Toast';
import Dashboard from './pages/Dashboard';
import NewClip from './pages/NewClip';
import ViewClip from './pages/ViewClip';
import EditClip from './pages/EditClip';
import Collections from './pages/Collections';
import History from './pages/History';
import Trash from './pages/Trash';
import Settings from './pages/Settings';

function AppContent() {
  useTheme(); // Initialize theme listener
  return (
    <div className="app-layout">
      <Navbar />
      <ToastContainer />
      <main className="container" style={{ paddingBottom: '4rem', paddingTop: '2rem' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clip/new" element={<NewClip />} />
          <Route path="/clip/:id" element={<ViewClip />} />
          <Route path="/clip/:id/edit" element={<EditClip />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/history" element={<History />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ClipProvider>
      <Router>
        <AppContent />
      </Router>
    </ClipProvider>
  );
}

export default App;
