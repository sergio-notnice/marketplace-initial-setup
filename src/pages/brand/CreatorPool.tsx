import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Tag, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Trash2, 
  Heart, 
  Check,
  Users,
  Mail,
  ArrowRight,
  PlusCircle,
  X,
  Briefcase
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

// Mock creators data for development - same as in Creators.tsx
const mockCreators = [
  {
    id: 'creator1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Lifestyle and travel content creator with a passion for sustainable living',
    rating: 4.8,
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' }
    ],
    location: {
      city: 'Barcelona',
      country: 'Spain'
    },
    age: 28,
    interests: ['Travel', 'Lifestyle', 'Sustainability'],
    basePrice: 350,
    followers: 125000,
    engagementRate: 3.2,
    portfolio: [
      'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=300&h=300'
    ],
    notes: 'Great for travel campaigns, responds quickly',
    lastContact: '2025-02-10T00:00:00Z',
    campaigns: [
      { id: 'camp1', name: 'Summer Collection', status: 'completed' }
    ],
    tags: ['Responsive', 'High Quality']
  },
  {
    id: 'creator3',
    name: 'Emma Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Beauty and fashion creator specializing in makeup tutorials and style guides',
    rating: 4.9,
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' }
    ],
    location: {
      city: 'Paris',
      country: 'France'
    },
    age: 26,
    interests: ['Beauty', 'Fashion', 'Lifestyle'],
    basePrice: 400,
    followers: 345000,
    engagementRate: 5.2,
    portfolio: [
      'https://images.unsplash.com/photo-1596902852634-c81c1e733e59?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1596902852634-c81c1e733e59?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1596902852634-c81c1e733e59?auto=format&fit=crop&q=80&w=300&h=300'
    ],
    notes: 'Perfect for beauty campaigns, high engagement rate',
    lastContact: '2025-02-15T00:00:00Z',
    campaigns: [
      { id: 'camp2', name: 'Beauty Collection', status: 'in_progress' }
    ],
    tags: ['Beauty Expert', 'Multilingual']
  },
  {
    id: 'creator5',
    name: 'Olivia Schmidt',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Food blogger and recipe developer creating mouthwatering content for culinary brands',
    rating: 4.5,
    languages: [
      { code: 'en', name: 'English' },
      { code: 'de', name: 'German' }
    ],
    location: {
      city: 'Berlin',
      country: 'Germany'
    },
    age: 34,
    interests: ['Food', 'Cooking', 'Culinary'],
    basePrice: 380,
    followers: 210000,
    engagementRate: 4.5,
    portfolio: [
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=300&h=300',
      'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&q=80&w=300&h=300'
    ],
    notes: 'Excellent food photography, good for culinary campaigns',
    lastContact: '2025-01-20T00:00:00Z',
    campaigns: [],
    tags: ['Food Expert', 'Creative']
  }
];

// Available tags for filtering
const allTags = Array.from(new Set(mockCreators.flatMap(creator => creator.tags || [])));

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalfStar && (
        <Star className="w-4 h-4 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />
      )}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

