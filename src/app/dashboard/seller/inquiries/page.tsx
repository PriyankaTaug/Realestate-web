"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  MdCheckCircle, 
  MdNotifications,
  MdAccessTime,
  MdMailOutline
} from "react-icons/md";
import { FaEnvelope, FaPhone, FaSpinner } from "react-icons/fa";
import "@/api/clientConfig";
import { AuthService } from "@/api/client";
import { OpenAPI } from "@/api/client/core/OpenAPI";
import { apiClient } from "@/api/clientConfig";
import type { UserOut } from "@/api/client/models/UserOut";

// Helper function to format time ago
const formatTimeAgo = (date: string | Date): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
};

interface Inquiry {
  id: string;
  propertyTitle: string;
  propertyId: number;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string | null;
  message: string | null;
  status: 'new' | 'replied' | 'closed';
  created_at: string | Date;
}

export default function SellerInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserOut | null>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'replied'>('all');
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Fetch user and inquiries
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Set token
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('kh_token');
          if (token) {
            OpenAPI.TOKEN = token;
            
            // Fetch user
            const userData = await AuthService.readMeApiAuthMeGet();
            setUser(userData);
            
            // Fetch inquiries for this seller
            const response = await apiClient.get(`/api/inquiries/?seller_id=${userData.id}&limit=100`);
            
            if (response.data && response.data.items) {
              const mappedInquiries: Inquiry[] = response.data.items.map((inq: any) => ({
                id: String(inq.id),
                propertyTitle: inq.property?.title || 'Unknown Property',
                propertyId: inq.property_id,
                buyerName: inq.buyer_name,
                buyerEmail: inq.buyer_email,
                buyerPhone: inq.buyer_phone,
                message: inq.message || '',
                status: inq.status || 'new',
                created_at: inq.created_at
              }));
              
              setInquiries(mappedInquiries);
            }
          }
        }
      } catch (error: any) {
        console.error('Failed to load inquiries', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredInquiries = inquiries.filter(inquiry => 
    filter === 'all' || inquiry.status === filter
  );

  const handleReply = async (inquiryId: string) => {
    if (!replyMessage.trim()) return;

    const inquiry = inquiries.find(i => i.id === inquiryId);
    if (!inquiry) return;

    try {
      setUpdatingStatus(inquiryId);
      
      // Send reply email to buyer and update inquiry status
      await apiClient.post(`/api/inquiries/${inquiryId}/reply`, {
        message: replyMessage
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // Update local state
      setInquiries(prev => prev.map(inq => {
        if (inq.id === inquiryId) {
          return {
            ...inq,
            status: 'replied' as const
          };
        }
        return inq;
      }));

      setReplyMessage('');
      setSelectedInquiry(null);
      alert('Reply sent successfully to buyer!');
    } catch (error: any) {
      console.error('Failed to send reply', error);
      alert(error.response?.data?.detail || 'Failed to send reply. Please try again.');
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Inquiries</h1>
          <p className="text-neutral-600">Manage and respond to buyer inquiries</p>
        </div>
        <Link
          href="/dashboard/seller"
          className="text-emerald-600 hover:text-emerald-700 text-sm font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MdMailOutline className="text-blue-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Inquiries</p>
              <p className="text-xl font-bold text-neutral-900">{inquiries.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <MdCheckCircle className="text-green-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Replied</p>
              <p className="text-xl font-bold text-neutral-900">
                {inquiries.filter(i => i.status === 'replied').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <MdNotifications className="text-orange-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-neutral-600">New</p>
              <p className="text-xl font-bold text-neutral-900">
                {inquiries.filter(i => i.status === 'new').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All ({inquiries.length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'new'
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            New ({inquiries.filter(i => i.status === 'new').length})
          </button>
          <button
            onClick={() => setFilter('replied')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'replied'
                ? 'bg-emerald-600 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Replied ({inquiries.filter(i => i.status === 'replied').length})
          </button>
        </div>
      </div>

      {/* Inquiries List */}
      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
          <FaSpinner className="text-4xl text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading inquiries...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInquiries.map((inquiry) => (
          <div key={inquiry.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                  <span className="text-emerald-600 font-semibold">
                    {inquiry.buyerName.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-neutral-900">{inquiry.buyerName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      inquiry.status === 'new' 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-600 mb-1">
                    Re: <span className="font-medium">{inquiry.propertyTitle}</span>
                  </p>
                  <div className="flex items-center gap-4 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <FaEnvelope className="text-xs" /> {inquiry.buyerEmail}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaPhone className="text-xs" /> {inquiry.buyerPhone}
                    </span>
                    <span className="flex items-center gap-1">
                      <MdAccessTime className="text-xs" /> {formatTimeAgo(inquiry.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4 mb-4">
              <p className="text-neutral-700">{inquiry.message}</p>
            </div>


            {/* Reply Form */}
            {selectedInquiry === inquiry.id ? (
              <div className="border-t pt-4">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full p-3 border border-neutral-300 rounded-lg resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                />
                <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleReply(inquiry.id)}
                  disabled={updatingStatus === inquiry.id}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {updatingStatus === inquiry.id ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Send Reply'
                  )}
                </button>
                  <button
                    onClick={() => {
                      setSelectedInquiry(null);
                      setReplyMessage('');
                    }}
                    className="border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-2 pt-4 border-t">
                <button
                  onClick={() => setSelectedInquiry(inquiry.id)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        ))}
        </div>
      )}

      {!loading && filteredInquiries.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
          <div className="flex justify-center mb-4">
            <MdMailOutline className="text-6xl text-neutral-400" />
          </div>
          <h3 className="text-lg font-semibold text-neutral-900 mb-2">
            No {filter !== 'all' ? filter : ''} inquiries found
          </h3>
          <p className="text-neutral-600">
            {filter === 'all' 
              ? "You haven't received any inquiries yet." 
              : `No ${filter} inquiries at the moment.`
            }
          </p>
        </div>
      )}
    </div>
  );
}
