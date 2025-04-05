import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';
import { 
  Building,
  Mail,
  Phone,
  MapPin,
  Globe,
  Users,
  Save,
  Edit,
  X,
  AlertTriangle
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url: string | null;
  joined_at: string;
}

interface CompanyDetails {
  name: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  description: string;
}

export default function Company() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'details' | 'team'>('details');
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [companyDetails, setCompanyDetails] = useState<CompanyDetails>({
    name: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    description: ''
  });

  useEffect(() => {
    if (user?.id) {
      fetchCompanyDetails();
      if (activeTab === 'team') {
        fetchTeamMembers();
      }
    }
  }, [user?.id, activeTab]);

  async function fetchCompanyDetails() {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('users')
        .select('name, email')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching company details:', error);
        throw error;
      }

      // For now, we'll just use the user data. In a real app, you'd have a separate company table
      setCompanyDetails(prev => ({
        ...prev,
        name: data.name,
        email: data.email
      }));

    } catch (error) {
      setError('Failed to load company details');
    } finally {
      setLoading(false);
    }
  }

  async function fetchTeamMembers() {
  console.log('Starting fetchTeamMembers...');

  try {
    setLoading(true);
    setError(null);

    console.log('Fetching team members...');

    // 1) Hole den aktiven Workspace aus dem Auth-Store
    const { activeWorkspaceId } = useAuthStore.getState();
    console.log('Active workspace ID:', activeWorkspaceId);

    // 2) Prüfe, ob eine Workspace-ID vorhanden ist
    if (!activeWorkspaceId) {
      console.warn('No active workspace selected. Aborting fetchTeamMembers.');
      setError('No active workspace selected. Please select a workspace first.');
      return;
    }

    console.log('About to query Supabase with eq("workspace_id", activeWorkspaceId)...');

    // 3) Abfrage an Supabase
    const { data: members, error: membersError } = await supabase
      .from('workspace_members')
      .select(`
        workspace_id,
        user_id,
        role,
        joined_at,
        users!workspace_members_user_id_fkey (
          id,
          name,
          email,
          avatar_url
        )
      `)
      .eq('workspace_id', activeWorkspaceId);

    // 4) Fehlerbehandlung
    if (membersError) {
      console.error('Error fetching members from Supabase:', membersError);
      throw membersError;
    }

    // 5) Debugging: Prüfen, ob überhaupt Daten zurückkommen
    if (!members) {
      console.warn('Supabase returned no data (null) for members');
    } else if (members.length === 0) {
      console.warn(`Supabase returned an empty array for workspace_id: ${activeWorkspaceId}`);
    } else {
      console.log(`Supabase returned ${members.length} row(s) for workspace_id: ${activeWorkspaceId}`);
    }

    console.log('Fetched members (raw data):', members);

    // 6) Transformieren der Daten
    const transformedMembers = members?.map(member => {
      // Falls kein "users"-Objekt existiert, debuggen
      if (!member.users) {
        console.warn('Member has no "users" property. Skipping transform for:', member);
        return null;
      }

      return {
        id: member.user_id,
        name: member.users.name,
        email: member.users.email,
        role: member.role,
        avatar_url: member.users.avatar_url,
        joined_at: member.joined_at
      };
    }).filter(Boolean) || [];

    console.log('Transformed members:', transformedMembers);

    // 7) State aktualisieren
    setTeamMembers(transformedMembers);

  } catch (error) {
    console.error('Error in fetchTeamMembers:', error);
    setError('Failed to load team members');
  } finally {
    console.log('Done with fetchTeamMembers. Setting loading=false now.');
    setLoading(false);
  }
}

  async function handleSave() {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase
        .from('users')
        .update({
          name: companyDetails.name,
          email: companyDetails.email
        })
        .eq('id', user?.id);

      if (error) throw error;

      setEditing(false);
    } catch (error) {
      setError('Failed to save company details');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Company Settings</h1>
        {!editing && activeTab === 'details' && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Details
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-lg p-1 shadow-sm">
        <button
          onClick={() => setActiveTab('details')}
          className={cn(
            "flex-1 px-4 py-2 rounded-md",
            activeTab === 'details' ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          Company Details
        </button>
        <button
          onClick={() => setActiveTab('team')}
          className={cn(
            "flex-1 px-4 py-2 rounded-md",
            activeTab === 'team' ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-50"
          )}
        >
          Team Members
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {activeTab === 'details' ? (
        <div className="bg-white rounded-lg shadow-sm p-6">
          {editing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={companyDetails.name}
                  onChange={(e) => setCompanyDetails(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={companyDetails.email}
                  onChange={(e) => setCompanyDetails(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={companyDetails.phone}
                  onChange={(e) => setCompanyDetails(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={companyDetails.website}
                  onChange={(e) => setCompanyDetails(prev => ({ ...prev, website: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={companyDetails.description}
                  onChange={(e) => setCompanyDetails(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Building className="w-10 h-10 text-gray-400" />
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{companyDetails.name}</h2>
                  <p className="text-gray-500">{companyDetails.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{companyDetails.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{companyDetails.phone || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <p className="font-medium">{companyDetails.website || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">
                      {companyDetails.address.street ? (
                        <>
                          {companyDetails.address.street}<br />
                          {companyDetails.address.city}, {companyDetails.address.state} {companyDetails.address.zip}<br />
                          {companyDetails.address.country}
                        </>
                      ) : (
                        'Not set'
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : teamMembers.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team members</h3>
              <p className="text-gray-500 mb-6">Start by inviting team members to your workspace.</p>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center gap-2">
                <Users className="w-4 h-4" />
                Invite Team Members
              </button>
            </div>
          ) : (
            <ul role="list" className="divide-y divide-gray-200">
              {teamMembers.map((member) => (
                <li key={member.id} className="px-6 py-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={member.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}`}
                        alt={member.name}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {member.email}
                      </p>
                    </div>
                    <div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        {member.role}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
