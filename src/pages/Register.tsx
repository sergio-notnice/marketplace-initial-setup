import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { 
  Mail, 
  Lock, 
  User, 
  Building2, 
  Camera, 
  AlertCircle,
  Loader2
} from 'lucide-react';

interface RegisterFormData {
  email: string;
  password: string;
  name: string;
  role: 'brand' | 'creator';
}

export default function Register() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      setError(null);

      // Sign up with email
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role
          }
        }
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Create user profile in users table
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              email: data.email,
              name: data.name,
              role: data.role
            }
          ]);

        if (profileError) throw profileError;

        // If user is a creator, create creator profile
        if (data.role === 'creator') {
          const { error: creatorError } = await supabase
            .from('creator_profiles')
            .insert([
              {
                user_id: authData.user.id,
                bio: '',
                categories: [],
                social_links: {},
                stats: { rating: 0 }
              }
            ]);

          if (creatorError) throw creatorError;
        }

        setUser({
          id: authData.user.id,
          email: data.email,
          name: data.name,
          role: data.role,
          created_at: new Date().toISOString()
        });

        // Redirect based on role
        navigate(data.role === 'brand' ? '/brand/campaigns' : '/creator/profile');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) throw error;
    } catch (err) {
      console.error('Google sign up error:', err);
      setError(err instanceof Error ? err.message : 'Failed to sign up with Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              sign in to your existing account
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Registration failed</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('name', { required: 'Name is required' })}
                  type="text"
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  })}
                  type="password"
                  className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 focus-within:ring-2 focus-within:ring-indigo-500">
                  <input
                    {...register('role', { required: 'Please select an account type' })}
                    type="radio"
                    value="brand"
                    className="sr-only"
                  />
                  <div className="flex flex-1 items-center gap-3">
                    <Building2 className="h-5 w-5 text-gray-400" />
                    <div>
                      <span className="block text-sm font-medium text-gray-900">Brand</span>
                      <span className="block text-xs text-gray-500">For companies and agencies</span>
                    </div>
                  </div>
                  <div 
                    className={`absolute -inset-px rounded-lg border-2 pointer-events-none ${
                      errors.role ? 'border-red-500' : ''
                    }`}
                    aria-hidden="true"
                  />
                </label>

                <label className="relative flex cursor-pointer rounded-lg border border-gray-300 bg-white p-4 focus-within:ring-2 focus-within:ring-indigo-500">
                  <input
                    {...register('role', { required: 'Please select an account type' })}
                    type="radio"
                    value="creator"
                    className="sr-only"
                  />
                  <div className="flex flex-1 items-center gap-3">
                    <Camera className="h-5 w-5 text-gray-400" />
                    <div>
                      <span className="block text-sm font-medium text-gray-900">Creator</span>
                      <span className="block text-xs text-gray-500">For content creators</span>
                    </div>
                  </div>
                  <div 
                    className={`absolute -inset-px rounded-lg border-2 pointer-events-none ${
                      errors.role ? 'border-red-500' : ''
                    }`}
                    aria-hidden="true"
                  />
                </label>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Create account'
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <img 
                src="https://www.google.com/favicon.ico" 
                alt="Google" 
                className="w-5 h-5"
              />
              Sign up with Google
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}