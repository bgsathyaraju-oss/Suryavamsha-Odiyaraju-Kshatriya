import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, Heart, Sparkles, Flame, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MatrimonialProfile, PartnerPreferences } from '../types/matrimony';

interface PartnerPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  allProfiles: MatrimonialProfile[];
  onViewProfile: (profile: MatrimonialProfile) => void;
}

export const PartnerPreferencesModal: React.FC<PartnerPreferencesModalProps> = ({
  isOpen,
  onClose,
  allProfiles,
  onViewProfile
}) => {
  const { currentProfile, saveCurrentProfile } = useAuth();

  const [ageMin, setAgeMin] = useState(currentProfile?.partnerPreferences?.ageMin || 22);
  const [ageMax, setAgeMax] = useState(currentProfile?.partnerPreferences?.ageMax || 30);
  const [heightMin, setHeightMin] = useState(currentProfile?.partnerPreferences?.heightMin || "5'3\"");
  const [gotraExclusion, setGotraExclusion] = useState(currentProfile?.gotra || 'Kashyapa');
  const [educationPref, setEducationPref] = useState(currentProfile?.partnerPreferences?.education?.[0] || 'Any Degree');
  const [preferredCity, setPreferredCity] = useState(currentProfile?.partnerPreferences?.currentCity || '');
  const [otherNotes, setOtherNotes] = useState(currentProfile?.partnerPreferences?.otherNotes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  // Filter matching profiles based on preferences
  const oppositeGender = currentProfile ? (currentProfile.gender === 'bride' ? 'groom' : 'bride') : 'bride';
  
  const matchingProfiles = allProfiles.filter(p => {
    if (currentProfile && p.gender !== oppositeGender) return false;
    if (p.age < ageMin || p.age > ageMax) return false;
    if (gotraExclusion && p.gotra?.toLowerCase().trim() === gotraExclusion.toLowerCase().trim()) return false; // Traditional sagotra marriage avoidance
    if (preferredCity.trim() && !p.currentCity.toLowerCase().includes(preferredCity.toLowerCase().trim())) return false;
    return true;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProfile) {
      alert('Please register or create your matrimonial profile first.');
      return;
    }
    setSaving(true);
    try {
      const updatedPrefs: PartnerPreferences = {
        ageMin,
        ageMax,
        heightMin,
        education: [educationPref],
        gotra: gotraExclusion,
        currentCity: preferredCity,
        otherNotes
      };
      await saveCurrentProfile(
        { partnerPreferences: updatedPrefs },
        {}
      );
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      alert('Failed to save partner preferences.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        className="bg-[#FAF6F0] w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] relative flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#680916] text-white px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-[#ECC86A]" />
            <div>
              <h2 className="font-heading font-bold text-lg text-[#F3E5AB]">
                Partner Preferences & Matching
              </h2>
              <p className="text-[11px] text-stone-200">
                Define desired attributes to view algorithmic Suryavamsha matches
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-[#800D1E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <form onSubmit={handleSave} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="font-heading font-bold text-sm text-[#680916] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Criteria Specification</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Age Range */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Preferred Age Range: {ageMin} to {ageMax} Years
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="18"
                    max="50"
                    value={ageMin}
                    onChange={(e) => setAgeMin(Math.min(Number(e.target.value), ageMax - 1))}
                    className="flex-1 accent-[#680916]"
                  />
                  <input
                    type="range"
                    min="18"
                    max="55"
                    value={ageMax}
                    onChange={(e) => setAgeMax(Math.max(Number(e.target.value), ageMin + 1))}
                    className="flex-1 accent-[#680916]"
                  />
                </div>
              </div>

              {/* Minimum Height */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Minimum Height
                </label>
                <select
                  value={heightMin}
                  onChange={(e) => setHeightMin(e.target.value)}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                >
                  <option>5'0" (152 cm)</option>
                  <option>5'2" (157 cm)</option>
                  <option>5'4" (163 cm)</option>
                  <option>5'6" (168 cm)</option>
                  <option>5'8" (173 cm)</option>
                  <option>5'10" (178 cm)</option>
                  <option>6'0" (183 cm)</option>
                </select>
              </div>

              {/* Gotra Exclusions */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Exclude Same Gotra (Sagotra Exemption)
                </label>
                <input
                  type="text"
                  value={gotraExclusion}
                  onChange={(e) => setGotraExclusion(e.target.value)}
                  placeholder="e.g. Kashyapa"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
                <span className="text-[10px] text-stone-500 mt-0.5 block">
                  Excludes matching with candidate of identical family gotra.
                </span>
              </div>

              {/* Preferred City/Region */}
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Preferred Location / City (Optional)
                </label>
                <input
                  type="text"
                  value={preferredCity}
                  onChange={(e) => setPreferredCity(e.target.value)}
                  placeholder="e.g. Hyderabad / Bengaluru / USA"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              {/* Education */}
              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">
                  Preferred Education Qualification
                </label>
                <input
                  type="text"
                  value={educationPref}
                  onChange={(e) => setEducationPref(e.target.value)}
                  placeholder="e.g. Any Professional Graduate / B.Tech / MBBS / CA"
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

              {/* Additional notes */}
              <div className="sm:col-span-2">
                <label className="font-semibold text-stone-700 block mb-1">
                  Other Life Partner Expectations
                </label>
                <textarea
                  value={otherNotes}
                  onChange={(e) => setOtherNotes(e.target.value)}
                  placeholder="e.g. Family-oriented, respectful of Kshatriya traditions, vegetarian/non-vegetarian..."
                  rows={2}
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
                />
              </div>

            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-stone-500 italic">
                Note: Compatibility is a search aid, not a guarantee of marriage outcome.
              </span>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#680916] text-[#F3E5AB] hover:bg-[#800D1E] transition-colors shadow-md flex items-center space-x-1"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Preferences Saved!</span>
                  </>
                ) : (
                  <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                )}
              </button>
            </div>
          </form>

          {/* Matched Profiles Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-bold text-sm text-stone-900 flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-[#8A1022]" />
                <span>Profiles Matching Your Criteria ({matchingProfiles.length})</span>
              </h3>
            </div>

            {matchingProfiles.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs">
                No profiles strictly match this filter currently. Try widening the age or location parameters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {matchingProfiles.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onViewProfile(p);
                      onClose();
                    }}
                    className="p-3 bg-white rounded-xl border border-stone-200 hover:border-amber-400 hover:shadow-md transition-all cursor-pointer flex items-center space-x-3"
                  >
                    <img
                      src={p.photoUrl}
                      alt={p.fullName}
                      className="w-14 h-16 rounded-lg object-cover ring-1 ring-amber-300 shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <div className="font-bold text-stone-900 truncate">{p.fullName}</div>
                      <div className="text-stone-600">{p.age} Yrs • Gotra: {p.gotra}</div>
                      <div className="text-stone-500 truncate">{p.education} • {p.currentCity}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
