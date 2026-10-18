import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Inbox, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trash2, 
  User, 
  Eye, 
  MessageSquare,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchReceivedInterests, 
  fetchSentInterests, 
  updateInterestStatus 
} from '../services/interestService';
import { Interest, InterestStatus, MatrimonialProfile } from '../types/matrimony';

interface InterestsViewProps {
  onViewProfileById: (profileId: string) => void;
  onOpenLogin: () => void;
}

export const InterestsView: React.FC<InterestsViewProps> = ({
  onViewProfileById,
  onOpenLogin
}) => {
  const { currentUser, currentProfile } = useAuth();
  const [tab, setTab] = useState<'received' | 'sent'>('received');
  const [receivedInterests, setReceivedInterests] = useState<Interest[]>([]);
  const [sentInterests, setSentInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      loadInterests();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadInterests = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const [rec, snt] = await Promise.all([
        fetchReceivedInterests(currentUser.uid),
        fetchSentInterests(currentUser.uid)
      ]);
      setReceivedInterests(rec);
      setSentInterests(snt);
    } catch (err) {
      console.warn('Error loading interests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (interest: Interest, newStatus: InterestStatus) => {
    setActionLoadingId(interest.id);
    try {
      await updateInterestStatus(interest, newStatus, currentProfile?.fullName);
      await loadInterests();
    } catch (err) {
      alert('Could not update interest status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto my-16 text-center p-8 bg-white rounded-3xl border border-stone-200 shadow-xl space-y-4">
        <Sparkles className="w-12 h-12 text-[#680916] mx-auto" />
        <h2 className="font-heading text-xl font-bold text-stone-900">
          Sign In to View Matrimonial Interests
        </h2>
        <p className="text-xs text-stone-600">
          Track received marriage proposals, express interests to prospective brides and grooms, and connect securely.
        </p>
        <button
          onClick={onOpenLogin}
          className="px-6 py-2.5 bg-[#680916] text-[#F3E5AB] font-bold text-xs rounded-xl hover:bg-[#800D1E] shadow-md"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-heading text-2xl font-bold text-stone-900 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-[#8A1022]" />
            <span>Matrimonial Interests & Proposals</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review incoming expressions of interest and manage outgoing matrimonial requests.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-stone-100 p-1 rounded-xl self-start sm:self-auto border border-stone-200">
          <button
            onClick={() => setTab('received')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              tab === 'received'
                ? 'bg-[#680916] text-[#F3E5AB] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Received ({receivedInterests.length})</span>
          </button>
          <button
            onClick={() => setTab('sent')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              tab === 'sent'
                ? 'bg-[#680916] text-[#F3E5AB] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Sent ({sentInterests.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-stone-500">
          Loading interest requests...
        </div>
      ) : (
        <>
          {/* TAB 1: RECEIVED INTERESTS */}
          {tab === 'received' && (
            <div className="space-y-4">
              {receivedInterests.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
                  <Inbox className="w-10 h-10 text-stone-300 mx-auto" />
                  <h3 className="font-heading font-semibold text-stone-800 text-sm">
                    No Received Interests Yet
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    When prospective brides or grooms express interest in your profile, their requests will appear here.
                  </p>
                </div>
              ) : (
                receivedInterests.map((interest) => (
                  <div
                    key={interest.id}
                    className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={interest.senderPhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                        alt={interest.senderName}
                        className="w-16 h-18 rounded-xl object-cover ring-2 ring-amber-300 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-heading font-bold text-sm text-stone-900">
                            {interest.senderName}
                          </h4>
                          <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded">
                            {interest.senderProfileId}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 italic">
                          "{interest.message}"
                        </p>
                        <p className="text-[10px] text-stone-400">
                          Received on {new Date(interest.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                      <button
                        onClick={() => onViewProfileById(interest.senderProfileId)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Profile</span>
                      </button>

                      {interest.status === 'pending' ? (
                        <>
                          <button
                            disabled={actionLoadingId === interest.id}
                            onClick={() => handleStatusChange(interest, 'accepted')}
                            className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center space-x-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>
                          <button
                            disabled={actionLoadingId === interest.id}
                            onClick={() => handleStatusChange(interest, 'declined')}
                            className="px-3 py-1.5 bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 rounded-lg text-xs font-semibold"
                          >
                            Decline
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          interest.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          interest.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                          'bg-stone-100 text-stone-600'
                        }`}>
                          {interest.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: SENT INTERESTS */}
          {tab === 'sent' && (
            <div className="space-y-4">
              {sentInterests.length === 0 ? (
                <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
                  <Send className="w-10 h-10 text-stone-300 mx-auto" />
                  <h3 className="font-heading font-semibold text-stone-800 text-sm">
                    No Sent Interests
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Browse Bride or Groom profiles and click "Express Interest" to send a formal matrimonial proposal.
                  </p>
                </div>
              ) : (
                sentInterests.map((interest) => (
                  <div
                    key={interest.id}
                    className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-sm text-stone-900">
                          Proposal sent to Profile
                        </span>
                        <span className="text-xs font-mono font-bold text-[#680916] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          {interest.recipientProfileId}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 italic">
                        "{interest.message}"
                      </p>
                      <p className="text-[10px] text-stone-400">
                        Sent on {new Date(interest.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        interest.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                        interest.status === 'declined' ? 'bg-rose-100 text-rose-800' :
                        interest.status === 'withdrawn' ? 'bg-stone-100 text-stone-500' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {interest.status}
                      </span>

                      <button
                        onClick={() => onViewProfileById(interest.recipientProfileId)}
                        className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-semibold flex items-center space-x-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>

                      {interest.status === 'pending' && (
                        <button
                          disabled={actionLoadingId === interest.id}
                          onClick={() => handleStatusChange(interest, 'withdrawn')}
                          className="px-3 py-1.5 text-stone-500 hover:text-red-600 rounded-lg text-xs font-semibold transition-colors"
                          title="Withdraw Interest"
                        >
                          Withdraw
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
