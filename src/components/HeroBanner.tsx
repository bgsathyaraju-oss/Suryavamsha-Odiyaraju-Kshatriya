import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  Heart, 
  Crown, 
  Flame, 
  Users, 
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { RoyalEmblem } from './RoyalEmblem';
import { Gender, ProfileFilters } from '../types/matrimony';

interface HeroBannerProps {
  onSearch: (filters: Partial<ProfileFilters>) => void;
  onOpenRegister: () => void;
  onOpenShare?: () => void;
  totalProfilesCount: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onSearch,
  onOpenRegister,
  onOpenShare,
  totalProfilesCount
}) => {
  const [lookingFor, setLookingFor] = useState<Gender>('bride');
  const [ageMin, setAgeMin] = useState(21);
  const [ageMax, setAgeMax] = useState(30);
  const [gotra, setGotra] = useState('');
  const [nativePlace, setNativePlace] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      gender: lookingFor,
      ageMin: Number(ageMin),
      ageMax: Number(ageMax),
      gotra: gotra.trim() || undefined,
      nativePlace: nativePlace.trim() || undefined
    });
  };

  return (
    <div className="relative overflow-hidden royal-gradient text-white border-b-2 border-[#D4AF37]/50 shadow-2xl">
      {/* Background Mandala & Royal Motifs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="royalPattern" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="24" fill="none" stroke="#D4AF37" strokeWidth="1" />
              <circle cx="30" cy="30" r="10" fill="none" stroke="#D4AF37" strokeWidth="0.5" />
              <path d="M30 6 L30 54 M6 30 L54 30" stroke="#D4AF37" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#royalPattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Royal Branding & Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center space-x-2 bg-[#4D0610]/80 backdrop-blur-xs text-[#F3E5AB] px-4 py-1.5 rounded-full text-xs font-bold border border-[#D4AF37]/40 shadow-inner">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span>Suryavamsha Vadiyaraju Kshatriya Matrimonial Portal</span>
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black tracking-wide leading-tight text-[#FAF6F0]">
              Connecting Royal Lineages,{' '}
              <span className="gold-gradient-text block mt-1">
                Preserving Sacred Traditions
              </span>
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed font-subheading max-w-2xl mx-auto lg:mx-0">
              The supreme and trusted matrimonial platform exclusively for the Suryavamsha Vadiyaraju Kshatriya community. Discover verified profiles of educated, ambitious brides and grooms from respected families across India and worldwide.
            </p>

            {/* Trust Highlights */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-[#F3E5AB]">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>100% Suryavamsha Verified</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Gotra & Vamsha Filtering</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Private Contact Security</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={onOpenRegister}
                className="px-7 py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#ECC86A] via-[#D4AF37] to-[#B8860B] text-[#45030C] shadow-xl hover:brightness-105 transition-all flex items-center space-x-2 active:scale-95"
              >
                <span>Register Your Profile Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSearch({ gender: 'bride' })}
                className="px-6 py-3 rounded-xl text-xs font-bold text-[#F3E5AB] bg-[#800D1E]/80 hover:bg-[#800D1E] border border-[#D4AF37]/50 shadow-md transition-all"
              >
                Browse Brides (వధువులు)
              </button>

              <button
                onClick={() => onSearch({ gender: 'groom' })}
                className="px-6 py-3 rounded-xl text-xs font-bold text-[#F3E5AB] bg-[#800D1E]/80 hover:bg-[#800D1E] border border-[#D4AF37]/50 shadow-md transition-all"
              >
                Browse Grooms (వరులు)
              </button>

              {onOpenShare && (
                <button
                  onClick={onOpenShare}
                  className="px-5 py-3 rounded-xl text-xs font-bold text-[#D4AF37] bg-[#4D0610] hover:bg-[#680916] border border-[#D4AF37] shadow-md transition-all flex items-center space-x-1.5"
                >
                  <Share2 className="w-4 h-4 text-[#ECC86A]" />
                  <span>Share Website Link</span>
                </button>
              )}
            </div>

          </div>

          {/* Right Column: Quick Match Search Box */}
          <div className="lg:col-span-5">
            <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-7 shadow-2xl border-2 border-[#D4AF37] text-stone-900 relative">
              
              <div className="flex items-center space-x-2 pb-3 border-b border-stone-200">
                <Search className="w-5 h-5 text-[#680916]" />
                <div>
                  <h3 className="font-heading font-bold text-base text-[#680916]">
                    Quick Life Partner Search
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Find matches by age, gotra, and native roots
                  </p>
                </div>
              </div>

              <form onSubmit={handleQuickSearch} className="mt-4 space-y-3.5">
                
                {/* Looking for */}
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    I am looking for:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLookingFor('bride')}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        lookingFor === 'bride'
                          ? 'bg-[#680916] text-[#F3E5AB] border-[#680916] shadow-sm'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      Bride (వధువు)
                    </button>
                    <button
                      type="button"
                      onClick={() => setLookingFor('groom')}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        lookingFor === 'groom'
                          ? 'bg-[#680916] text-[#F3E5AB] border-[#680916] shadow-sm'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                      }`}
                    >
                      Groom (వరుడు)
                    </button>
                  </div>
                </div>

                {/* Age Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Min Age
                    </label>
                    <input
                      type="number"
                      min="18"
                      max="60"
                      value={ageMin}
                      onChange={(e) => setAgeMin(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Max Age
                    </label>
                    <input
                      type="number"
                      min="18"
                      max="65"
                      value={ageMax}
                      onChange={(e) => setAgeMax(Number(e.target.value))}
                      className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Gotra */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Gotra (గోత్రం - Optional)
                  </label>
                  <input
                    type="text"
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    placeholder="e.g. Kashyapa / Vasishtha / Bharadwaja"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Native Place */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Native Place / Region (Optional)
                  </label>
                  <input
                    type="text"
                    value={nativePlace}
                    onChange={(e) => setNativePlace(e.target.value)}
                    placeholder="e.g. Bhimavaram / Rajahmundry / Hyderabad"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-heading font-bold text-xs uppercase tracking-wider bg-[#680916] text-[#F3E5AB] hover:bg-[#800D1E] shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Search className="w-4 h-4 text-[#ECC86A]" />
                  <span>Find Kshatriya Matches</span>
                </button>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
