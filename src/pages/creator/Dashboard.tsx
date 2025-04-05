import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Campaigns from './Campaigns';
import CampaignDetails from './CampaignDetails';
import Cooperations from './Cooperations';
import Profile from './Profile';
import BrandPreview from './BrandPreview';
import Chat from './Chat';
import Payments from './Payments';
import Settings from './Settings';

export default function CreatorDashboard() {
  return (
    <Routes>
      <Route path="campaigns" element={<Campaigns />} />
      <Route path="campaigns/:id" element={<CampaignDetails />} />
      <Route path="cooperations" element={<Cooperations />} />
      <Route path="payments" element={<Payments />} />
      <Route path="profile" element={<Profile />} />
      <Route path=":id" element={<BrandPreview />} />
      <Route path="chat" element={<Chat />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
}