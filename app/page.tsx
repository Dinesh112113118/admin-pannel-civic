'use client'

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import LoginPage from '@/components/LoginPage';
import Layout from '@/components/Layout';

function AppContent() {
  const { user } = useAuth();

  return user ? <Layout /> : <LoginPage />;
}

export default function Home() {
  return <AppContent />;
}