function CreatorCard({ creator, onRemove, onMessage, onAddNote, onAddTag }: { 
  creator: any; 
  onRemove: () => void;
  onMessage: () => void;
  onAddNote: (note: string) => void;
  onAddTag: (tag: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState(creator.notes || '');
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTag, setNewTag] = useState('');
  const navigate = useNavigate();
  
  const handleSaveNote = () => {
    onAddNote(note);
    setShowNoteInput(false);
  };
  
  const handleAddTag = () => {
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
      setShowTagInput(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{creator.name}</h3>
              <div className="flex items-center gap-4 mt-1">
                <RatingStars rating={creator.rating} />
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{creator.location.city}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{creator.age} years</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">${creator.basePrice}</span>
            </div>
          </div>
        </div>
        
        {/* Bio */}
        <p className="mt-4 text-gray-600">{creator.bio}</p>
        
        {/* Languages */}
        <div className="mt-4 flex flex-wrap gap-2">
          {creator.languages.map(lang => (
            <div key={lang.code} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-sm">
              <span className={`fi fi-${lang.code === 'en' ? 'gb' : lang.code}`}></span>
              <span>{lang.name}</span>
            </div>
          ))}
        </div>
        
        {/* Tags */}
        <div className="mt-4 flex flex-wrap gap-2 items-center">
          {creator.tags && creator.tags.map((tag: string) => (
            <span
              key={tag}
              className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
          
          {showTagInput ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <button
                onClick={handleAddTag}
                className="p-1 text-indigo-600 hover:text-indigo-800"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowTagInput(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowTagInput(true)}
              className="px-2 py-1 border border-gray-300 rounded-full text-sm text-gray-500 hover:bg-gray-50 flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              Add Tag
            </button>
          )}
        </div>
        
        {/* Notes */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-medium text-gray-700">Notes</h4>
            {!showNoteInput && (
              <button
                onClick={() => setShowNoteInput(true)}
                className="text-xs text-indigo-600 hover:text-indigo-800"
              >
                {creator.notes ? 'Edit' : 'Add Note'}
              </button>
            )}
          </div>
          
          {showNoteInput ? (
            <div className="space-y-2">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                rows={3}
                placeholder="Add notes about this creator..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNoteInput(false)}
                  className="px-2 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-2 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md min-h-[40px]">
              {creator.notes || 'No notes yet'}
            </p>
          )}
        </div>
        
        {/* Last Contact */}
        {creator.lastContact && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>Last contacted: {formatDate(creator.lastContact)}</span>
          </div>
        )}
        
        {/* Actions */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Show less
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show more
              </>
            )}
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onMessage}
              className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center gap-1"
            >
              <MessageSquare className="w-4 h-4" />
              Message
            </button>
            
            <button
              onClick={() => navigate('/brand/campaign/new')}
              className="px-3 py-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              Invite to Campaign
            </button>
            
            <button
              onClick={onRemove}
              className="p-2 text-gray-400 hover:text-red-500 transition"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-gray-100 pt-4">
          {/* Portfolio */}
          <h4 className="text-sm font-medium text-gray-900 mb-3">Portfolio</h4>
          <div className="grid grid-cols-3 gap-3">
            {creator.portfolio.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Portfolio ${index + 1}`}
                className="w-full h-32 object-cover rounded-md"
              />
            ))}
          </div>
          
          {/* Stats and Campaigns */}
          <div className="mt-6 grid grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Audience Stats</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="text-sm font-medium">{creator.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Engagement Rate</span>
                  <span className="text-sm font-medium">{creator.engagementRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Base Price</span>
                  <span className="text-sm font-medium">${creator.basePrice}</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Past Campaigns</h4>
              {creator.campaigns && creator.campaigns.length > 0 ? (
                <div className="space-y-2">
                  {creator.campaigns.map((campaign: any) => (
                    <div key={campaign.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">{campaign.name}</span>
                      </div>
                      <span className={cn(
                        "text-xs px-2 py-0.5 rounded-full",
                        campaign.status === 'completed' ? "bg-green-100 text-green-800" :
                        campaign.status === 'in_progress' ? "bg-blue-100 text-blue-800" :
                        "bg-gray-100 text-gray-800"
                      )}>
                        {campaign.status === 'completed' ? 'Completed' : 
                         campaign.status === 'in_progress' ? 'In Progress' : 
                         campaign.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No campaigns yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreatorPool() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [poolCreators, setPoolCreators] = useState(mockCreators);
  const navigate = useNavigate();
  
  const handleRemoveFromPool = (creatorId: string) => {
    setPoolCreators(prev => prev.filter(creator => creator.id !== creatorId));
  };
  
  const handleMessage = (creatorId: string) => {
    // In a real app, this would open a chat with the creator
    alert(`Opening chat with creator ${creatorId}`);
  };
  
  const handleAddNote = (creatorId: string, note: string) => {
    setPoolCreators(prev => 
      prev.map(creator => 
        creator.id === creatorId 
          ? { ...creator, notes: note } 
          : creator
      )
    );
  };
  
  const handleAddTag = (creatorId: string, tag: string) => {
    setPoolCreators(prev => 
      prev.map(creator => 
        creator.id === creatorId 
          ? { 
              ...creator, 
              tags: creator.tags ? [...creator.tags, tag] : [tag] 
            } 
          : creator
      )
    );
  };
  
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  // Filter creators based on selected filters
  const filteredCreators = poolCreators.filter(creator => {
    // Search term filter
    if (searchTerm && !creator.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !creator.bio.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Tags filter
    if (selectedTags.length > 0 && 
        (!creator.tags || !selectedTags.some(tag => creator.tags.includes(tag)))) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Creator Pool</h1>
          <p className="text-gray-500 mt-1">Manage your saved creators and invite them to campaigns</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/brand/creators')}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            Find More Creators
          </button>
          <button
            onClick={() => navigate('/brand/campaign/new')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </div>
      
      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Creators</p>
              <p className="text-2xl font-bold">{poolCreators.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Campaigns</p>
              <p className="text-2xl font-bold">
                {poolCreators.filter(c => c.campaigns && c.campaigns.some((camp: any) => camp.status === 'in_progress')).length}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Engagement</p>
              <p className="text-2xl font-bold">
                {(poolCreators.reduce((sum, c) => sum + c.engagementRate, 0) / poolCreators.length).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search your creator pool..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            <Filter className="w-5 h-5 text-gray-500" />
            Filter by Tags
            {selectedTags.length > 0 && (
              <span className="inline-flex items-center justify-center w-5 h-5 bg-indigo-600 text-white text-xs font-medium rounded-full">
                {selectedTags.length}
              </span>
            )}
          </button>
        </div>
        
        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Filter by Tags</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    "px-3 py-1 rounded-full text-sm",
                    selectedTags.includes(tag)
                      ? "bg-indigo-100 text-indigo-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  )}
                >
                  {tag}
                </button>
              ))}
              {allTags.length === 0 && (
                <p className="text-sm text-gray-500">No tags available yet. Add tags to creators to filter by them.</p>
              )}
            </div>
            
            {selectedTags.length > 0 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-sm text-indigo-600 hover:text-indigo-800"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Creator List */}
      <div className="space-y-6">
        {filteredCreators.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your creator pool is empty</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm || selectedTags.length > 0 
                ? "No creators match your search criteria. Try adjusting your filters."
                : "Add creators to your pool to easily find them later and invite them to campaigns."}
            </p>
            {!searchTerm && selectedTags.length === 0 && (
              <button
                onClick={() => navigate('/brand/creators')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition flex items-center gap-2 mx-auto"
              >
                Find Creators
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          filteredCreators.map(creator => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onRemove={() => handleRemoveFromPool(creator.id)}
              onMessage={() => handleMessage(creator.id)}
              onAddNote={(note) => handleAddNote(creator.id, note)}
              onAddTag={(tag) => handleAddTag(creator.id, tag)}
            />
          ))
        )}
      </div>
    </div>
  );
}