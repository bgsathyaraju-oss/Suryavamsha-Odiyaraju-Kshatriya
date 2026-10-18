import React from 'react';
import { X, ShieldCheck, FileText, Lock, CheckCircle2 } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="bg-[#FAF6F0] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] relative flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#680916] text-white px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/40 shrink-0">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-[#ECC86A]" />
            <h2 className="font-heading font-bold text-lg text-[#F3E5AB]">
              Contact Privacy & Security Policy
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs text-stone-700 leading-relaxed">
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 font-medium">
            Suryavamsha Vadiyaraju Kshatriya Matrimony strictly protects family dignity, candidate privacy, and personal contact numbers through attribute-based database security.
          </div>

          <h3 className="font-bold text-stone-900 text-sm">1. Private Contact Isolation by Default</h3>
          <p>
            Contact phone numbers and private addresses are NEVER published in public database documents. They are isolated in secure subcollections accessible strictly to the profile owner, verified administrators, and candidates whose mutual contact request is formally approved.
          </p>

          <h3 className="font-bold text-stone-900 text-sm">2. Mutual Consent-Based Contact Requests</h3>
          <p>
            Before personal phone numbers or family contact details are revealed, both parties must mutually express interest or submit a formal contact request facilitated by our community marriage counselor.
          </p>

          <h3 className="font-bold text-stone-900 text-sm">3. Reporting and Anti-Harassment Safeguards</h3>
          <p>
            Members possess immediate "Report Profile" functionality. The administrative board reviews reported profiles, fake registrations, and misconduct, with authority to suspend accounts and initiate disciplinary action.
          </p>

          <h3 className="font-bold text-stone-900 text-sm">4. Account Deletion & Right to Erasure</h3>
          <p>
            Members may at any time request profile removal or deletion upon wedding finalization or personal request by contacting administration or using their account dashboard.
          </p>
        </div>

        <div className="p-4 bg-stone-100 border-t border-stone-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#680916] text-[#F3E5AB] font-bold text-xs rounded-xl hover:bg-[#800D1E]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export const TermsModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="bg-[#FAF6F0] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] relative flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-[#680916] text-white px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/40 shrink-0">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#ECC86A]" />
            <h2 className="font-heading font-bold text-lg text-[#F3E5AB]">
              Community Terms & Conditions
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 text-xs text-stone-700 leading-relaxed">
          <h3 className="font-bold text-stone-900 text-sm">1. Community Eligibility</h3>
          <p>
            This platform is established solely for bona fide members of the Suryavamsha Vadiyaraju Kshatriya community and allied Solar Dynasty lineages. Registering false community or gotra details is strictly prohibited.
          </p>

          <h3 className="font-bold text-stone-900 text-sm">2. Truthful & Accurate Information</h3>
          <p>
            Candidates and family representatives warrant that age, education, marital status, employment, and family background stated in the profile are truthful and verifiable.
          </p>

          <h3 className="font-bold text-stone-900 text-sm">3. Search Aid Disclaimer</h3>
          <p>
            The matrimonial portal and compatibility filters serve as a search aid for community members. Match percentages and recommendations do not constitute a legal or astrological guarantee of a successful marriage. Independent family verification is encouraged.
          </p>

          <h3 className="font-bold text-stone-900 text-sm">4. Code of Conduct</h3>
          <p>
            Members must conduct communications with dignity, mutual courtesy, and respect for our Kshatriya cultural customs. Commercial advertisements, dowry solicitations, or improper behavior result in immediate profile expulsion.
          </p>
        </div>

        <div className="p-4 bg-stone-100 border-t border-stone-200 text-right shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#680916] text-[#F3E5AB] font-bold text-xs rounded-xl hover:bg-[#800D1E]"
          >
            Agree & Close
          </button>
        </div>
      </div>
    </div>
  );
};
