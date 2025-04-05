import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Creators from './Creators';
import CreatorProfile from './CreatorProfile';
import CreatorPool from './CreatorPool';
import CreateCampaign from './CreateCampaign';
import Campaigns from './Campaigns';
import Cooperations from './Cooperations';
import Chat from './Chat';
import Invoices from './Invoices';
import Company from './Company';
import BrandSettings from './BrandSettings';

export default function BrandDashboard() {
  return (
    <Routes>
      {/* Redirect root to campaigns */}
      <Route index element={<Navigate to="/brand/campaigns" replace />} />
      
      <Route path="creators" element={<Creators />} />
      <Route path="creators/:id" element={<CreatorProfile />} />
      <Route path="pool" element={<CreatorPool />} />
      <Route path="campaign/new" element={<CreateCampaign />} />
      <Route path="campaigns" element={<Campaigns />} />
      <Route path="cooperations" element={<Cooperations />} />
      <Route path="chat" element={<Chat />} />
      <Route path="invoices" element={<Invoices />} />
      <Route path="company" element={<Company />} />
      <Route path="settings" element={<BrandSettings />} />
      <Route path="*" element={<Navigate to="/brand/campaigns" replace />} />
    </Routes>
  );
}