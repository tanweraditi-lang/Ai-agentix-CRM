import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import LeadDetailsPage from './pages/LeadDetailsPage';
import CustomersPage from './pages/CustomersPage';
import FollowupsPage from './pages/FollowupsPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="leads" element={<LeadsPage />} />
        <Route path="leads/:id" element={<LeadDetailsPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="followups" element={<FollowupsPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
