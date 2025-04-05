import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Users, 
  Calendar,
  ArrowUpRight,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  AlertCircle,
  Layout
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock campaigns data for development
const mockCampaigns = [
  {
    id: 'camp1',
    title: 'Summer Sports Collection Launch',
    description: 'Looking for energetic creators to showcase our new summer sports collection.',
    status: 'active',
    applications: 12,
    budget: {
      min: 500,
      max: 2000
    },
    deadline: '2025-03-15T00:00:00Z',
    created_at: '2025-02-01T00:00:00Z',
    categories: ['Sports', 'Fashion', 'Lifestyle'],
    platforms: ['instagram', 'tiktok'],
    selected_creators: 3,
    required_creators: 5
  },
  {
    id: 'camp2',
    title: 'Sustainable Fashion Campaign',
    description: 'Seeking eco-conscious creators to promote our sustainable fashion line.',
    status: 'draft',
    applications: 0,
    budget: {
      min: 800,
      max: 2500
    },
    deadline: '2025-03-20T00:00:00Z',
    created_at: '2025-02-05T00:00:00Z',
    categories: ['Fashion', 'Sustainability'],
    platforms: ['instagram', 'youtube'],
    selected_creators: 0,
    required_creators: 8
  },
  {
    id: 'camp3',
    title: 'Winter Training Gear',
    description: 'Promoting our new winter training gear collection with fitness influencers.',
    status: 'completed',
    applications: 25,
    budget: {
      min: 1000,
      max: 3000
    },
    deadline: '2024-12-15T00:00:00Z',
    created_at: '2024-11-01T00:00:00Z',
    categories: ['Sports', 'Fitness'],
    platforms: ['instagram', 'youtube', 'tiktok'],
    selected_creators: 6,
    required_creators: 6
  },
  {
    id: 'camp4',
    title: 'Tech Accessories Launch',
    description: 'Looking for tech-savvy creators to showcase our new accessories line.',
    status: 'cancelled',
    applications: 8,
    budget: {
      min: 600,
      max: 1800
    },
    deadline: '2025-01-10T00:00:00Z',
    created_at: '2024-12-01T00:00:00Z',
    categories: ['Technology', 'Lifestyle'],
    platforms: ['youtube', 'instagram'],
    selected_creators: 2,
    required_creators: 4
  }
];

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    active: {
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle,
      text: 'Active'
    },
    draft: {
      color: 'bg-gray-100 text-gray-800',
      icon: Clock,
      text: 'Draft'
    },
    completed: {
      color: 'bg-blue-100 text-blue-800',
      icon: CheckCircle,
      text: 'Completed'
    },
    cancelled: {
      color: 'bg-red-100 text-red-800',
      icon: XCircle,
      text: 'Cancelled'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="w-4 h-4" />
      {config.text}
    </span>
  );
}

function CampaignCard({ campaign }: { campaign: typeof mockCampaigns[0] }) {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  
  const daysUntilDeadline = Math.ceil(
    (new Date(campaign.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  const handleAction = (action: string) => {
    switch (action) {
      case 'edit':
        // Navigate to edit page
        break;
      case 'duplicate':
        // Duplicate campaign
        break;
      case 'delete':
        // Show delete confirmation
        break;
      default:
        break;
    }
    setShowActions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
              <StatusBadge status={campaign.status} />
            </div>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-100 rounded-full transition"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  <button
                    onClick={() => handleAction('edit')}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Campaign
                  </button>
                  <button
                    onClick={() => handleAction('duplicate')}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    <Copy className="w-4 h-4" />
                    Duplicate
                  </button>
                  {campaign.status !== 'completed' && campaign.status !== 'cancelled' && (
                    <button
                      onClick={() => handleAction('delete')}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-4">
          {campaign.categories.map(category => (
            <span
              key={category}
              className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
            >
              {category}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <p className="text-sm text-gray-500">Budget Range</p>
            <p className="font-medium">
              ${campaign.budget.min.toLocaleString()} - ${campaign.budget.max.toLocaleString()}
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Creators</p>
            <div className="flex items-center gap-1">
              <span className="font-medium">{campaign.selected_creators}</span>
              <span className="text-gray-500">/</span>
              <span className="font-medium">{campaign.required_creators}</span>
              <span className="text-gray-500">selected</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Applications</p>
            <p className="font-medium">{campaign.applications} creators</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {campaign.status === 'completed' || campaign.status === 'cancelled' ? (
              <span>Ended {new Date(campaign.deadline).toLocaleDateString()}</span>
            ) : (
              <span>
                {daysUntilDeadline > 0 
                  ? `${daysUntilDeadline} days left` 
                  : 'Deadline passed'}
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            {campaign.status === 'active' && (
              <button
                onClick={() => navigate('/brand/creators')}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Find Creators
              </button>
            )}
            <button
              onClick={() => navigate(`/brand/campaigns/${campaign.id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Campaigns() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCampaigns = mockCampaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Campaign statistics
  const stats = {
    total: mockCampaigns.length,
    active: mockCampaigns.filter(c => c.status === 'active').length,
    draft: mockCampaigns.filter(c => c.status === 'draft').length,
    completed: mockCampaigns.filter(c => c.status === 'completed').length
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Campaigns</h1>
        <button
          onClick={() => navigate('/brand/campaign/new')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Create Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Layout className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Campaigns</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Drafts</p>
              <p className="text-2xl font-bold">{stats.draft}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Campaign List */}
      <div className="space-y-6">
        {filteredCampaigns.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You haven't created any campaigns yet. Start by creating your first campaign."}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/brand/campaign/new')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
              >
                <PlusCircle className="w-4 h-4" />
                Create Campaign
              </button>
            )}
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