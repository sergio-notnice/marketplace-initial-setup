import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Star, 
  DollarSign, 
  MapPin,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react';

// Mock creators data
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
    interests: ['Travel', 'Lifestyle', 'Sustainability', 'Photography', 'Food', 'Wellness', 'Fashion'],
    basePrice: 350
  },
  {
    id: 'creator2',
    name: 'Michael Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Tech reviewer and gaming enthusiast creating engaging content for tech brands',
    rating: 4.6,
    languages: [
      { code: 'en', name: 'English' },
      { code: 'zh', name: 'Chinese' }
    ],
    location: {
      city: 'San Francisco',
      country: 'USA'
    },
    interests: ['Tech', 'Gaming', 'Gadgets'],
    basePrice: 500
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
    interests: ['Beauty', 'Fashion', 'Lifestyle'],
    basePrice: 400
  }
];

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

function CreatorCard({ creator }: { creator: any }) {
  const navigate = useNavigate();
  const MAX_VISIBLE_TAGS = 3;
  const hasMoreTags = creator.interests.length > MAX_VISIBLE_TAGS;
  const visibleTags = creator.interests.slice(0, MAX_VISIBLE_TAGS);
  
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Profile Image */}
      <div className="h-48 flex-shrink-0 relative">
        <img
          src={creator.avatar}
          alt={creator.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-4 right-4 px-4 py-1.5 bg-black/75 backdrop-blur-sm rounded-full flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-white" />
          <span className="text-white font-medium">${creator.basePrice}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        {/* Creator Info */}
        <div className="space-y-4 mb-6">
          {/* Creator Name */}
          <h3 className="text-xl font-semibold text-gray-900">{creator.name}</h3>
          
          {/* Rating and Location */}
          <div className="space-y-1">
            <RatingStars rating={creator.rating} />
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{creator.location.city}</span>
            </div>
          </div>

          {/* Languages */}
          <div className="flex flex-wrap gap-2">
            {creator.languages.map(lang => (
              <div key={lang.code} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                <span className={`fi fi-${lang.code === 'en' ? 'gb' : lang.code}`}></span>
                <span className="ml-1">{lang.name}</span>
              </div>
            ))}
          </div>

          {/* Interests/Tags */}
          <div className="flex flex-wrap gap-2">
            {visibleTags.map(interest => (
              <span
                key={interest}
                className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
              >
                {interest}
              </span>
            ))}
            {hasMoreTags && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1">
                <MoreHorizontal className="w-4 h-4" />
                {creator.interests.length - MAX_VISIBLE_TAGS} more
              </span>
            )}
          </div>
        </div>

        {/* View Profile Button */}
        <button
          onClick={() => navigate(`/brand/creators/${creator.id}`)}
          className="w-full px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          View Profile
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function Creators() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCreators = mockCreators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         creator.bio.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Find Creators</h1>
        <span className="text-sm text-gray-500">
          {filteredCreators.length} creators found
        </span>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search creators by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Creator List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map(creator => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </div>
  );
}