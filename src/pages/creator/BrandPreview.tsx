import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { 
  MapPin, 
  Star,
  MessageSquare,
  PlusCircle,
  Languages,
  Tag,
  DollarSign,
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Heart,
  Eye,
  Globe,
  Loader2,
  Info
} from 'lucide-react';
import type { CreatorProfile } from '../../types';

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalfStar && <Star className="w-4 h-4 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
      <span className="ml-1 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function BrandPreview() {
  const { id } = useParams();
  const { previewMode } = useAuthStore();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPriceInfo, setShowPriceInfo] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  async function fetchProfile() {
    try {
      setLoading(true);
      setError(null);

      // Fetch creator profile
      const { data: profileData, error: profileError } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', id)
        .single();

      if (profileError) throw profileError;

      // Fetch languages
      const { data: languagesData, error: languagesError } = await supabase
        .from('creator_languages')
        .select('*')
        .eq('creator_id', profileData.id);

      if (languagesError) throw languagesError;

      // Fetch videos
      const { data: videosData, error: videosError } = await supabase
        .from('creator_videos')
        .select('*')
        .eq('creator_id', id);

      if (videosError) throw videosError;

      // Fetch portfolio items
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('creator_portfolio_items')
        .select('*')
        .eq('creator_id', profileData.id);

      if (portfolioError) throw portfolioError;

      // Fetch user data for personal info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (userError) throw userError;

      // Combine the data
      const fullProfile = {
        ...profileData,
        languages: languagesData || [],
        videos: videosData || [],
        portfolio: portfolioData || [],
        personalInfo: {
          firstName: userData.name.split(' ')[0],
          lastName: userData.name.split(' ').slice(1).join(' '),
          email: userData.email,
          phone: profileData.phone || '',
          address: profileData.address?.street || '',
          avatar_url: userData.avatar_url
        }
      };

      setProfile(fullProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Creator profile not found</h2>
          <p className="mt-2 text-gray-600">The creator profile you're looking for does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Preview Notice */}
      {previewMode === 'brand' && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Eye className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-medium text-indigo-900">Brand Preview Mode</h2>
              <p className="text-sm text-indigo-700">This is how brands see your profile</p>
            </div>
          </div>
          <Link
            to="/creator/profile"
            className="px-4 py-2 bg-white text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Edit
          </Link>
        </div>
      )}

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-start gap-8">
          {/* Avatar and Price */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={profile.personalInfo.avatar_url || `https://ui-avatars.com/api/?name=${profile.personalInfo.firstName}+${profile.personalInfo.lastName}&size=256`}
              alt={`${profile.personalInfo.firstName} ${profile.personalInfo.lastName}`}
              className="w-32 h-32 rounded-xl object-cover"
            />
            <div className="text-center relative group">
              <div className="text-sm text-gray-600 mb-1 flex items-center justify-center gap-1">
                Base Price
                <button
                  onMouseEnter={() => setShowPriceInfo(true)}
                  onMouseLeave={() => setShowPriceInfo(false)}
                  className="relative"
                >
                  <Info className="w-4 h-4 text-gray-400" />
                  {showPriceInfo && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg">
                      This is what the creator normally charges for a 15 sec video with editing.
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 border-4 border-transparent border-t-gray-800"></div>
                    </div>
                  )}
                </button>
              </div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div className="text-xl font-semibold">${profile.base_price}</div>
              </div>
            </div>
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.personalInfo.firstName} {profile.personalInfo.lastName}
            </h2>
            <div className="mt-2 flex items-center gap-4">
              {profile.stats?.rating && <RatingStars rating={profile.stats.rating} />}
              {profile.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-5 h-5" />
                  <span>{profile.location.city}, {profile.location.country}</span>
                </div>
              )}
            </div>
            
            {/* Bio */}
            <p className="mt-4 text-gray-600">{profile.bio}</p>
            
            {/* Languages */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages?.map(language => (
                  <div key={language.id} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-md text-sm">
                    <span className={`fi fi-${language.language.toLowerCase() === 'english' ? 'gb' : language.language.toLowerCase()}`}></span>
                    <span>{language.language}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            {profile.interests && profile.interests.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map(interest => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Add to Pool
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Message
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Invite to Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      {profile.portfolio && profile.portfolio.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Portfolio</h2>
          <div className="grid grid-cols-3 gap-6">
            {profile.portfolio.map((item, index) => (
              <div key={item.id} className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                <img
                  src={item.media_urls[0]}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <p className="text-white font-medium">{item.title}</p>
                    {item.description && (
                      <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Videos */}
      {profile.videos && profile.videos.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Content Examples</h2>
          <div className="grid grid-cols-2 gap-6">
            {profile.videos.map((video) => (
              <div key={video.id} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                <video
                  src={video.url}
                  className="w-full h-full object-cover"
                  controls
                  poster={`https://ui-avatars.com/api/?name=${encodeURIComponent(video.title)}&size=400`}
                >
                  <source src={video.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <p className="text-white font-medium">{video.title}</p>
                  <p className="text-gray-300 text-sm">{video.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}