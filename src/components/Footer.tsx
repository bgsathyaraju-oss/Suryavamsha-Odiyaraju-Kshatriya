import React from 'react';
import { RoyalEmblem } from './RoyalEmblem';
import { Crown, ShieldCheck, Phone, Mail, MapPin, Heart, Share2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenConsultant: () => void;
  onOpenRegister: () => void;
  onOpenShare?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacy,
  onOpenTerms,
  onOpenConsultant,
  onOpenRegister,
  onOpenShare
}) => {
  return (
    <footer className="bg-[#4D0610] text-stone-300 border-t-2 border-[#D4AF37]/50 pt-12 pb-24 lg:pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand & Emblem */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <RoyalEmblem size={44} />
              <div>
                <span className="font-heading font-bold text-sm tracking-wider text-[#FAF6F0] block">
                  SURYAVAMSHA
                </span>
                <span className="text-xs text-[#F3E5AB] font-semibold">
                  Vadiyaraju Kshatriya Matrimony
                </span>
              </div>
            </div>
            <p className="text-stone-300 text-xs leading-relaxed font-subheading">
              Dedicated to upholding the sanctity of sacred marriage alliances within the royal Suryavamsha Vadiyaraju Kshatriya lineages with honor, truth, and confidentiality.
            </p>
            <div className="flex items-center space-x-2 text-[#ECC86A] text-[11px] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified Community Service</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#F3E5AB] uppercase tracking-wider">
              Explore Profiles
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('brides')} className="hover:text-[#ECC86A] transition-colors">
                  Bride Profiles (వధువులు)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('grooms')} className="hover:text-[#ECC86A] transition-colors">
                  Groom Profiles (వరులు)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('search')} className="hover:text-[#ECC86A] transition-colors">
                  Advanced Gotra & City Search
                </button>
              </li>
              <li>
                <button onClick={onOpenRegister} className="text-[#ECC86A] font-bold hover:underline">
                  Free Member Registration
                </button>
              </li>
            </ul>
          </div>

          {/* Consultation & Support */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#F3E5AB] uppercase tracking-wider">
              Community Services
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenConsultant} className="hover:text-[#ECC86A] transition-colors">
                  Senior Marriage Consultant
                </button>
              </li>
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-[#ECC86A] transition-colors">
                  Contact Privacy & Security
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-[#ECC86A] transition-colors">
                  Matrimonial Code of Conduct
                </button>
              </li>
              {onOpenShare && (
                <li>
                  <button onClick={onOpenShare} className="text-[#ECC86A] font-semibold hover:underline flex items-center space-x-1">
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Website Link</span>
                  </button>
                </li>
              )}
              <li>
                <span className="text-stone-400">Horoscope Matching Assistance</span>
              </li>
            </ul>
          </div>

          {/* Community Helpline */}
          <div className="space-y-3">
            <h4 className="font-heading font-bold text-sm text-[#F3E5AB] uppercase tracking-wider">
              Community Helpline
            </h4>
            <div className="space-y-2 text-stone-300">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-[#ECC86A] shrink-0" />
                <span>+91 98490 23456 / +91 94401 78910</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-[#ECC86A] shrink-0" />
                <span>support@suryavamshamatrimony.org</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#ECC86A] shrink-0 mt-0.5" />
                <span>Kshatriya Seva Samithi, Hyderabad / Bhimavaram / Visakhapatnam</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#D4AF37]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} Suryavamsha Vadiyaraju Kshatriya Matrimony. All Rights Reserved.
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={onOpenPrivacy} className="hover:underline">Privacy Policy</button>
            <span>•</span>
            <button onClick={onOpenTerms} className="hover:underline">Terms of Service</button>
            <span>•</span>
            <span className="text-[#ECC86A] font-semibold">సూర్యవంశ క్షత్రియ పరిణయ వేదిక</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
