import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
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

// Mock cooperations data for development
const mockCooperations = [
  {
    id: 'coop1',
    campaign: {
      id: 'camp1',
      title: 'Summer Sports Collection Launch',
      budget: 2500,
      deadline: '2025-03-15T00:00:00Z'
    },
    creator: {
      id: 'creator1',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rating: 4.8
    },
    status: 'in_progress',
    deliverables: [
      { type: 'video', description: 'Product showcase video', status: 'completed' },
      { type: 'post', description: 'Instagram posts with product tags', status: 'in_progress' },
      { type: 'story', description: 'Instagram stories with swipe-up link', status: 'pending' }
    ],
    last_message: {
      content: 'The storyboard looks great! Please proceed with the shooting.',
      timestamp: '2025-02-15T14:30:00Z'
    },
    created_at: '2025-02-01T00:00:00Z'
  },
  {
    id: 'coop2',
    campaign: {
      id: 'camp2',
      title: 'Sustainable Fashion Campaign',
      budget: 3500,
      deadline: '2025-03-20T00:00:00Z'
    },
    creator: {
      id: 'creator2',
      name: 'Mike Chen',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rating: 4.6
    },
    status: 'review',
    deliverables: [
      { type: 'video', description: 'Brand story video', status: 'in_review' },
      { type: 'post', description: 'Instagram posts', status: 'completed' },
      { type: 'video', description: 'YouTube video', status: 'completed' }
    ],
    last_message: {
      content: 'I have submitted all deliverables for review. Looking forward to your feedback!',
      timestamp: '2025-02-18T09:15:00Z'
    },
    created_at: '2025-02-05T00:00:00Z'
  },
  {
    id: 'coop3',
    campaign: {
      id: 'camp3',
      title: 'Winter Training Gear',
      budget: 4000,
      deadline: '2025-02-10T00:00:00Z'
    },
    creator: {
      id: 'creator3',
      name: 'Emma Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      rating: 4.9
    },
    status: 'completed',
    deliverables: [
      { type: 'video', description: 'Product review video', status: 'completed' },
      { type: 'post', description: 'Instagram reels', status: 'completed' },
      { type: 'video', description: 'TikTok videos', status: 'completed' }
    ],
    last_message: {
      content: 'Great work! The campaign exceeded our expectations.',
      timestamp: '2025-02-10T16:45:00Z'
    },
    created_at: '2025-01-15T00:00:00Z'
  }
];

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    in_progress: {
      color: 'bg-blue-100 text-blue-700',
      icon: Clock,
      text: 'In Progress'
    },
    review: {
      color: 'bg-yellow-100 text-yellow-700',
      icon: AlertCircle,
      text: 'In Review'
    },
    completed: {
      color: 'bg-green-100 text-green-700',
      icon: CheckCircle,
      text: 'Completed'
    },
    cancelled: {
      color: 'bg-red-100 text-red-700',
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

function DeliverableStatusBadge({ status }: { status: string }) {
  const statusConfig = {
    completed: {
      color: 'bg-green-100 text-green-700',
      icon: CheckCircle
    },
    in_progress: {
      color: 'bg-blue-100 text-blue-700',
      icon: Clock
    },
    in_review: {
      color: 'bg-yellow-100 text-yellow-700',
      icon: AlertCircle
    },
    pending: {
      color: 'bg-gray-100 text-gray-700',
      icon: Clock
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );
}

function CooperationCard({ cooperation }: { cooperation: typeof mockCooperations[0] }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  
  const daysUntilDeadline = Math.ceil(
    (new Date(cooperation.campaign.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  const completedDeliverables = cooperation.deliverables.filter(d => d.status === 'completed').length;
  const totalDeliverables = cooperation.deliverables.length;
  const progress = Math.round((completedDeliverables / totalDeliverables) * 100);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={cooperation.creator.avatar}
              alt={cooperation.creator.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{cooperation.campaign.title}</h3>
              <p className="text-sm text-gray-600">with {cooperation.creator.name}</p>
            </div>
          </div>
          <StatusBadge status={cooperation.status} />
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-900">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <p className="text-sm text-gray-500">Budget</p>
            <p className="font-medium">${cooperation.campaign.budget.toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Deliverables</p>
            <p className="font-medium">{completedDeliverables} of {totalDeliverables} completed</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Deadline</p>
            <p className="font-medium">
              {daysUntilDeadline > 0 
                ? `${daysUntilDeadline} days left`
                : 'Deadline passed'}
            </p>
          </div>
        </div>

        {/* Last Message */}
        {cooperation.last_message && (
          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">{cooperation.last_message.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(cooperation.last_message.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show details
              </>
            )}
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/brand/chat')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              Message
            </button>
            <button
              onClick={() => navigate(`/brand/campaigns/${cooperation.campaign.id}`)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-6">
          <h4 className="text-sm font-medium text-gray-900 mb-4">Deliverables</h4>
          <div className="space-y-4">
            {cooperation.deliverables.map((deliverable, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{deliverable.description}</p>
                    <p className="text-xs text-gray-500">{deliverable.type}</p>
                  </div>
                </div>
                <DeliverableStatusBadge status={deliverable.status} />
              </div>
            ))}
          </div>

          {cooperation.status === 'completed' && (
            <div className="flex justify-end gap-3 mt-6">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-100 transition-colors">
                <FileText className="w-4 h-4" />
                View Report
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium flex items-center gap-2 hover:bg-indigo-700 transition-colors">
                <Download className="w-4 h-4" />
                Download Assets
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Cooperations() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCooperations = mockCooperations.filter(coop => {
    const matchesSearch = 
      coop.campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coop.creator.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || coop.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: mockCooperations.length,
    active: mockCooperations.filter(c => c.status === 'in_progress').length,
    review: mockCooperations.filter(c => c.status === 'review').length,
    completed: mockCooperations.filter(c => c.status === 'completed').length
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Cooperations</h1>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Layout className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">In Review</p>
              <p className="text-2xl font-bold">{stats.review}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
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
              placeholder="Search cooperations..."
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
              <option value="in_progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cooperations List */}
      <div className="space-y-6">
        {filteredCooperations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cooperations found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm || statusFilter !== 'all' 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You don't have any active cooperations yet. Start by finding creators for your campaigns."}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => navigate('/brand/creators')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
              >
                <Users className="w-4 h-4" />
                Find Creators
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          filteredCooperations.map(cooperation => (
            <CooperationCard key={cooperation.id} cooperation={cooperation} />
          ))
        )}
      </div>
    </div>
  );
}