import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Heart, 
  Send, 
  Check, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Users, 
  Phone, 
  Flag, 
  Flame, 
  Calendar, 
  Languages, 
  Info,
  DollarSign,
  AlertTriangle,
  Lock,
  MessageSquare,
  Clock
} from 'lucide-react';
import { MatrimonialProfile } from '../types/matrimony';
import { useAuth } from '../context/AuthContext';
import { submitReport } from '../services/reportService';
import { formatFullDob, formatDateOfBirth } from '../utils/dateUtils';

interface ProfileDetailModalProps {
  profile: MatrimonialProfile | null;
  isOpen: boolean;
  isShortlisted?: boolean;
  hasExpressedInterest?: boolean;
  onClose: () => void;
  onExpressInterest: (profile: MatrimonialProfile, message?: string) => void;
  onToggleShortlist: (profile: MatrimonialProfile) => void;
  onOpenLogin: () => void;
}

export const ProfileDetailModal: React.FC<ProfileDetailModalProps> = ({
  profile,
  isOpen,
  isShortlisted = false,
  hasExpressedInterest = false,
  onClose,
  onExpressInterest,
  onToggleShortlist,
  onOpenLogin
}) => {
  const { currentUser, currentProfile, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'family' | 'preferences'>('overview');
  const [interestMessage, setInterestMessage] = useState('');
  const [showInterestInput, setShowInterestInput] = useState(false);
  const [showContactRequest, setShowContactRequest] = useState(false);
  const [contactRequested, setContactRequested] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate or Fake Information');
  const [reportDetails, setReportDetails] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [submittingReport, setSubmittingReport] = useState(false);

  if (!isOpen || !profile) return null;

  const handleInterestSend = () => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    onExpressInterest(profile, interestMessage);
    setShowInterestInput(false);
  };

  const handleContactRequestSubmit = () => {
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    setContactRequested(true);
    setTimeout(() => {
      setShowContactRequest(false);
    }, 2000);
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    setSubmittingReport(true);
    try {
      await submitReport({
        reporterId: currentUser.uid,
        reportedProfileId: profile.id,
        reportedProfileName: profile.fullName,
        reason: reportReason,
        details: reportDetails
      });
      setReportSuccess(true);
      setTimeout(() => {
        setShowReportModal(false);
        setReportSuccess(false);
        setReportDetails('');
      }, 2000);
    } catch (err) {
      alert('Could not submit report. Please try again.');
    } finally {
      setSubmittingReport(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        className="bg-[#FAF6F0] w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] relative max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#680916] text-white px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/40 shrink-0">
          <div className="flex items-center space-x-3">
            <span className="font-heading font-bold text-lg sm:text-xl text-[#F3E5AB]">
              Matrimonial Profile
            </span>
            <span className="text-xs font-mono font-bold bg-[#4D0610] text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/50">
              {profile.id}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleShortlist(profile)}
              className={`p-2 rounded-full transition-colors ${
                isShortlisted ? 'bg-red-500/20 text-red-300' : 'text-stone-300 hover:text-red-300'
              }`}
              title={isShortlisted ? 'Shortlisted' : 'Shortlist'}
            >
              <Heart className={`w-5 h-5 ${isShortlisted ? 'fill-red-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-[#800D1E] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          
          {/* Top Hero Section */}
          <div className="flex flex-col md:flex-row items-start gap-6 pb-6 border-b border-stone-200">
            {/* Primary Photograph */}
            <div className="relative mx-auto md:mx-0 shrink-0">
              <div className="w-40 h-52 sm:w-48 sm:h-60 rounded-2xl overflow-hidden ring-4 ring-[#D4AF37] shadow-xl">
                <img
                  src={profile.photoUrl || (profile.gender === 'bride' 
                    ? 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=600' 
                    : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600')}
                  alt={profile.fullName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-[#680916] text-[#ECC86A] text-xs font-bold px-3 py-1 rounded-full border border-[#D4AF37] shadow-lg flex items-center space-x-1 whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-[#ECC86A]" />
                <span>Verified Kshatriya</span>
              </div>
            </div>

            {/* Core Details */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
                  {profile.fullName}
                </h2>
                <p className="text-sm text-stone-600 font-medium mt-1">
                  Surname: <strong className="text-[#680916]">{profile.surname || 'Vadiyaraju'}</strong>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                <span className="px-3 py-1 bg-amber-100/70 text-amber-950 font-semibold text-xs rounded-lg border border-amber-300">
                  {profile.age} Years • {profile.height}
                </span>
                <span className="px-3 py-1 bg-rose-50 text-rose-950 font-semibold text-xs rounded-lg border border-rose-200 capitalize">
                  {profile.maritalStatus}
                </span>
                <span className="px-3 py-1 bg-amber-50 text-[#8A1022] font-bold text-xs rounded-lg border border-amber-300 flex items-center space-x-1">
                  <Flame className="w-3.5 h-3.5 text-amber-600" />
                  <span>Gotra: {profile.gotra || 'Kashyapa'}</span>
                </span>
              </div>

              {/* Community & Vamsha */}
              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200/80 text-xs text-stone-700 space-y-1">
                <div>
                  <span className="font-semibold text-stone-900">Community:</span> {profile.community}
                </div>
                {profile.subCommunity && (
                  <div>
                    <span className="font-semibold text-stone-900">Vamsha / Sub-lineage:</span> {profile.subCommunity}
                  </div>
                )}
                <div className="text-[11px] text-stone-500 italic">
                  Royal Solar Dynasty lineage recorded & confirmed.
                </div>
              </div>

              {/* Express Interest Quick Bar */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setShowInterestInput(!showInterestInput)}
                  disabled={hasExpressedInterest}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 shadow-md transition-all ${
                    hasExpressedInterest 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : 'bg-[#680916] text-[#F3E5AB] hover:bg-[#800D1E]'
                  }`}
                >
                  {hasExpressedInterest ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Interest Sent</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#ECC86A]" />
                      <span>Express Interest</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowContactRequest(true)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs bg-white text-stone-800 border border-stone-300 hover:bg-stone-50 hover:border-amber-400 flex items-center space-x-1.5 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  <span>Request Contact Details</span>
                </button>

                <button
                  onClick={() => setShowReportModal(true)}
                  className="px-3 py-2 text-stone-400 hover:text-red-600 text-xs flex items-center space-x-1"
                  title="Report Profile"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Report</span>
                </button>
              </div>

              {/* Interest Message Popout */}
              {showInterestInput && (
                <div className="bg-white p-3 rounded-xl border border-amber-300 shadow-lg space-y-2 animate-in fade-in">
                  <label className="text-xs font-semibold text-stone-700">
                    Add a personalized note to the family (Optional):
                  </label>
                  <textarea
                    value={interestMessage}
                    onChange={(e) => setInterestMessage(e.target.value)}
                    placeholder="Respected family, we came across your profile and found the attributes very well-matched..."
                    className="w-full text-xs p-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                    rows={2}
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setShowInterestInput(false)}
                      className="px-3 py-1 text-xs text-stone-500 hover:text-stone-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleInterestSend}
                      className="px-4 py-1 text-xs font-bold bg-[#680916] text-[#F3E5AB] rounded-lg hover:bg-[#800D1E]"
                    >
                      Send Interest Now
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Gallery Photos if any */}
          {profile.additionalPhotos && profile.additionalPhotos.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Additional Profile Photos
              </h4>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {profile.additionalPhotos.map((photo, i) => (
                  <img
                    key={i}
                    src={photo}
                    alt={`Additional photo ${i + 1}`}
                    className="w-24 h-28 object-cover rounded-xl ring-1 ring-amber-300"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 space-x-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-2 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === 'overview'
                  ? 'border-[#680916] text-[#680916]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              About & Career
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className={`pb-2 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === 'family'
                  ? 'border-[#680916] text-[#680916]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Family & Lineage
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`pb-2 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === 'preferences'
                  ? 'border-[#680916] text-[#680916]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Partner Preferences
            </button>
          </div>

          {/* Tab 1: About & Career */}
          {activeTab === 'overview' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Location */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#680916]">
                    <MapPin className="w-4 h-4" />
                    <span>Location & Roots</span>
                  </div>
                  <div className="text-xs text-stone-700 space-y-1">
                    <div><strong>Native Place:</strong> {profile.nativePlace}</div>
                    <div><strong>Current City:</strong> {profile.currentCity}</div>
                    <div><strong>State & Country:</strong> {profile.state}, {profile.country}</div>
                  </div>
                </div>

                {/* Education & Profession */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#680916]">
                    <GraduationCap className="w-4 h-4" />
                    <span>Education & Profession</span>
                  </div>
                  <div className="text-xs text-stone-700 space-y-1">
                    <div><strong>Highest Degree:</strong> {profile.education}</div>
                    <div><strong>Occupation:</strong> {profile.occupation}</div>
                    {profile.annualIncome && (
                      <div><strong>Annual Income:</strong> {profile.annualIncome}</div>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#680916]">
                    <Languages className="w-4 h-4" />
                    <span>Languages Known</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.languagesKnown?.map((lang, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Date of Birth & Astrological Details */}
                <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center space-x-2 text-xs font-bold text-[#680916]">
                    <Calendar className="w-4 h-4" />
                    <span>Date of Birth & Astrological Details</span>
                  </div>
                  <div className="text-xs text-stone-700 space-y-1.5">
                    <div>
                      <strong>Date of Birth:</strong> {formatFullDob(profile.dateOfBirth)}
                    </div>
                    <div>
                      <strong>Age:</strong> {profile.age} Years
                    </div>
                    {profile.timeOfBirth && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span><strong>Time of Birth:</strong> {profile.timeOfBirth}</span>
                      </div>
                    )}
                    {profile.placeOfBirth && (
                      <div>
                        <strong>Place of Birth (Janma Sthalam):</strong> {profile.placeOfBirth}
                      </div>
                    )}
                    <div className="pt-1">
                      <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-[10px] font-medium">
                        ✓ Kundali / Horoscope available on family exchange
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Profile Description */}
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#680916]">
                  <Info className="w-4 h-4" />
                  <span>About the Candidate</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {profile.profileDescription || 'No description provided.'}
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Family & Lineage */}
          {activeTab === 'family' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center space-x-2 text-sm font-bold text-[#680916]">
                  <Users className="w-4 h-4" />
                  <span>Parents & Lineage Details</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 block">Father's Name</span>
                    <strong className="text-stone-900 text-sm">{profile.fatherName || 'Not specified'}</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 block">Mother's Name</span>
                    <strong className="text-stone-900 text-sm">{profile.motherName || 'Not specified'}</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 block">Family Gotra</span>
                    <strong className="text-stone-900 text-sm">{profile.gotra || 'Kashyapa'}</strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 block">Ancestral Roots</span>
                    <strong className="text-stone-900 text-sm">{profile.nativePlace}</strong>
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-stone-800 block mb-1">Family Background & Values:</span>
                  <p className="text-xs sm:text-sm text-stone-700 bg-amber-50/50 p-3 rounded-lg border border-amber-200/60 leading-relaxed">
                    {profile.familyDetails || 'Belongs to an esteemed traditional Suryavamsha Vadiyaraju Kshatriya family.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Partner Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-white p-5 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center space-x-2 text-sm font-bold text-[#680916]">
                  <Heart className="w-4 h-4" />
                  <span>Desired Life Partner Attributes</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 block">Preferred Age Range</span>
                    <strong className="text-stone-900 text-sm">
                      {profile.partnerPreferences?.ageMin || 22} - {profile.partnerPreferences?.ageMax || 32} Years
                    </strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 block">Preferred Height</span>
                    <strong className="text-stone-900 text-sm">
                      {profile.partnerPreferences?.heightMin || "5'2\" and above"}
                    </strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 block">Gotra Preference</span>
                    <strong className="text-stone-900 text-sm">
                      {profile.partnerPreferences?.gotra || `Other than ${profile.gotra || 'Kashyapa'}`}
                    </strong>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-lg">
                    <span className="text-stone-500 block">Community</span>
                    <strong className="text-stone-900 text-sm">Suryavamsha Vadiyaraju Kshatriya</strong>
                  </div>
                </div>

                {profile.partnerPreferences?.otherNotes && (
                  <div className="pt-2">
                    <span className="text-xs font-bold text-stone-800 block mb-1">Additional Expectations:</span>
                    <p className="text-xs sm:text-sm text-stone-700 bg-amber-50/50 p-3 rounded-lg border border-amber-200/60 leading-relaxed">
                      {profile.partnerPreferences.otherNotes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Contact Request Privacy Protection Modal */}
        {showContactRequest && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-amber-300 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[#680916]">
                  <Lock className="w-5 h-5 text-amber-600" />
                  <h3 className="font-heading font-bold text-base">Contact Privacy & Security</h3>
                </div>
                <button onClick={() => setShowContactRequest(false)} className="text-stone-400 hover:text-stone-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {contactRequested ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-emerald-900">Contact Request Submitted</p>
                  <p className="text-xs text-emerald-700">
                    The family of {profile.fullName} has been notified. Once approved, verified contact numbers will be securely shared.
                  </p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    To maintain the highest security and dignity for our Suryavamsha families, contact numbers and residential addresses are kept private by default.
                  </p>
                  <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <p className="font-semibold">By requesting contact details:</p>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
                      <li>Your verified profile information is shared with the candidate's family.</li>
                      <li>Our community marriage counselor is notified to facilitate the connection.</li>
                    </ul>
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      onClick={() => setShowContactRequest(false)}
                      className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleContactRequestSubmit}
                      className="px-5 py-2 text-xs font-bold bg-[#680916] text-[#F3E5AB] rounded-xl hover:bg-[#800D1E]"
                    >
                      Send Contact Request
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Report Profile Modal */}
        {showReportModal && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-red-300 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-red-700">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <h3 className="font-heading font-bold text-base">Report Profile</h3>
                </div>
                <button onClick={() => setShowReportModal(false)} className="text-stone-400 hover:text-stone-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {reportSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <Check className="w-8 h-8 text-emerald-600 mx-auto" />
                  <p className="text-sm font-bold text-emerald-900">Report Submitted</p>
                  <p className="text-xs text-emerald-700">
                    Our admin verification committee will investigate this profile promptly. Thank you for protecting our community.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleReportSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Reason for report</label>
                    <select
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-1 focus:ring-red-500"
                    >
                      <option>Inappropriate or Fake Information</option>
                      <option>Incorrect Community or Gotra Claim</option>
                      <option>Offensive Photographs</option>
                      <option>Duplicate Profile</option>
                      <option>Commercial / Spam Account</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">Details (Optional)</label>
                    <textarea
                      value={reportDetails}
                      onChange={(e) => setReportDetails(e.target.value)}
                      placeholder="Please describe why this profile violates community guidelines..."
                      rows={3}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-xl focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowReportModal(false)}
                      className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submittingReport}
                      className="px-5 py-2 text-xs font-bold bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50"
                    >
                      {submittingReport ? 'Submitting...' : 'Submit Report'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
