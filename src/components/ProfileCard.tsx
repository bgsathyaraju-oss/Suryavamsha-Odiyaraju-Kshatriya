import React, { useState } from 'react';
import { 
  Heart, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  ShieldCheck, 
  Send, 
  Check, 
  Eye, 
  Sparkles,
  Phone,
  Flame,
  UserCheck
} from 'lucide-react';
import { MatrimonialProfile } from '../types/matrimony';
import { useAuth } from '../context/AuthContext';
import { formatDateOfBirth } from '../utils/dateUtils';

interface ProfileCardProps {
  profile: MatrimonialProfile;
  isShortlisted?: boolean;
  hasExpressedInterest?: boolean;
  onViewProfile: (profile: MatrimonialProfile) => void;
  onExpressInterest: (profile: MatrimonialProfile) => void;
  onToggleShortlist: (profile: MatrimonialProfile) => void;
  onRequestContact: (profile: MatrimonialProfile) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isShortlisted = false,
  hasExpressedInterest = false,
  onViewProfile,
  onExpressInterest,
  onToggleShortlist,
  onRequestContact,
}) => {
  const { currentUser } = useAuth();
  const [shortlistAnim, setShortlistAnim] = useState(false);

  const handleShortlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShortlistAnim(true);
    setTimeout(() => setShortlistAnim(false), 500);
    onToggleShortlist(profile);
  };

  return (
    <div 
      onClick={() => onViewProfile(profile)}
      className="group bg-white rounded-2xl overflow-hidden card-gold-border hover:shadow-2xl transition-all duration-300 flex flex-col justify-between cursor-pointer border border-[#D4AF37]/30 hover:border-[#D4AF37] relative"
    >
      {/* Top Banner Accent */}
      <div className="h-2 w-full bg-gradient-to-r from-[#680916] via-[#D4AF37] to-[#680916]" />

      <div className="p-5 flex-1">
        {/* Header: Photo and Quick Meta */}
        <div className="flex items-start space-x-4">
          
          {/* Profile Photo */}
          <div className="relative shrink-0">
            <div className="w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden ring-2 ring-[#D4AF37]/60 shadow-md">
              <img
                src={profile.photoUrl || (profile.gender === 'bride' 
                  ? 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=400' 
                  : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400')}
                alt={profile.fullName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
            
            {/* Suryavamsha Verified Badge */}
            <div className="absolute -bottom-2 -right-1 bg-[#680916] text-[#ECC86A] text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center space-x-0.5 shadow-md border border-[#D4AF37]">
              <ShieldCheck className="w-3 h-3 text-[#ECC86A]" />
              <span>Verified</span>
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold text-[#8A1022] bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {profile.id}
              </span>
              
              {/* Shortlist Heart Button */}
              <button
                onClick={handleShortlistClick}
                className={`p-1.5 rounded-full transition-transform ${
                  isShortlisted 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                    : 'text-stone-400 hover:text-red-500 hover:bg-stone-100'
                } ${shortlistAnim ? 'scale-125' : ''}`}
                title={isShortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
              >
                <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-red-600' : ''}`} />
              </button>
            </div>

            <h3 className="font-heading font-bold text-base sm:text-lg text-stone-900 group-hover:text-[#680916] transition-colors truncate mt-1">
              {profile.fullName}
            </h3>

            <p className="text-xs text-stone-600 font-medium">
              {profile.age} Yrs • {profile.height}
            </p>
            {profile.dateOfBirth && (
              <p className="text-[11px] text-stone-500 mt-0.5">
                DOB: <strong className="text-stone-700">{formatDateOfBirth(profile.dateOfBirth)}</strong>
              </p>
            )}

            <div className="mt-1.5 inline-flex items-center space-x-1 text-[11px] bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-semibold border border-amber-200/70">
              <Flame className="w-3 h-3 text-amber-600" />
              <span>Gotra: {profile.gotra || 'Kashyapa'}</span>
            </div>
          </div>
        </div>

        {/* Detailed Attributes */}
        <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
          
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-[#8A1022] shrink-0" />
            <span className="truncate">
              Native: <strong className="text-stone-800 font-semibold">{profile.nativePlace}</strong> • Living in <strong className="text-stone-800 font-semibold">{profile.currentCity}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <GraduationCap className="w-3.5 h-3.5 text-[#8A1022] shrink-0" />
            <span className="truncate">{profile.education}</span>
          </div>

          <div className="flex items-center space-x-2">
            <Briefcase className="w-3.5 h-3.5 text-[#8A1022] shrink-0" />
            <span className="truncate font-medium text-stone-700">{profile.occupation}</span>
          </div>

          {profile.annualIncome && (
            <div className="text-[11px] text-amber-900 bg-amber-50/70 px-2 py-1 rounded-md font-medium">
              Annual Income: <strong className="text-stone-800">{profile.annualIncome}</strong>
            </div>
          )}
        </div>

        {/* Short Bio Snippet */}
        {profile.profileDescription && (
          <p className="mt-3 text-[11px] text-stone-500 line-clamp-2 italic leading-relaxed">
            "{profile.profileDescription}"
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="p-4 bg-stone-50/80 border-t border-stone-100 flex items-center gap-2">
        
        {/* Express Interest Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExpressInterest(profile);
          }}
          disabled={hasExpressedInterest}
          className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all shadow-xs ${
            hasExpressedInterest
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
              : 'bg-[#680916] text-[#F3E5AB] hover:bg-[#800D1E] active:scale-95'
          }`}
        >
          {hasExpressedInterest ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Interest Sent</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5 text-[#ECC86A]" />
              <span>Express Interest</span>
            </>
          )}
        </button>

        {/* View Profile Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewProfile(profile);
          }}
          className="py-2 px-3 rounded-xl text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-amber-50 hover:text-[#680916] transition-colors flex items-center space-x-1"
        >
          <Eye className="w-3.5 h-3.5 text-stone-500" />
          <span className="hidden sm:inline">Details</span>
        </button>

      </div>
    </div>
  );
};
