import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  Bell, 
  Globe, 
  Lock, 
  Shield, 
  Eye, 
  EyeOff, 
  Save, 
  Trash2, 
  AlertTriangle,
  Moon,
  Sun,
  Smartphone,
  Mail,
  Check,
  CreditCard
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock settings data for development
const mockSettings = {
  notifications: {
    email: {
      applications: true,
      messages: true,
      deliverables: true,
      updates: false
    },
    push: {
      applications: true,
      messages: true,
      deliverables: true,
      updates: true
    },
    marketing: false
  },
  appearance: {
    theme: 'light', // 'light', 'dark', 'system'
    compactView: false,
    animationsReduced: false
  },
  privacy: {
    profileVisibility: 'public', // 'public', 'registered', 'private'
    showBudget: true,
    allowDataCollection: true
  },
  language: 'en', // 'en', 'de', 'fr', etc.
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: '2024-12-15T00:00:00Z',
    activeSessions: [
      {
        id: 'session1',
        device: 'Chrome on Windows',
        location: 'New York, USA',
        lastActive: '2025-02-20T14:30:00Z',
        current: true
      },
      {
        id: 'session2',
        device: 'Safari on iPhone',
        location: 'New York, USA',
        lastActive: '2025-02-18T09:15:00Z',
        current: false
      }
    ]
  },
  billing: {
    plan: 'business',
    billingCycle: 'monthly',
    nextBillingDate: '2025-03-15T00:00:00Z',
    autoRenew: true
  }
};

// Available languages
const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'it', name: 'Italiano' }
];

// Available plans
const plans = [
  { 
    id: 'starter', 
    name: 'Starter', 
    price: 99,
    features: [
      'Up to 5 active campaigns',
      'Basic analytics',
      'Email support'
    ]
  },
  { 
    id: 'business', 
    name: 'Business', 
    price: 299,
    features: [
      'Unlimited campaigns',
      'Advanced analytics',
      'Priority support',
      'Team collaboration'
    ]
  },
  { 
    id: 'enterprise', 
    name: 'Enterprise', 
    price: 999,
    features: [
      'Everything in Business',
      'Custom integrations',
      'Dedicated account manager',
      'White-label options'
    ]
  }
];

function ToggleSwitch({ 
  enabled, 
  onChange, 
  label,
  description
}: { 
  enabled: boolean; 
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <h3 className="text-sm font-medium text-gray-900">{label}</h3>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <button
        type="button"
        className={cn(
          "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
          enabled ? "bg-indigo-600" : "bg-gray-200"
        )}
        role="switch"
        aria-checked={enabled}
        onClick={onChange}
      >
        <span
          className={cn(
            "pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
            enabled ? "translate-x-5" : "translate-x-0"
          )}
        >
          <span
            className={cn(
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
              enabled ? "opacity-0 duration-100 ease-out" : "opacity-100 duration-200 ease-in"
            )}
            aria-hidden="true"
          >
            <EyeOff className="h-3 w-3 text-gray-400" />
          </span>
          <span
            className={cn(
              "absolute inset-0 flex h-full w-full items-center justify-center transition-opacity",
              enabled ? "opacity-100 duration-200 ease-in" : "opacity-0 duration-100 ease-out"
            )}
            aria-hidden="true"
          >
            <Eye className="h-3 w-3 text-indigo-600" />
          </span>
        </span>
      </button>
    </div>
  );
}

