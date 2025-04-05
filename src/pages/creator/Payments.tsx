import React, { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { 
  DollarSign, 
  CreditCard, 
  Wallet, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  ExternalLink, 
  Trash2,
  Clock,
  Download,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Mock payment methods for development
const mockPaymentMethods = [
  {
    id: 'pm_1',
    type: 'stripe',
    status: 'connected',
    details: {
      accountId: 'acct_1234567890',
      email: 'dev@example.com',
      last4: '4242',
      country: 'US',
      currency: 'USD'
    },
    connected_at: '2025-01-15T00:00:00Z'
  }
];

// Mock payment history for development
const mockPaymentHistory = [
  {
    id: 'pmt_1',
    amount: 2500,
    currency: 'USD',
    status: 'completed',
    date: '2025-02-15T00:00:00Z',
    from: {
      name: 'Nike Marketing',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100'
    },
    campaign: 'Summer Sports Collection',
    reference: 'INV-2025-001'
  },
  {
    id: 'pmt_2',
    amount: 1800,
    currency: 'USD',
    status: 'pending',
    date: '2025-02-20T00:00:00Z',
    from: {
      name: 'Adidas Sports',
      logo: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=100&h=100'
    },
    campaign: 'Sustainable Fashion Campaign',
    reference: 'INV-2025-002'
  },
  {
    id: 'pmt_3',
    amount: 3200,
    currency: 'USD',
    status: 'completed',
    date: '2025-01-25T00:00:00Z',
    from: {
      name: 'Puma Lifestyle',
      logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100&h=100'
    },
    campaign: 'Winter Training Gear',
    reference: 'INV-2025-003'
  }
];

// Mock payment stats for development
const mockPaymentStats = {
  total_earned: 7500,
  pending_amount: 1800,
  available_balance: 5700,
  currency: 'USD',
  last_payout: '2025-02-10T00:00:00Z',
  next_payout_estimate: '2025-03-01T00:00:00Z'
};

function PaymentMethodCard({ method, onRemove }: { method: any; onRemove: (id: string) => void }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {method.type === 'stripe' ? (
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-indigo-600" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">
              {method.type === 'stripe' ? 'Stripe Account' : 'PayPal Account'}
            </h3>
            <p className="text-sm text-gray-600">
              {method.details.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3" />
            Connected
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Account ID</p>
            <p className="font-medium">{method.details.accountId}</p>
          </div>
          {method.details.last4 && (
            <div>
              <p className="text-gray-500">Card ending in</p>
              <p className="font-medium">••••{method.details.last4}</p>
            </div>
          )}
          <div>
            <p className="text-gray-500">Country</p>
            <p className="font-medium">{method.details.country}</p>
          </div>
          <div>
            <p className="text-gray-500">Currency</p>
            <p className="font-medium">{method.details.currency}</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-6">
        <button 
          onClick={() => onRemove(method.id)}
          className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" />
          Disconnect
        </button>
        
        <a 
          href={method.type === 'stripe' ? 'https://dashboard.stripe.com' : 'https://paypal.com'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
        >
          Go to dashboard
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}

function PaymentHistoryItem({ payment, expanded, onToggle }: { payment: any; expanded: boolean; onToggle: () => void }) {
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    failed: 'bg-red-100 text-red-800'
  };
  
  const statusIcons = {
    completed: <CheckCircle className="w-4 h-4" />,
    pending: <Clock className="w-4 h-4" />,
    failed: <AlertCircle className="w-4 h-4" />
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={payment.from.logo} 
              alt={payment.from.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h3 className="font-medium text-gray-900">{payment.from.name}</h3>
              <p className="text-sm text-gray-600">{payment.campaign}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[payment.status as keyof typeof statusColors]}`}>
              {statusIcons[payment.status as keyof typeof statusIcons]}
              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
            </span>
            <div className="text-right">
              <p className="font-semibold text-gray-900">${payment.amount.toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                {new Date(payment.date).toLocaleDateString()}
              </p>
            </div>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm mb-4">
            <div>
              <p className="text-gray-500">Reference</p>
              <p className="font-medium">{payment.reference}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium">{new Date(payment.date).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-500">Amount</p>
              <p className="font-medium">${payment.amount.toLocaleString()} {payment.currency}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium capitalize">{payment.status}</p>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium flex items-center gap-1 hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4" />
              View Invoice
            </button>
            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Download Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Payments() {
  const { user } = useAuthStore();
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [paymentHistory] = useState(mockPaymentHistory);
  const [expandedPayment, setExpandedPayment] = useState<string | null>(null);
  const [connectingStripe, setConnectingStripe] = useState(false);
  const [connectingPaypal, setConnectingPaypal] = useState(false);
  
  const handleRemovePaymentMethod = (id: string) => {
    // In a real app, this would call an API to disconnect the payment method
    setPaymentMethods(prev => prev.filter(method => method.id !== id));
  };
  
  const handleConnectStripe = () => {
    setConnectingStripe(true);
    // Simulate API call delay
    setTimeout(() => {
      setConnectingStripe(false);
      // In a real app, this would redirect to Stripe Connect OAuth flow
      alert('This would redirect to Stripe Connect in a real application');
    }, 1500);
  };
  
  const handleConnectPaypal = () => {
    setConnectingPaypal(true);
    // Simulate API call delay
    setTimeout(() => {
      setConnectingPaypal(false);
      // In a real app, this would redirect to PayPal OAuth flow
      alert('This would redirect to PayPal Connect in a real application');
    }, 1500);
  };
  
  const togglePaymentDetails = (paymentId: string) => {
    setExpandedPayment(expandedPayment === paymentId ? null : paymentId);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Payments</h1>
      
      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Total Earned</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">${mockPaymentStats.total_earned.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Lifetime earnings</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Pending</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">${mockPaymentStats.pending_amount.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Awaiting clearance</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <Wallet className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Available</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">${mockPaymentStats.available_balance.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">
            Next payout: {new Date(mockPaymentStats.next_payout_estimate).toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
          <div className="flex gap-3">
            <button
              onClick={handleConnectStripe}
              disabled={connectingStripe || paymentMethods.some(m => m.type === 'stripe')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connectingStripe ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Connect Stripe
                </>
              )}
            </button>
            
            <button
              onClick={handleConnectPaypal}
              disabled={connectingPaypal || paymentMethods.some(m => m.type === 'paypal')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {connectingPaypal ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Connecting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Connect PayPal
                </>
              )}
            </button>
          </div>
        </div>
        
        {paymentMethods.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods connected</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Connect your Stripe or PayPal account to receive payments directly from brands.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleConnectStripe}
                disabled={connectingStripe}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                {connectingStripe ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Connect Stripe
                  </>
                )}
              </button>
              
              <button
                onClick={handleConnectPaypal}
                disabled={connectingPaypal}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {connectingPaypal ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    Connect PayPal
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map(method => (
              <PaymentMethodCard 
                key={method.id} 
                method={method} 
                onRemove={handleRemovePaymentMethod} 
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Payment History */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment History</h2>
        
        {paymentHistory.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No payment history yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Your payment history will appear here once you start receiving payments from brands.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentHistory.map(payment => (
              <PaymentHistoryItem 
                key={payment.id} 
                payment={payment} 
                expanded={expandedPayment === payment.id}
                onToggle={() => togglePaymentDetails(payment.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}