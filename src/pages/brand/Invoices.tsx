import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Filter
} from 'lucide-react';
import { cn } from '../../lib/utils';

// Mock invoices for development
const mockInvoices = [
  {
    id: 'INV-2025-001',
    creator: {
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    campaign: 'Summer Collection',
    amount: 2500,
    date: '2025-02-15',
    dueDate: '2025-03-15',
    status: 'paid',
    items: [
      { description: 'Instagram Post', quantity: 3, unitPrice: 500, total: 1500 },
      { description: 'Instagram Story', quantity: 5, unitPrice: 100, total: 500 },
      { description: 'TikTok Video', quantity: 1, unitPrice: 500, total: 500 }
    ]
  },
  {
    id: 'INV-2025-002',
    creator: {
      name: 'Sarah Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    campaign: 'Fitness Apparel',
    amount: 3200,
    date: '2025-02-20',
    dueDate: '2025-03-20',
    status: 'pending',
    items: [
      { description: 'YouTube Video', quantity: 1, unitPrice: 2000, total: 2000 },
      { description: 'Instagram Post', quantity: 2, unitPrice: 600, total: 1200 }
    ]
  },
  {
    id: 'INV-2025-003',
    creator: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    campaign: 'Tech Accessories',
    amount: 1800,
    date: '2025-02-25',
    dueDate: '2025-03-25',
    status: 'overdue',
    items: [
      { description: 'Product Review Video', quantity: 1, unitPrice: 1200, total: 1200 },
      { description: 'Social Media Posts', quantity: 3, unitPrice: 200, total: 600 }
    ]
  },
  {
    id: 'INV-2025-004',
    creator: {
      name: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    campaign: 'Beauty Products',
    amount: 2100,
    date: '2025-03-01',
    dueDate: '2025-04-01',
    status: 'paid',
    items: [
      { description: 'Instagram Reels', quantity: 3, unitPrice: 500, total: 1500 },
      { description: 'Product Photos', quantity: 6, unitPrice: 100, total: 600 }
    ]
  },
  {
    id: 'INV-2025-005',
    creator: {
      name: 'Alex Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    campaign: 'Home Decor',
    amount: 1500,
    date: '2025-03-05',
    dueDate: '2025-04-05',
    status: 'pending',
    items: [
      { description: 'Blog Post', quantity: 1, unitPrice: 800, total: 800 },
      { description: 'Pinterest Pins', quantity: 10, unitPrice: 70, total: 700 }
    ]
  }
];

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    paid: {
      color: 'bg-green-100 text-green-800',
      icon: CheckCircle,
      text: 'Paid'
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: Clock,
      text: 'Pending'
    },
    overdue: {
      color: 'bg-red-100 text-red-800',
      icon: AlertCircle,
      text: 'Overdue'
    }
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {config.text}
    </span>
  );
}

function InvoiceRow({ invoice, expanded, onToggle }: { 
  invoice: any; 
  expanded: boolean; 
  onToggle: () => void;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
      <div 
        className="bg-white p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0">
            <img 
              src={invoice.creator.avatar} 
              alt={invoice.creator.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-gray-900">{invoice.id}</p>
            <p className="text-sm text-gray-500">{invoice.creator.name} • {invoice.campaign}</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <StatusBadge status={invoice.status} />
          <div className="text-right">
            <p className="font-semibold text-gray-900">${invoice.amount.toLocaleString()}</p>
            <p className="text-xs text-gray-500">
              Due: {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
          <button className="text-gray-400">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      {expanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Invoice Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Invoice Number</p>
                <p className="font-medium">{invoice.id}</p>
              </div>
              <div>
                <p className="text-gray-500">Issue Date</p>
                <p className="font-medium">{new Date(invoice.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Due Date</p>
                <p className="font-medium">{new Date(invoice.dueDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Status</p>
                <StatusBadge status={invoice.status} />
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Invoice Items</h4>
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{item.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-500 text-right">{item.quantity}</td>
                    <td className="px-4 py-2 text-sm text-gray-500 text-right">${item.unitPrice}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">${item.total}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td colSpan={3} className="px-4 py-2 text-sm font-medium text-gray-900 text-right">Total</td>
                  <td className="px-4 py-2 text-sm font-bold text-gray-900 text-right">${invoice.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end gap-3">
            <button className="px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium flex items-center gap-1 hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4" />
              View PDF
            </button>
            <button className="px-3 py-1.5 bg-indigo-600 text-white rounded-md text-sm font-medium flex items-center gap-1 hover:bg-indigo-700 transition-colors">
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Invoices() {
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const toggleInvoiceDetails = (invoiceId: string) => {
    setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
  };
  
  const filteredInvoices = mockInvoices.filter(invoice => {
    const matchesSearch = 
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.campaign.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const totalAmount = filteredInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Invoices</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <FileText className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Total Invoices</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">{mockInvoices.length}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Paid</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {mockInvoices.filter(inv => inv.status === 'paid').length}
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Pending</h2>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {mockInvoices.filter(inv => inv.status === 'pending').length}
          </p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-md py-2 pl-3 pr-10 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>
      
      {/* Invoice List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            Showing {filteredInvoices.length} invoices
            {statusFilter !== 'all' && ` with status "${statusFilter}"`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
          <p className="text-sm font-medium">
            Total: <span className="font-bold">${totalAmount.toLocaleString()}</span>
          </p>
        </div>
        
        {filteredInvoices.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              {searchTerm || statusFilter !== 'all' 
                ? "Try adjusting your search or filters to find what you're looking for."
                : "You don't have any invoices yet. They will appear here once created."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvoices.map(invoice => (
              <InvoiceRow 
                key={invoice.id} 
                invoice={invoice} 
                expanded={expandedInvoice === invoice.id}
                onToggle={() => toggleInvoiceDetails(invoice.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}