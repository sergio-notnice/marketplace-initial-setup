import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  DollarSign, 
  Tag, 
  Instagram, 
  Youtube, 
  BookText as TikTok, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  FileText,
  Download,
  Eye,
  ArrowUpRight,
  Package,
  Users,
  Calendar,
  Layout
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { supabase } from '../../lib/supabase';
import type { Campaign } from '../../types';

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

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const navigate = useNavigate();
  const daysUntilDeadline = Math.ceil(
    (new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-neutral-700 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={campaign.brand_logo}
              alt={campaign.brand_name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {campaign.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{campaign.brand_name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {campaign.platforms.map(platform => (
              <div key={platform} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-700 flex items-center justify-center">
                <PlatformIcon platform={platform} />
              </div>
            ))}
          </div>
        </div>

        {/* Description */}
        <p className="mt-4 text-gray-600 dark:text-gray-400 line-clamp-2">{campaign.description}</p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {campaign.categories.map(category => (
            <span
              key={category}
              className="px-2 py-1 bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">
              ${campaign.budget.min.toLocaleString()} - ${campaign.budget.max.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Tag className="w-5 h-5" />
            <span className="text-sm font-medium">
              {campaign.deliverables.length} Deliverables
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">
              {daysUntilDeadline} days left
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-neutral-700">
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Users className="w-5 h-5" />
            <span className="text-sm">{campaign.applications_count} applications</span>
          </div>
          <button
            onClick={() => navigate(`/creator/campaigns/${campaign.id}`)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
          >
            View Details
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Campaigns() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function fetchCampaigns() {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCampaigns(data || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Failed to load campaigns. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  // Get unique categories and platforms from campaigns
  const categories = ['all', ...new Set(campaigns.flatMap(c => c.categories))];
  const platforms = ['all', ...new Set(campaigns.flatMap(c => c.platforms))];

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.brand_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || campaign.categories.includes(selectedCategory);
    const matchesPlatform = selectedPlatform === 'all' || campaign.platforms.includes(selectedPlatform);

    return matchesSearch && matchesCategory && matchesPlatform;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 dark:bg-red-900/50 p-4 rounded-lg text-red-700 dark:text-red-200">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Available Campaigns</h1>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-neutral-700 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-neutral-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-gray-100"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 dark:border-neutral-600 rounded-md py-2 pl-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-gray-100"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="border border-gray-300 dark:border-neutral-600 rounded-md py-2 pl-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-neutral-700 dark:text-gray-100"
            >
              {platforms.map(platform => (
                <option key={platform} value={platform}>
                  {platform === 'all' ? 'All Platforms' : platform}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-6">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-8 border border-gray-200 dark:border-neutral-700 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No campaigns found</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
              {searchTerm || selectedCategory !== 'all' || selectedPlatform !== 'all'
                ? "Try adjusting your search or filters to find what you're looking for."
                : "There are no active campaigns available at the moment. Check back later for new opportunities."}
            </p>
          </div>
        ) : (
          filteredCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))
        )}
      </div>
    </div>
  );
}