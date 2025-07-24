import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Layout from './Layout';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Auth from './pages/Auth';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse">
            <div className="w-8 h-8 bg-white rounded"></div>
          </div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/auth" 
        element={user ? <Navigate to="/dashboard" replace /> : <Auth />} 
      />
      <Route 
        path="/dashboard" 
        element={user ? <Layout><Dashboard /></Layout> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/upload" 
        element={user ? <Layout><Upload /></Layout> : <Navigate to="/auth" replace />} 
      />
      <Route 
        path="/" 
        element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} 
      />
    </Routes>
  );
}

export default App;