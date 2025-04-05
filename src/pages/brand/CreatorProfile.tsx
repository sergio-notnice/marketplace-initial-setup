import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  DollarSign, 
  MessageSquare, 
  PlusCircle, 
  PlayCircle, 
  ChevronLeft, 
  ChevronRight, 
  Heart, 
  Briefcase,
  Loader2
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const mockCreators = {
  'creator1': {
    id: 'creator1',
    name: 'Sarah Johnson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    bio: 'Lifestyle and travel content creator with a passion for sustainable living. I specialize in creating authentic, engaging content that resonates with audiences who care about sustainable living and mindful travel.',
    rating: 4.8,
    languages: [
      { code: 'en', name: 'English' },
      { code: 'es', name: 'Spanish' }
    ],
    location: {
      city: 'Barcelona',
      country: 'Spain'
    },
    interests: ['Travel', 'Lifestyle', 'Sustainability'],
    basePrice: 350,
    stats: {
      completedProjects: 45
    },
    portfolio: [
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?auto=format&fit=crop&q=80&w=600&h=400',
        title: 'Sustainable Travel Guide'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600&h=400',
        title: 'Eco-Friendly Living'
      },
      {
        type: 'image',
        url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&q=80&w=600&h=400',
        title: 'Mindful Moments'
      }
    ],
    videos: [
      {
        title: 'Sustainable Travel Tips',
        thumbnail: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6?auto=format&fit=crop&q=80&w=600&h=400',
        duration: '3:45'
      },
      {
        title: 'Zero Waste Living',
        thumbnail: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&q=80&w=600&h=400',
        duration: '5:20'
      }
    ]
  }
};

function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      ))}
      {hasHalfStar && <Star className="w-5 h-5 text-yellow-400" style={{ clipPath: 'inset(0 50% 0 0)' }} />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="w-5 h-5 text-yellow-400" />
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function CreatorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAuthStore();
  
  const creator = mockCreators[id as keyof typeof mockCreators];
  
  if (!creator) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">Creator not found</h2>
          <p className="mt-2 text-gray-600">The creator you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/brand/creators')}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Back to Creators
          </button>
        </div>
      </div>
    );
  }

  const startChat = async () => {
    if (!user || !creator) return;

    try {
      // First check if a conversation already exists
      const { data: existingConversations, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('brand_id', user.id)
        .eq('creator_id', creator.id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      let conversationId;

      if (existingConversations) {
        // Use existing conversation
        conversationId = existingConversations.id;
      } else {
        // Create new conversation
        const { data: newConversation, error: createError } = await supabase
          .from('conversations')
          .insert({
            brand_id: user.id,
            creator_id: creator.id
          })
          .select('id')
          .single();

        if (createError) throw createError;
        conversationId = newConversation.id;
      }

      // Navigate to chat with this conversation selected
      navigate('/brand/chat', { 
        state: { selectedConversation: conversationId }
      });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/brand/creators')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Creators
      </button>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
        <div className="flex items-start gap-8">
          {/* Avatar and Price */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-32 h-32 rounded-xl object-cover"
            />
            <div className="text-center">
              <div className="text-sm text-gray-600">Base Price</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <DollarSign className="w-5 h-5 text-gray-400" />
                <div className="text-xl font-semibold">${creator.basePrice}</div>
              </div>
            </div>
          </div>
          
          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{creator.name}</h1>
            <div className="mt-2 flex items-center gap-4">
              <RatingStars rating={creator.rating} />
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{creator.location.city}, {creator.location.country}</span>
              </div>
            </div>
            
            {/* Bio */}
            <p className="mt-4 text-gray-600">{creator.bio}</p>
            
            {/* Languages */}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {creator.languages?.map(language => (
                  <div key={language.code} className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 rounded-md text-sm">
                    <span className={`fi fi-${language.code === 'en' ? 'gb' : language.code}`}></span>
                    <span>{language.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-6">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Add to Pool
              </button>
              <button 
                onClick={startChat}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
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

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Completed Projects</h3>
              <p className="text-2xl font-bold mt-1">{creator.stats.completedProjects}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Portfolio</h2>
        <div className="relative">
          <Swiper
            spaceBetween={24}
            slidesPerView={3}
            onSlideChange={(swiper) => setCurrentSlide(swiper.activeIndex)}
          >
            {creator.portfolio.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden group">
                  <img
                    src={item.url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <p className="text-white font-medium">{item.title}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {currentSlide > 0 && (
            <button
              onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
          )}
          
          {currentSlide < creator.portfolio.length - 3 && (
            <button
              onClick={() => setCurrentSlide(prev => Math.min(creator.portfolio.length - 3, prev + 1))}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-10"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Videos */}
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Content Examples</h2>
        <div className="grid grid-cols-2 gap-6">
          {creator.videos.map((video, index) => (
            <div key={index} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <PlayCircle className="w-12 h-12 text-white" />
              </div>
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black to-transparent">
                <p className="text-white font-medium">{video.title}</p>
                <p className="text-gray-300 text-sm">{video.duration}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}