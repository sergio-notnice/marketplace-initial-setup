import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('AuthCallback: Handling callback');
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        if (!session) {
          console.log('AuthCallback: No session found');
          navigate('/login');
          return;
        }

        console.log('AuthCallback: Got session:', session);

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        if (!profile) {
          console.log('AuthCallback: Creating new user profile');
          // Create new user
          const userData = {
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'User',
            role: 'creator',
            avatar_url: session.user.user_metadata?.avatar_url
          };

          const { data: newUser, error: createError } = await supabase
            .from('users')
            .insert([userData])
            .select()
            .single();

          if (createError) throw createError;

          // Create creator profile
          const { error: creatorError } = await supabase
            .from('creator_profiles')
            .insert([{
              user_id: session.user.id,
              bio: '',
              categories: [],
              social_links: {},
              stats: { rating: 0 }
            }]);

          if (creatorError) {
            console.error('Error creating creator profile:', creatorError);
          }

          console.log('AuthCallback: Created new user:', newUser);
          setUser(newUser);
          navigate('/creator/profile');
        } else {
          console.log('AuthCallback: Found existing user:', profile);
          setUser(profile);
          navigate(profile.role === 'brand' ? '/brand/campaigns' : '/creator/profile');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="text-gray-600">Completing sign in...</p>
      </div>
    </div>
  );
}