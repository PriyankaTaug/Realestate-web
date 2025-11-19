"use client";

import { useState } from "react";
import Link from "next/link";

// Mock data for demonstration
const mockInquiries = [
  {
    id: '1',
    propertyTitle: 'My Family Home',
    propertyId: '1',
    buyerName: 'Rajesh Kumar',
    buyerEmail: 'rajesh@email.com',
    buyerPhone: '+91 9876543210',
    message: 'Interested in scheduling a visit this weekend. Can we arrange a viewing on Saturday or Sunday?',
    time: '2 hours ago',
    status: 'new',
    replies: []
  },
  {
    id: '2',
    propertyTitle: 'Investment Apartment',
    propertyId: '2',
    buyerName: 'Priya Nair',
    buyerEmail: 'priya@email.com',
    buyerPhone: '+91 9876543211',
    message: 'Can you provide more details about the parking facility? Is it covered parking?',
    time: '5 hours ago',
    status: 'replied',
    replies: [
      {
        id: 'r1',
        message: 'Yes, it has covered parking for 2 cars. The parking is included in the price.',
        sender: 'seller',
        time: '3 hours ago'
      }
    ]
  },
  {
    id: '3',
    propertyTitle: 'My Family Home',
    propertyId: '1',
    buyerName: 'Arun Menon',
    buyerEmail: 'arun@email.com',
    buyerPhone: '+91 9876543212',
    message: 'Is the price negotiable? I am genuinely interested in this property.',
    time: '1 day ago',
    status: 'new',
    replies: []
  },
  {
    id: '4',
    propertyTitle: 'Investment Apartment',
    propertyId: '2',
    buyerName: 'Meera Singh',
    buyerEmail: 'meera@email.com',
    buyerPhone: '+91 9876543213',
    message: 'What is the maintenance cost per month? Are there any pending dues?',
    time: '2 days ago',
    status: 'new',
    replies: []
  }
];

export default function SellerInquiries() {
  const [inquiries, setInquiries] = useState(mockInquiries);
  const [selectedInquiry, setSelectedInquiry] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'replied'>('all');

  const filteredInquiries = inquiries.filter(inquiry => 
    filter === 'all' || inquiry.status === filter
  );

  const handleReply = (inquiryId: string) => {
    if (!replyMessage.trim()) return;

    setInquiries(prev => prev.map(inquiry => {
      if (inquiry.id === inquiryId) {
        return {
          ...inquiry,
          status: 'replied' as const,
          replies: [
            ...inquiry.replies,
            {
              id: `r${Date.now()}`,
              message: replyMessage,
              sender: 'seller' as const,
              time: 'Just now'
            }
          ]
        };
      }
      return inquiry;
    }));

    setReplyMessage('');
    setSelectedInquiry(null);
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
              <span className="text-blue-600 text-lg">📬</span>
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
              <span className="text-green-600 text-lg">✅</span>
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
              <span className="text-orange-600 text-lg">🔔</span>
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
                    <span>📧 {inquiry.buyerEmail}</span>
                    <span>📞 {inquiry.buyerPhone}</span>
                    <span>🕒 {inquiry.time}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-4 mb-4">
              <p className="text-neutral-700">{inquiry.message}</p>
            </div>

            {/* Replies */}
            {inquiry.replies.length > 0 && (
              <div className="space-y-3 mb-4">
                {inquiry.replies.map((reply) => (
                  <div key={reply.id} className="bg-emerald-50 rounded-lg p-4 ml-8">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-emerald-700">Your Reply</span>
                      <span className="text-xs text-emerald-600">{reply.time}</span>
                    </div>
                    <p className="text-neutral-700">{reply.message}</p>
                  </div>
                ))}
              </div>
            )}

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
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                  >
                    Send Reply
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
                <a
                  href={`tel:${inquiry.buyerPhone}`}
                  className="border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                >
                  Call
                </a>
                <a
                  href={`mailto:${inquiry.buyerEmail}`}
                  className="border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-neutral-50 transition-colors"
                >
                  Email
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredInquiries.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-12 text-center">
          <div className="text-6xl mb-4">📭</div>
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
