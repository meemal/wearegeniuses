import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Import components
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Placeholder pages (we'll create these later)
const Directory = () => <div className="p-6 bg-white rounded shadow">User Directory - Available for subscribers</div>;
const Profile = () => <div className="p-6 bg-white rounded shadow">User Profile</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navigation />
          <main className="container mx-auto px-4 py-8 flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/directory" 
                element={
                  <ProtectedRoute requireSubscription={true}>
                    <Directory />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          <footer className="bg-white border-t">
            <div className="container mx-auto px-4 py-6 text-center text-gray-500">
              &copy; {new Date().getFullYear()} We Are Geniuses. All rights reserved.
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App; 