import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props { children: JSX.Element; }

export default function PublicRoute({ children }: Props) {
  const { token } = useAuth();
  // If user is already authenticated, redirect to chat
  if (token) {
    return <Navigate to="/" replace />;
  }
  return children;
}