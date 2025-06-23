//import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import RegisterPage from './pages/RegisterPage';
//import SettingsPage from './pages/SettingsPage';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage/></PublicRoute>} />
        <Route path="/register" element={<PrivateRoute><RegisterPage/></PrivateRoute>} />
        <Route path="/" element={<PrivateRoute><ChatPage/></PrivateRoute>} />
        {/*
        <Route path="/settings" element={<PrivateRoute><SettingsPage/></PrivateRoute>} />
        */}
      </Routes>
    </BrowserRouter>
  );
}