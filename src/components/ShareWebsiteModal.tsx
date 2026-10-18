import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageCircle, 
  Globe, 
  QrCode, 
  ExternalLink,
  Sparkles,
  Crown
} from 'lucide-react';

interface ShareWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareWebsiteModal: React.FC<ShareWebsiteModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Use the canonical shared app URL or current origin
  const websiteUrl = typeof window !== 'undefined' 
    ? (window.location.origin.includes('localhost') 
        ? 'https://ais-pre-nzljf5tfxvh6j3odw33ehb-703542773960.asia-northeast1.run.app' 
        : window.location.href.split('?')[0])
    : 'https://ais-pre-nzljf5tfxvh6j3odw33ehb-703542773960.asia-northeast1.run.app';

  const shareText = `Namaste! Explore verified bride and groom profiles on the official Suryavamsha Vadiyaraju Kshatriya Matrimonial Portal: ${websiteUrl}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(websiteUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = websiteUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Suryavamsha Vadiyaraju Kshatriya Matrimony',
          text: 'Official matrimonial portal for the Suryavamsha Vadiyaraju Kshatriya community.',
          url: websiteUrl,
        });
      } catch (err) {
        // User cancelled or share dismissed
      }
    } else {
      handleCopy();
    }
  };

  const whatsappShareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="bg-[#FAF6F0] w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#680916] text-white px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-[#ECC86A]" />
            <div>
              <h2 className="font-heading font-bold text-base text-[#F3E5AB]">
                Website Link & Sharing
              </h2>
              <p className="text-[11px] text-stone-200">
                Share this portal with family, relatives & community groups
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

        {/* Body */}
        <div className="p-6 space-y-5">
          
          {/* Link Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 flex items-center justify-between">
              <span>Official Website URL:</span>
              {copied && (
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>Link copied!</span>
                </span>
              )}
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-2.5 bg-white border border-stone-300 rounded-xl text-xs font-mono text-stone-800 truncate select-all">
                {websiteUrl}
              </div>
              <button
                onClick={handleCopy}
                className="px-3.5 py-2.5 bg-[#680916] hover:bg-[#800D1E] text-[#F3E5AB] rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 shrink-0 shadow-xs"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-700 block">
              Share Instantly:
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              
              {/* WhatsApp Share */}
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Share on WhatsApp</span>
              </a>

              {/* Native Mobile Share */}
              <button
                onClick={handleNativeShare}
                className="p-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2"
              >
                <Share2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Mobile Share Menu</span>
              </button>

            </div>
          </div>

          {/* Community Recommendation note */}
          <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-xs text-amber-950 space-y-1">
            <div className="flex items-center space-x-1.5 font-bold text-[#680916]">
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span>Invite Kshatriya Relatives</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Send this link to families looking for alliances. Registered members can create their free profile, browse verified brides and grooms, and connect securely.
            </p>
          </div>

          {/* Direct Open Link button */}
          <div className="pt-1">
            <a
              href={websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-stone-500" />
              <span>Open Link in New Tab</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
