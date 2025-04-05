import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, DollarSign, Tag, Instagram, Youtube, BookText as TikTok, CheckCircle, Users, Send } from 'lucide-react';
import type { Campaign } from '../../types';

// Mock data for development - in real app, fetch by ID
const mockCampaign: Campaign = {
  id: 'camp1',
  brand_id: 'brand1',
  brand_name: 'Nike',
  brand_logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100',
  title: 'Summer Sports Collection Launch',
  description: 'Looking for energetic creators to showcase our new summer sports collection in authentic and dynamic ways. We want to highlight the versatility and style of our latest activewear line through creative content that resonates with fitness enthusiasts and fashion-forward audiences.',
  requirements: 'Must have experience in sports content and a minimum of 10k followers on Instagram or TikTok. We\'re looking for creators who can demonstrate our products in action and create engaging storytelling around an active lifestyle. Previous experience with sports or fitness brands is a plus.',
  budget: {
    min: 500,
    max: 2000
  },
  deliverables: [
    {
      type: 'video',
      description: 'Product showcase video highlighting key features of the collection',
      quantity: 1
    },
    {
      type: 'post',
      description: 'Instagram posts with product tags and lifestyle shots',
      quantity: 3
    },
    {
      type: 'story',
      description: 'Instagram stories with swipe-up link to collection',
      quantity: 5
    }
  ],
  deadline: '2025-03-15T00:00:00Z',
  categories: ['Sports', 'Fashion', 'Lifestyle'],
  platforms: ['instagram', 'tiktok'],
  status: 'active',
  created_at: '2025-02-01T00:00:00Z',
  updated_at: '2025-02-01T00:00:00Z',
  applications_count: 12
};

function PlatformIcon({ platform }: { platform: string }) {
  const icons = {
    instagram: Instagram,
    youtube: Youtube,
    tiktok: TikTok
  };
  
  const Icon = icons[platform as keyof typeof icons];
  if (!Icon) return null;

  return <Icon className="w-4 h-4" />;
}

export default function CampaignDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState('');
  const [price, setPrice] = useState(mockCampaign.budget.min);

  const daysUntilDeadline = Math.ceil(
    (new Date(mockCampaign.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, submit application to backend
    alert('Application submitted successfully!');
    navigate('/creator/campaigns');
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/creator/campaigns')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </button>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-6">
            <img
              src={mockCampaign.brand_logo}
              alt={mockCampaign.brand_name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mockCampaign.title}</h1>
              <p className="text-lg text-gray-600">{mockCampaign.brand_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {mockCampaign.platforms.map(platform => (
              <div key={platform} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <PlatformIcon platform={platform} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="col-span-2 space-y-8">
          {/* Description */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Campaign Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{mockCampaign.description}</p>
          </section>

          {/* Requirements */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Requirements</h2>
            <p className="text-gray-600 whitespace-pre-line">{mockCampaign.requirements}</p>
          </section>

          {/* Deliverables */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Deliverables</h2>
            <div className="space-y-4">
              {mockCampaign.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {deliverable.quantity}x {deliverable.type}
                    </p>
                    <p className="text-gray-600">{deliverable.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Application Form */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Submit Application</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Proposal
                </label>
                <textarea
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe why you're a great fit for this campaign..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Price
                </label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    min={mockCampaign.budget.min}
                    max={mockCampaign.budget.max}
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Submit Application
              </button>
            </form>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Budget Range</p>
                <p className="font-medium">
                  ${mockCampaign.budget.min.toLocaleString()} - ${mockCampaign.budget.max.toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Deadline</p>
                <p className="font-medium">{daysUntilDeadline} days left</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Applications</p>
                <p className="font-medium">{mockCampaign.applications_count} creators applied</p>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {mockCampaign.categories.map(category => (
                <span
                  key={category}
                  className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}