function NotificationSettings() {
  const [settings, setSettings] = useState(mockSettings.notifications);
  const [saved, setSaved] = useState(false);

  const handleToggle = (category: 'email' | 'push', type: string) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: !prev[category][type]
      }
    }));
    setSaved(false);
  };

  const handleMarketingToggle = () => {
    setSettings(prev => ({
      ...prev,
      marketing: !prev.marketing
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, this would call an API to save settings
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h2>
        <div className="space-y-1 divide-y divide-gray-200">
          <ToggleSwitch
            enabled={settings.email.applications}
            onChange={() => handleToggle('email', 'applications')}
            label="Creator Applications"
            description="Receive emails when creators apply to your campaigns"
          />
          <ToggleSwitch
            enabled={settings.email.messages}
            onChange={() => handleToggle('email', 'messages')}
            label="Messages"
            description="Receive emails when you get new messages from creators"
          />
          <ToggleSwitch
            enabled={settings.email.deliverables}
            onChange={() => handleToggle('email', 'deliverables')}
            label="Deliverable Updates"
            description="Receive emails when creators submit deliverables or updates"
          />
          <ToggleSwitch
            enabled={settings.email.updates}
            onChange={() => handleToggle('email', 'updates')}
            label="Platform Updates"
            description="Receive emails about new features and platform updates"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h2>
        <div className="space-y-1 divide-y divide-gray-200">
          <ToggleSwitch
            enabled={settings.push.applications}
            onChange={() => handleToggle('push', 'applications')}
            label="Creator Applications"
            description="Receive push notifications when creators apply to your campaigns"
          />
          <ToggleSwitch
            enabled={settings.push.messages}
            onChange={() => handleToggle('push', 'messages')}
            label="Messages"
            description="Receive push notifications when you get new messages from creators"
          />
          <ToggleSwitch
            enabled={settings.push.deliverables}
            onChange={() => handleToggle('push', 'deliverables')}
            label="Deliverable Updates"
            description="Receive push notifications when creators submit deliverables or updates"
          />
          <ToggleSwitch
            enabled={settings.push.updates}
            onChange={() => handleToggle('push', 'updates')}
            label="Platform Updates"
            description="Receive push notifications about new features and platform updates"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Marketing Preferences</h2>
        <div className="space-y-1">
          <ToggleSwitch
            enabled={settings.marketing}
            onChange={handleMarketingToggle}
            label="Marketing Communications"
            description="Receive emails about promotions, special offers, and marketing campaigns"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function BillingSettings() {
  const [settings, setSettings] = useState(mockSettings.billing);
  const [saved, setSaved] = useState(false);

  const handlePlanChange = (planId: string) => {
    setSettings(prev => ({ ...prev, plan: planId }));
    setSaved(false);
  };

  const handleBillingCycleChange = (cycle: string) => {
    setSettings(prev => ({ ...prev, billingCycle: cycle }));
    setSaved(false);
  };

  const handleAutoRenewToggle = () => {
    setSettings(prev => ({ ...prev, autoRenew: !prev.autoRenew }));
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, this would call an API to save settings
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  const currentPlan = plans.find(p => p.id === settings.plan);
  const priceMultiplier = settings.billingCycle === 'annual' ? 10 : 1;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Current Plan</h2>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{currentPlan?.name} Plan</h3>
              <p className="text-gray-500">
                {settings.billingCycle === 'monthly' ? 'Monthly billing' : 'Annual billing'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">
                ${(currentPlan?.price || 0) * priceMultiplier}
                <span className="text-sm font-normal text-gray-500">
                  /{settings.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </p>
              <p className="text-sm text-gray-500">
                Next billing date: {new Date(settings.nextBillingDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-900">Plan Features:</h3>
          <ul className="space-y-2">
            {currentPlan?.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Change Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map(plan => (
            <div 
              key={plan.id}
              className={cn(
                "border rounded-lg p-4 cursor-pointer transition-colors",
                settings.plan === plan.id 
                  ? "border-indigo-600 bg-indigo-50" 
                  : "border-gray-200 hover:bg-gray-50"
              )}
              onClick={() => handlePlanChange(plan.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                <div className="w-4 h-4 rounded-full border border-indigo-600 flex items-center justify-center">
                  {settings.plan === plan.id && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  )}
                </div>
              </div>
              <p className="text-xl font-bold mb-2">
                ${plan.price * priceMultiplier}
                <span className="text-sm font-normal text-gray-500">
                  /{settings.billingCycle === 'monthly' ? 'mo' : 'yr'}
                </span>
              </p>
              <ul className="space-y-1 mt-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-1 text-xs text-gray-600">
                    <Check className="w-3 h-3 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Billing Cycle</h3>
          <div className="flex gap-4">
            <div 
              className={cn(
                "border rounded-lg p-3 cursor-pointer transition-colors flex-1",
                settings.billingCycle === 'monthly' 
                  ? "border-indigo-600 bg-indigo-50" 
                  : "border-gray-200 hover:bg-gray-50"
              )}
              onClick={() => handleBillingCycleChange('monthly')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Monthly</h4>
                  <p className="text-xs text-gray-500">Billed every month</p>
                </div>
                <div className="w-4 h-4 rounded-full border border-indigo-600 flex items-center justify-center">
                  {settings.billingCycle === 'monthly' && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  )}
                </div>
              </div>
            </div>
            <div 
              className={cn(
                "border rounded-lg p-3 cursor-pointer transition-colors flex-1",
                settings.billingCycle === 'annual' 
                  ? "border-indigo-600 bg-indigo-50" 
                  : "border-gray-200 hover:bg-gray-50"
              )}
              onClick={() => handleBillingCycleChange('annual')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Annual</h4>
                  <p className="text-xs text-gray-500">Billed yearly (save 16%)</p>
                </div>
                <div className="w-4 h-4 rounded-full border border-indigo-600 flex items-center justify-center">
                  {settings.billingCycle === 'annual' && (
                    <div className="w-2 h-2 rounded-full bg-indigo-600"></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <ToggleSwitch
            enabled={settings.autoRenew}
            onChange={handleAutoRenewToggle}
            label="Auto-renew subscription"
            description="Your subscription will automatically renew at the end of the billing cycle"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
        <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              Visa •••• 4242
              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">
                Default
              </span>
            </h3>
            <p className="text-sm text-gray-500">Expires 12/25</p>
          </div>
          <div className="ml-auto">
            <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Change
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  const [settings, setSettings] = useState(mockSettings.appearance);
  const [saved, setSaved] = useState(false);

  const handleThemeChange = (theme: string) => {
    setSettings(prev => ({ ...prev, theme }));
    setSaved(false);
  };

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, this would call an API to save settings
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Theme</h2>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => handleThemeChange('light')}
            className={cn(
              "flex flex-col items-center p-4 border rounded-lg transition-colors",
              settings.theme === 'light' 
                ? "border-indigo-600 bg-indigo-50" 
                : "border-gray-200 hover:bg-gray-50"
            )}
          >
            <Sun className={cn(
              "w-8 h-8 mb-2",
              settings.theme === 'light' ? "text-indigo-600" : "text-gray-400"
            )} />
            <span className={cn(
              "text-sm font-medium",
              settings.theme === 'light' ? "text-indigo-600" : "text-gray-700"
            )}>Light</span>
          </button>
          
          <button
            onClick={() => handleThemeChange('dark')}
            className={cn(
              "flex flex-col items-center p-4 border rounded-lg transition-colors",
              settings.theme === 'dark' 
                ? "border-indigo-600 bg-indigo-50" 
                : "border-gray-200 hover:bg-gray-50"
            )}
          >
            <Moon className={cn(
              "w-8 h-8 mb-2",
              settings.theme === 'dark' ? "text-indigo-600" : "text-gray-400"
            )} />
            <span className={cn(
              "text-sm font-medium",
              settings.theme === 'dark' ? "text-indigo-600" : "text-gray-700"
            )}>Dark</span>
          </button>
          
          <button
            onClick={() => handleThemeChange('system')}
            className={cn(
              "flex flex-col items-center p-4 border rounded-lg transition- colors",
              settings.theme === 'system' 
                ? "border-indigo-600 bg-indigo-50" 
                : "border-gray-200 hover:bg-gray-50"
            )}
          >
            <div className={cn(
              "w-8 h-8 mb-2 flex items-center justify-center",
              settings.theme === 'system' ? "text-indigo-600" : "text-gray-400"
            )}>
              <Sun className="w-4 h-4" />
              <Moon className="w-4 h-4" />
            </div>
            <span className={cn(
              "text-sm font-medium",
              settings.theme === 'system' ? "text-indigo-600" : "text-gray-700"
            )}>System</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Display Options</h2>
        <div className="space-y-1 divide-y divide-gray-200">
          <ToggleSwitch
            enabled={settings.compactView}
            onChange={() => handleToggle('compactView')}
            label="Compact View"
            description="Use a more compact layout to fit more content on screen"
          />
          <ToggleSwitch
            enabled={settings.animationsReduced}
            onChange={() => handleToggle('animationsReduced')}
            label="Reduce Animations"
            description="Minimize animations and transitions throughout the interface"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function PrivacySettings() {
  const [settings, setSettings] = useState(mockSettings.privacy);
  const [saved, setSaved] = useState(false);

  const handleVisibilityChange = (visibility: string) => {
    setSettings(prev => ({ ...prev, profileVisibility: visibility }));
    setSaved(false);
  };

  const handleToggle = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev]
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, this would call an API to save settings
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Company Profile Visibility</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              id="visibility-public"
              name="visibility"
              type="radio"
              checked={settings.profileVisibility === 'public'}
              onChange={() => handleVisibilityChange('public')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="visibility-public" className="ml-3">
              <div className="text-sm font-medium text-gray-900">Public</div>
              <p className="text-xs text-gray-500">Your company profile is visible to everyone, including non-registered users</p>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="visibility-registered"
              name="visibility"
              type="radio"
              checked={settings.profileVisibility === 'registered'}
              onChange={() => handleVisibilityChange('registered')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="visibility-registered" className="ml-3">
              <div className="text-sm font-medium text-gray-900">Registered Users Only</div>
              <p className="text-xs text-gray-500">Only registered brands and creators can view your company profile</p>
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              id="visibility-private"
              name="visibility"
              type="radio"
              checked={settings.profileVisibility === 'private'}
              onChange={() => handleVisibilityChange('private')}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
            />
            <label htmlFor="visibility-private" className="ml-3">
              <div className="text-sm font-medium text-gray-900">Private</div>
              <p className="text-xs text-gray-500">Your company profile is only visible to creators you've worked with</p>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Privacy Options</h2>
        <div className="space-y-1 divide-y divide-gray-200">
          <ToggleSwitch
            enabled={settings.showBudget}
            onChange={() => handleToggle('showBudget')}
            label="Show Campaign Budgets"
            description="Allow creators to see your campaign budgets in public listings"
          />
          <ToggleSwitch
            enabled={settings.allowDataCollection}
            onChange={() => handleToggle('allowDataCollection')}
            label="Data Collection"
            description="Allow us to collect usage data to improve your experience"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Data & Privacy</h2>
        <div className="space-y-4">
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            Download company data
          </button>
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View privacy policy
          </button>
          <button className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1">
            <Trash2 className="w-4 h-4" />
            Delete company account
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function SecuritySettings() {
  const [settings, setSettings] = useState(mockSettings.security);
  const [saved, setSaved] = useState(false);

  const handleToggle2FA = () => {
    setSettings(prev => ({
      ...prev,
      twoFactorEnabled: !prev.twoFactorEnabled
    }));
    setSaved(false);
  };

  const handleRemoveSession = (sessionId: string) => {
    setSettings(prev => ({
      ...prev,
      activeSessions: prev.activeSessions.filter(session => session.id !== sessionId)
    }));
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, this would call an API to save settings
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Account Security</h2>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-900">Password</h3>
              <button className="text-sm text-indigo-600 hover:text-indigo-800">
                Change password
              </button>
            </div>
            <p className="text-xs text-gray-500">
              Last changed: {new Date(settings.lastPasswordChange).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <ToggleSwitch
              enabled={settings.twoFactorEnabled}
              onChange={handleToggle2FA}
              label="Two-Factor Authentication"
              description="Add an extra layer of security to your account"
            />
            {!settings.twoFactorEnabled && (
              <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">
                Set up two-factor authentication
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Active Sessions</h2>
        <div className="space-y-4">
          {settings.activeSessions.map(session => (
            <div key={session.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-900">{session.device}</p>
                    {session.current && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {session.location} • Last active {new Date(session.lastActive).toLocaleString()}
                  </p>
                </div>
              </div>
              {!session.current && (
                <button
                  onClick={() => handleRemoveSession(session.id)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Sign out
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            Sign out of all other sessions
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function LanguageSettings() {
  const [selectedLanguage, setSelectedLanguage] = useState(mockSettings.language);
  const [saved, setSaved] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    setSaved(false);
  };

  const handleSave = () => {
    // In a real app, this would call an API to save settings
    setTimeout(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Language Settings</h2>
        <div className="max-w-xs">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
            Interface Language
          </label>
          <select
            id="language"
            name="language"
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            {languages.map(language => (
              <option key={language.code} value={language.code}>
                {language.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            This will change the language of the user interface
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function BrandSettings() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'notifications' | 'appearance' | 'privacy' | 'security' | 'language' | 'billing'>('notifications');

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Sun },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'billing', label: 'Billing & Plan', icon: CreditCard }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Settings</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <nav className="flex flex-col">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium border-l-2 transition-colors",
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-600 border-l-indigo-600"
                      : "text-gray-600 border-l-transparent hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {activeTab === 'notifications' && <NotificationSettings />}
          {activeTab === 'appearance' && <AppearanceSettings />}
          {activeTab === 'privacy' && <PrivacySettings />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'language' && <LanguageSettings />}
          {activeTab === 'billing' && <BillingSettings />}
        </div>
      </div>
    </div>
  );
}