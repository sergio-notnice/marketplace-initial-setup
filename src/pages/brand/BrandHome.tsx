import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  MessageSquare,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock data for development
const mockStats = {
  totalCampaigns: 12,
  activeCampaigns: 5,
  totalCreators: 87,
  poolCreators: 24,
  totalSpent: 45600,
  monthlyBudget: 15000,
  campaignPerformance: [
    { month: 'Jan', value: 4200 },
    { month: 'Feb', value: 5800 },
    { month: 'Mar', value: 7500 },
    { month: 'Apr', value: 6300 },
    { month: 'May', value: 9200 },
    { month: 'Jun', value: 8100 },
  ],
  recentActivity: [
    {
      id: 'act1',
      type: 'application',
      title: 'New application received',
      description: 'John Doe applied to your Summer Collection campaign',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      id: 'act2',
      type: 'delivery',
      title: 'Content delivered',
      description: 'Sarah Smith submitted final content for review',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    },
    {
      id: 'act3',
      type: 'message',
      title: 'New message',
      description: 'Mike Johnson: "When can we discuss the next steps?"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    },
    {
      id: 'act4',
      type: 'campaign',
      title: 'Campaign ended',
      description: 'Winter Collection campaign has ended',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
  ],
  upcomingDeadlines: [
    {
      id: 'deadline1',
      campaign: 'Summer Collection',
      creator: 'John Doe',
      deliverable: 'Instagram Post',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days from now
      status: 'on_track',
    },
    {
      id: 'deadline2',
      campaign: 'Fitness Apparel',
      creator: 'Sarah Smith',
      deliverable: 'YouTube Video',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
      status: 'at_risk',
    },
    {
      id: 'deadline3',
      campaign: 'Tech Accessories',
      creator: 'Mike Johnson',
      deliverable: 'TikTok Video',
      deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
      status: 'on_track',
    },
  ],
};

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString();
  }
}

function formatDeadline(deadline: string): string {
  const date = new Date(deadline);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays < 7) {
    return `In ${diffDays} days`;
  } else {
    return date.toLocaleDateString();
  }
}

function ActivityIcon({ type }: { type: string }) {
  switch (type) {
    case 'application':
      return <Users className="w-5 h-5 text-blue-500" />;
    case 'delivery':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'message':
      return <MessageSquare className="w-5 h-5 text-indigo-500" />;
    case 'campaign':
      return <Calendar className="w-5 h-5 text-purple-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-gray-500" />;
  }
}

function StatusIcon({ status }: { status: string }) {
  switch (status) {
    case 'on_track':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case 'at_risk':
      return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    case 'late':
      return <XCircle className="w-5 h-5 text-red-500" />;
    default:
      return <Clock className="w-5 h-5 text-gray-500" />;
  }
}

export default function BrandHome() {
  const { user } = useAuthStore();

  // Calculate budget usage percentage
  const budgetUsagePercent = Math.min(100, Math.round((mockStats.totalSpent / mockStats.monthlyBudget) * 100));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Welcome back,</span>
          <span className="font-medium">{user?.name}</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Campaigns</p>
              <p className="text-2xl font-bold mt-1">{mockStats.totalCampaigns}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="flex items-center text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +{mockStats.activeCampaigns}
            </span>
            <span className="text-gray-500 ml-2">Active campaigns</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Creator Network</p>
              <p className="text-2xl font-bold mt-1">{mockStats.totalCreators}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="flex items-center text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              +{mockStats.poolCreators}
            </span>
            <span className="text-gray-500 ml-2">In your creator pool</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold mt-1">${mockStats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="flex items-center text-green-600">
              <TrendingUp className="w-4 h-4 mr-1" />
              +12%
            </span>
            <span className="text-gray-500 ml-2">vs. last month</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Budget</p>
              <p className="text-2xl font-bold mt-1">${mockStats.monthlyBudget.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-500">Budget usage</span>
              <span className={budgetUsagePercent > 80 ? "text-red-600" : "text-gray-700"}>
                {budgetUsagePercent}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={cn(
                  "h-2 rounded-full",
                  budgetUsagePercent > 80 ? "bg-red-600" : "bg-green-600"
                )}
                style={{ width: `${budgetUsagePercent}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Performance Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Campaign Performance</h2>
            <select className="text-sm border-gray-300 rounded-md">
              <option>Last 6 months</option>
              <option>Last 12 months</option>
              <option>This year</option>
            </select>
          </div>
          
          <div className="h-64 flex items-end">
            {mockStats.campaignPerformance.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div 
                  className="w-full max-w-[40px] bg-indigo-600 rounded-t-md"
                  style={{ 
                    height: `${(item.value / 10000) * 200}px`,
                    opacity: 0.6 + (index / mockStats.campaignPerformance.length) * 0.4
                  }}
                ></div>
                <div className="text-xs text-gray-500 mt-2">{item.month}</div>
                <div className="text-xs font-medium">${item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800">View all</a>
          </div>
          
          <div className="space-y-4">
            {mockStats.recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <ActivityIcon type={activity.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="mt-8 bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h2>
          <a href="#" className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center">
            View all
            <ChevronRight className="w-4 h-4 ml-1" />
          </a>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Creator</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deliverable</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockStats.upcomingDeadlines.map((deadline) => (
                <tr key={deadline.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{deadline.campaign}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deadline.creator}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{deadline.deliverable}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDeadline(deadline.deadline)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <StatusIcon status={deadline.status} />
                      <span className={cn(
                        "ml-2 text-sm",
                        deadline.status === 'on_track' ? "text-green-600" :
                        deadline.status === 'at_risk' ? "text-yellow-600" :
                        deadline.status === 'late' ? "text-red-600" : "text-gray-500"
                      )}>
                        {deadline.status === 'on_track' ? 'On Track' :
                         deadline.status === 'at_risk' ? 'At Risk' :
                         deadline.status === 'late' ? 'Late' : 'Unknown'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}