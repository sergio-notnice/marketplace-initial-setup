import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Languages,
  Tag,
  DollarSign,
  Save,
  Eye,
  X,
  Loader2,
  Mail,
  Phone,
  Plus,
  Check,
  Trash2
} from 'lucide-react';
import type { CreatorProfile, Language } from '../../types';
import { LanguageSelector, LanguageItem } from '../../components/ui/language-selector';

// Available languages with their codes
const availableLanguages = [
  { code: 'de', name: 'German' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'es', name: 'Spanish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'pl', name: 'Polish' },
  { code: 'cs', name: 'Czech' },
  { code: 'sk', name: 'Slovak' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'ro', name: 'Romanian' },
  { code: 'hr', name: 'Croatian' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'da', name: 'Danish' },
  { code: 'fi', name: 'Finnish' },
  { code: 'no', name: 'Norwegian' },
  { code: 'sv', name: 'Swedish' },
  { code: 'ar', name: 'Arabic' }
];

// Available interests for selection
const availableInterests = [
  'Fashion',
  'Beauty',
  'Fitness',
  'Health',
  'Travel',
  'Outdoors',
  'Food',
  'Cooking',
  'Technology',
  'Gadgets',
  'Lifestyle',
  'DIY',
  'Art',
  'Music',
  'Gaming'
];

export default function Profile() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showInterestSelector, setShowInterestSelector] = useState(false);
  const [fetchAttempted, setFetchAttempted] = useState(false);

  useEffect(() => {
    if (user?.id && !fetchAttempted) {
      fetchProfile();
    }
  }, [user?.id, fetchAttempted]);

  async function fetchProfile() {
    try {
      setLoading(true);
      setError(null);
      setFetchAttempted(true);

      // First check if profile exists
      let { data: existingProfile, error: profileError } = await supabase
        .from('creator_profiles')
        .select(`
          *,
          languages:creator_languages(
            id,
            language,
            proficiency,
            is_content_language
          )
        `)
        .eq('user_id', user?.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') { // PGRST116 is "not found"
        throw profileError;
      }

      // If no profile exists, create one
      if (!existingProfile) {
        const { data: newProfile, error: createError } = await supabase
          .from('creator_profiles')
          .insert({
            user_id: user?.id,
            bio: '',
            stats: { rating: 0 },
            base_price: 0,
            interests: []
          })
          .select()
          .single();

        if (createError) throw createError;
        existingProfile = newProfile;
      }

      // Fetch user data for personal info
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (userError) throw userError;

      // Combine the data
      const fullProfile = {
        ...existingProfile,
        personalInfo: {
          firstName: userData.name.split(' ')[0],
          lastName: userData.name.split(' ').slice(1).join(' '),
          email: userData.email,
          phone: existingProfile.phone || '',
          address: existingProfile.address?.street || ''
        }
      };

      setProfile(fullProfile);
      setFormData(fullProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!formData) return;
    
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => prev ? {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      } : null);
    } else {
      setFormData(prev => prev ? {
        ...prev,
        [name]: value
      } : null);
    }
  };

  const handleSave = async () => {
    if (!formData || !user) return;

    try {
      setSaving(true);
      setError(null);

      // Update creator profile
      const { error: profileError } = await supabase
        .from('creator_profiles')
        .update({
          bio: formData.bio,
          base_price: formData.base_price || 0,
          phone: formData.personalInfo.phone,
          location: {
            city: formData.location?.city,
            country: formData.location?.country
          },
          address: {
            street: formData.personalInfo.address
          },
          interests: formData.interests || []
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Update user name
      const { error: userError } = await supabase
        .from('users')
        .update({
          name: `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Update languages
      if (formData.languages) {
        const { error: langError } = await supabase
          .from('creator_languages')
          .upsert(
            formData.languages.map(lang => ({
              id: lang.id || crypto.randomUUID(),
              creator_id: profile?.id,
              ...lang
            }))
          );

        if (langError) throw langError;
      }

      await fetchProfile();
      setEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setEditing(false);
  };

  const toggleInterest = (interest: string) => {
    if (!formData) return;

    setFormData(prev => {
      if (!prev) return null;

      const currentInterests = prev.interests || [];
      const newInterests = currentInterests.includes(interest)
        ? currentInterests.filter(i => i !== interest)
        : [...currentInterests, interest];

      return {
        ...prev,
        interests: newInterests
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-red-800">Error loading profile</h3>
          <p className="text-red-700">{error}</p>
          <button
            onClick={fetchProfile}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile || !formData) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-yellow-800">Profile not found</h3>
          <p className="text-yellow-700">Could not find your creator profile. Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Creator Profile</h1>
        <div className="flex items-center gap-3">
          <Link
            to={`/creator/${user?.id}`}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Brand Preview
          </Link>
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 mb-6">
        <div className="flex items-start gap-8">
          {/* Avatar and Price */}
          <div className="flex flex-col items-center gap-4">
            <img
              src={user?.avatar_url || `https://ui-avatars.com/api/?name=${formData.personalInfo.firstName}+${formData.personalInfo.lastName}`}
              alt={`${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`}
              className="w-32 h-32 rounded-xl object-cover"
            />
            <div className="text-center relative group">
              <div className="text-sm text-gray-600 mb-1 flex items-center justify-center gap-1">
                Base Price
                <div className="relative">
                  <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center cursor-help">
                    <span className="text-xs text-gray-500">i</span>
                  </div>
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    What would you charge for a 15 sec video with editing? This information helps brands to evaluate if you are in their budget range.
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 border-4 border-transparent border-t-gray-800"></div>
                  </div>
                </div>
              </div>
              {editing ? (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleInputChange}
                    className="w-24 px-2 py-1 border border-gray-300 rounded-md"
                    min="0"
                    step="1"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1 mt-1">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div className="text-xl font-semibold">${formData.base_price}</div>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            {editing ? (
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="personalInfo.firstName"
                    value={formData.personalInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="personalInfo.lastName"
                    value={formData.personalInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            ) : (
              <h2 className="text-2xl font-bold text-gray-900">
                {formData.personalInfo.firstName} {formData.personalInfo.lastName}
              </h2>
            )}

            <div className="mt-2 flex items-center gap-4">
              {editing ? (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location?.city || ''}
                    onChange={handleInputChange}
                    className="w-32 px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    name="location.country"
                    value={formData.location?.country || ''}
                    onChange={handleInputChange}
                    className="w-32 px-2 py-1 border border-gray-300 rounded-md"
                    placeholder="Country"
                  />
                </div>
              ) : (
                formData.location && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{formData.location.city}, {formData.location.country}</span>
                  </div>
                )
              )}
            </div>

            {/* Bio */}
            {editing ? (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Tell brands about yourself..."
                />
              </div>
            ) : (
              <p className="mt-4 text-gray-600">{formData.bio}</p>
            )}

            {/* Interests */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Interests</h3>
                {editing && (
                  <button
                    onClick={() => setShowInterestSelector(!showInterestSelector)}
                    className="text-sm text-indigo-600 hover:text-indigo-800"
                  >
                    {showInterestSelector ? 'Done' : 'Edit Interests'}
                  </button>
                )}
              </div>
              {editing && showInterestSelector ? (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {availableInterests.map(interest => {
                      const isSelected = formData.interests?.includes(interest);
                      return (
                        <button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
                            isSelected 
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4" />}
                          <span>{interest}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {formData.interests?.map(interest => (
                    <span
                      key={interest}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Languages */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Languages className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Languages</h3>
          </div>
          
          {editing && (
            <div className="mb-4">
              <LanguageSelector
                onAdd={(language) => {
                  setFormData(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      languages: [...(prev.languages || []), {
                        ...language,
                        id: crypto.randomUUID()
                      }].slice(0, 5)
                    };
                  });
                }}
                existingLanguages={formData.languages}
              />
            </div>
          )}
          
          <div className="space-y-3">
            {formData.languages?.map((language, index) => (
              <LanguageItem
                key={`${language.language}-${index}`}
                language={language}
                onRemove={editing ? () => {
                  setFormData(prev => {
                    if (!prev) return null;
                    return {
                      ...prev,
                      languages: prev.languages?.filter((_, i) => i !== index)
                    };
                  });
                } : undefined}
              />
            ))}
            {!formData.languages?.length && (
              <p className="text-sm text-gray-500 text-center py-4">
                No languages added yet
              </p>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
          </div>
          <div className="space-y-3">
            {editing ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="personalInfo.email"
                    value={formData.personalInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="personalInfo.phone"
                    value={formData.personalInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="personalInfo.address"
                    value={formData.personalInfo.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{formData.personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{formData.personalInfo.phone || 'Not set'}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{formData.personalInfo.address || 'Not set'}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}