import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  DollarSign,
  Package,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ExternalLink
} from 'lucide-react';
import type { Cooperation } from '../../types';

// Mock data for development
const mockCooperations: Cooperation[] = [
  {
    id: '1',
    campaign_id: 'camp1',
    brand_id: 'brand1',
    creator_id: '123e4567-e89b-12d3-a456-426614174000',
    brand_name: 'Nike',
    creator_name: 'Development User',
    campaign_title: 'Summer Sports Collection',
    status: 'in_progress',
    deliverables: [
      '15s product showcase video',
      '3 Instagram stories',
      '1 Instagram post'
    ],
    deadline: '2025-03-15T00:00:00Z',
    budget: 2500,
    created_at: '2025-02-01T00:00:00Z',
    updated_at: '2025-02-15T00:00:00Z',
    brand_logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100',
    last_message: {
      content: 'The storyboard looks great! Please proceed with the shooting.',
      sender_id: 'brand1',
      timestamp: '2025-02-15T14:30:00Z'
    }
  },
  {
    id: '2',
    campaign_id: 'camp2',
    brand_id: 'brand2',
    creator_id: '123e4567-e89b-12d3-a456-426614174000',
    brand_name: 'Adidas',
    creator_name: 'Development User',
    campaign_title: 'Sustainable Fashion Campaign',
    status: 'review',
    deliverables: [
      '30s brand story video',
      '5 Instagram posts',
      '1 YouTube video'
    ],
    deadline: '2025-03-20T00:00:00Z',
    budget: 3500,
    created_at: '2025-02-05T00:00:00Z',
    updated_at: '2025-02-18T00:00:00Z',
    brand_logo: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100&h=100',
    last_message: {
      content: "I have submitted the final video for review. Looking forward to your feedback!",
      sender_id: '123e4567-e89b-12d3-a456-426614174000',
      timestamp: '2025-02-18T09:15:00Z'
    }
  },
  {
    id: '3',
    campaign_id: 'camp3',
    brand_id: 'brand3',
    creator_id: '123e4567-e89b-12d3-a456-426614174000',
    brand_name: 'Under Armour',
    creator_name: 'Development User',
    campaign_title: 'Winter Training Gear',
    status: 'completed',
    deliverables: [
      '45s product review video',
      '3 Instagram reels',
      '2 TikTok videos'
    ],
    deadline: '2025-02-10T00:00:00Z',
    budget: 4000,
    created_at: '2025-01-15T00:00:00Z',
    updated_at: '2025-02-10T00:00:00Z',
    brand_logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100',
    last_message: {
      content: 'Great work! The campaign exceeded our expectations. Looking forward to working with you again.',
      sender_id: 'brand3',
      timestamp: '2025-02-10T16:45:00Z'
    }
  }
];

function StatusBadge({ status }: { status: Cooperation['status'] }) {
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
      icon: CheckCircle2,
      text: 'Completed'
    },
    cancelled: {
      color: 'bg-red-100 text-red-700',
      icon: XCircle,
      text: 'Cancelled'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="w-4 h-4" />
      {config.text}
    </span>
  );
}

function CooperationCard({ cooperation }: { cooperation: Cooperation }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const daysUntilDeadline = Math.ceil(
    (new Date(cooperation.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
  );

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={cooperation.brand_logo}
              alt={cooperation.brand_name}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {cooperation.campaign_title}
              </h3>
              <p className="text-sm text-gray-600">{cooperation.brand_name}</p>
            </div>
          </div>
          <StatusBadge status={cooperation.status} />
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-2 text-gray-600">
            <DollarSign className="w-5 h-5" />
            <span className="text-sm font-medium">${cooperation.budget.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Package className="w-5 h-5" />
            <span className="text-sm font-medium">{cooperation.deliverables.length} Deliverables</span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm font-medium">
              {daysUntilDeadline > 0 
                ? `${daysUntilDeadline} days left`
                : 'Deadline passed'}
            </span>
          </div>
        </div>

        {/* Latest Message */}
        {cooperation.last_message && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600">{cooperation.last_message.content}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(cooperation.last_message.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mt-4 transition-colors"
        >
          {isExpanded ? (
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
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-gray-100 mt-2 pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Deliverables:</h4>
          <ul className="space-y-2">
            {cooperation.deliverables.map((deliverable, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                {deliverable}
              </li>
            ))}
          </ul>

          <div className="flex gap-3 mt-6">
            <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Open Chat
            </button>
            <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" />
              View Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Cooperations() {
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<Cooperation['status'] | 'all'>('all');

  const filteredCooperations = mockCooperations.filter(
    coop => filter === 'all' || coop.status === filter
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">My Cooperations</h1>
        <div className="flex gap-2">
          {(['all', 'in_progress', 'review', 'completed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                filter === status
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All' : 
               status === 'in_progress' ? 'In Progress' :
               status === 'review' ? 'In Review' : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {filteredCooperations.map(cooperation => (
          <CooperationCard key={cooperation.id} cooperation={cooperation} />
        ))}
      </div>
    </div>
  );
}