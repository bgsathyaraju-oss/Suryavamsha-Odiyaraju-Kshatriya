import React, { useState, useEffect } from 'react';
import { X, Heart, Eye, Trash2, MapPin, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserShortlist, toggleShortlist } from '../services/shortlistService';
import { ShortlistedProfile, MatrimonialProfile } from '../types/matrimony';

interface ShortlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProfileById: (profileId: string) => void;
  allProfiles: MatrimonialProfile[];
}

export const ShortlistModal: React.FC<ShortlistModalProps> = ({
  isOpen,
  onClose,
  onViewProfileById,
  allProfiles
}) => {
  const { currentUser } = useAuth();
  const [shortlists, setShortlists] = useState<ShortlistedProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && currentUser) {
      loadShortlist();
    }
  }, [isOpen, currentUser]);

  const loadShortlist = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await fetchUserShortlist(currentUser.uid);
      setShortlists(data);
    } catch (err) {
      console.warn('Error loading shortlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (item: ShortlistedProfile) => {
    if (!currentUser) return;
    const dummyProf = allProfiles.find(p => p.id === item.profileId) || {
      id: item.profileId,
      fullName: item.profileName,
      gender: item.profileGender,
      photoUrl: item.profilePhotoUrl,
      currentCity: item.profileCity,
      age: item.profileAge
    } as any;

    try {
      await toggleShortlist(currentUser.uid, dummyProf);
      setShortlists(prev => prev.filter(s => s.id !== item.id));
    } catch (err) {
      alert('Could not update shortlist.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        className="bg-[#FAF6F0] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] relative flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#680916] text-white px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/40 shrink-0">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-red-400 fill-red-400" />
            <h2 className="font-heading font-bold text-lg text-[#F3E5AB]">
              Shortlisted Matrimonial Profiles ({shortlists.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-[#800D1E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-3">
          {loading ? (
            <div className="py-12 text-center text-xs text-stone-500">
              Loading shortlist...
            </div>
          ) : shortlists.length === 0 ? (
            <div className="py-12 text-center text-xs text-stone-500 space-y-2">
              <Heart className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="font-semibold text-stone-700">No Profiles Shortlisted Yet</p>
              <p>Click the heart icon on any Bride or Groom card to bookmark them for later review.</p>
            </div>
          ) : (
            shortlists.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-2xl border border-stone-200 hover:border-amber-300 transition-all flex items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={item.profilePhotoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                    alt={item.profileName}
                    className="w-14 h-16 rounded-xl object-cover ring-1 ring-amber-300 shrink-0"
                  />
                  <div className="min-w-0 text-xs">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-stone-900 truncate">{item.profileName}</h4>
                      <span className="text-[10px] font-mono bg-stone-100 text-[#8A1022] font-semibold px-1.5 py-0.5 rounded">
                        {item.profileId}
                      </span>
                    </div>
                    <div className="text-stone-600 mt-0.5">
                      {item.profileAge} Yrs • {item.profileCity}
                    </div>
                    {item.profileOccupation && (
                      <div className="text-stone-500 text-[11px] truncate">
                        {item.profileOccupation}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => {
                      onViewProfileById(item.profileId);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-[#680916] text-[#F3E5AB] text-xs font-semibold rounded-lg hover:bg-[#800D1E] flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View</span>
                  </button>
                  <button
                    onClick={() => handleRemove(item)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-stone-100"
                    title="Remove from shortlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
