import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import components
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Directory from './pages/Directory';
import Subscription from './pages/Subscription';
import ViewProfile from './pages/ViewProfile';

// Placeholder pages with frosted glass effect
const About = () => (
  <div className="max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold mb-6 text-center text-white">About Us</h2>
    <div className="relative rounded-lg overflow-hidden">
      <div className="absolute inset-0 bg-overlay-white backdrop-blur-md"></div>
      <div className="relative p-6">
        <p className="text-gray-700 mb-4">We Are Geniuses is a community of Dr Joe Dispenza practitioners dedicated to personal growth and transformation.</p>
        <p className="text-gray-700">Our mission is to connect heart-centered individuals who are committed to creating their new reality through meditation and conscious living.</p>
      </div>
    </div>
  </div>
);

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gradient-main flex flex-col">
            <Navigation />
            <main className="container mx-auto px-4 py-8 flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/about" element={<About />} />
                <Route path="/subscription" element={<Subscription />} />
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
                <Route 
                  path="/view-profile/:userId" 
                  element={
                    <ProtectedRoute>
                      <ViewProfile />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </main>
            <footer className="border-t border-white border-opacity-20">
              <div className="container mx-auto px-4 py-6 text-center text-white">
                &copy; {new Date().getFullYear()} We Are Geniuses. All rights reserved.
              </div>
            </footer>
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App; 