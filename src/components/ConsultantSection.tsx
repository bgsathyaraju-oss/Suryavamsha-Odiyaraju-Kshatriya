import React, { useState, useEffect } from 'react';
import { 
  PhoneCall, 
  MessageCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  User, 
  FileText, 
  Send, 
  Crown,
  Sparkles,
  HelpCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  MARRIAGE_CONSULTANTS, 
  submitConsultationRequest, 
  fetchUserConsultationRequests 
} from '../services/consultationService';
import { ConsultationRequest, Consultant } from '../types/matrimony';

interface ConsultantSectionProps {
  onOpenLogin: () => void;
  isModal?: boolean;
  onCloseModal?: () => void;
}

export const ConsultantSection: React.FC<ConsultantSectionProps> = ({
  onOpenLogin,
  isModal = false,
  onCloseModal
}) => {
  const { currentUser, currentProfile } = useAuth();
  
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant>(MARRIAGE_CONSULTANTS[0]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  
  // Booking Form State
  const [memberName, setMemberName] = useState(currentProfile?.fullName || '');
  const [memberPhone, setMemberPhone] = useState('');
  const [memberEmail, setMemberEmail] = useState(currentUser?.email || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [requirements, setRequirements] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [userRequests, setUserRequests] = useState<ConsultationRequest[]>([]);

  useEffect(() => {
    if (currentUser) {
      loadRequests();
    }
  }, [currentUser]);

  const loadRequests = async () => {
    if (!currentUser) return;
    try {
      const data = await fetchUserConsultationRequests(currentUser.uid);
      setUserRequests(data);
    } catch (err) {
      console.warn('Could not fetch consultation requests:', err);
    }
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenLogin();
      return;
    }
    if (!memberPhone.trim() || memberPhone.length < 10) {
      alert('Please enter a valid 10-digit contact number for the consultant to reach you.');
      return;
    }

    setSubmitting(true);
    try {
      await submitConsultationRequest({
        userId: currentUser.uid,
        memberName: memberName.trim() || (currentProfile?.fullName || 'Community Member'),
        memberPhone,
        memberEmail,
        preferredDate: preferredDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        preferredTime,
        requirements: requirements || 'Seeking traditional Suryavamsha Kshatriya horoscope and match consultation.',
        consultantName: selectedConsultant.name
      });
      setSuccessMsg(true);
      setShowBookingForm(false);
      await loadRequests();
      setTimeout(() => setSuccessMsg(false), 4000);
    } catch (err) {
      alert('Could not submit consultation request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const content = (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-amber-100 text-[#680916] px-3.5 py-1 rounded-full text-xs font-bold border border-amber-300">
          <Crown className="w-3.5 h-3.5 text-amber-700" />
          <span>Suryavamsha Community Matrimonial Advisory</span>
        </div>
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
          Senior Marriage Consultant Service
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
          Experienced Kshatriya elders and genealogists offering personalized guidance on gotra lineage verification, horoscope matching, family mediation, and respectable matchmaking.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 flex items-center space-x-3 text-xs font-semibold max-w-xl mx-auto shadow-md">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <p className="text-sm font-bold">Consultation Request Booked Successfully!</p>
            <p className="text-emerald-700 font-normal mt-0.5">
              The counselor will contact you at your preferred date and time.
            </p>
          </div>
        </div>
      )}

      {/* Consultant Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {MARRIAGE_CONSULTANTS.map((c) => (
          <div 
            key={c.id}
            className="bg-white rounded-3xl p-6 card-gold-border flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="flex items-start space-x-4">
              <img
                src={c.photoUrl}
                alt={c.name}
                className="w-20 h-24 rounded-2xl object-cover ring-2 ring-[#D4AF37] shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  {c.experience}
                </span>
                <h3 className="font-heading font-bold text-base text-stone-900 mt-1">
                  {c.name}
                </h3>
                <p className="text-xs text-stone-600 font-medium">{c.title}</p>
                <p className="text-[11px] text-stone-400 mt-0.5">{c.availableTimings}</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed italic bg-amber-50/40 p-3 rounded-xl border border-amber-100">
              "{c.bio}"
            </p>

            {/* Specialties */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-700 block uppercase tracking-wider">
                Services Offered:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {c.specialties.map((spec, i) => (
                  <span key={i} className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-medium">
                    ✓ {spec}
                  </span>
                ))}
              </div>
            </div>

            {/* Consultant Actions */}
            <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setSelectedConsultant(c);
                  setShowBookingForm(true);
                }}
                className="flex-1 py-2.5 px-3 bg-[#680916] text-[#F3E5AB] text-xs font-bold rounded-xl hover:bg-[#800D1E] transition-colors shadow-xs flex items-center justify-center space-x-1.5"
              >
                <Calendar className="w-4 h-4 text-[#ECC86A]" />
                <span>Book Consultation</span>
              </button>

              <a
                href={`tel:${c.phone}`}
                className="p-2.5 bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-700 rounded-xl transition-colors border border-stone-200 flex items-center justify-center"
                title="Direct Phone Call"
              >
                <PhoneCall className="w-4 h-4" />
              </a>

              <a
                href={`https://wa.me/${c.whatsapp}?text=Namaste%20Sri%20Varmaji,%20I%20am%20seeking%20matrimonial%20guidance%20for%20the%20Suryavamsha%20Vadiyaraju%20Kshatriya%20community.`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors flex items-center justify-center shadow-xs"
                title="WhatsApp Consultant"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6F0] w-full max-w-lg rounded-3xl p-6 border-2 border-[#D4AF37] shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-[#680916]" />
                <h3 className="font-heading font-bold text-base text-stone-900">
                  Book Matrimonial Consultation
                </h3>
              </div>
              <button 
                onClick={() => setShowBookingForm(false)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-stone-600">
              Consulting with: <strong className="text-[#680916] font-bold">{selectedConsultant.name}</strong>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Applicant / Parent Name *
                </label>
                <input
                  type="text"
                  required
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={memberPhone}
                    onChange={(e) => setMemberPhone(e.target.value)}
                    placeholder="+91 98490 00000"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Preferred Consultation Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                  >
                    <option>10:00 AM - 11:30 AM</option>
                    <option>11:30 AM - 01:00 PM</option>
                    <option>03:00 PM - 04:30 PM</option>
                    <option>05:00 PM - 06:30 PM</option>
                    <option>07:00 PM - 08:30 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Bride / Groom Requirements & Consultation Objective *
                </label>
                <textarea
                  required
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="e.g. Seeking match guidance for my son (Software Architect in Hyderabad), Kashyapa gotra. Need horoscopic compatibility verification and family connections in Godavari districts."
                  rows={3}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowBookingForm(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 text-xs font-bold bg-[#680916] text-[#F3E5AB] rounded-xl hover:bg-[#800D1E] shadow-md flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5 text-[#ECC86A]" />
                  <span>{submitting ? 'Booking...' : 'Confirm Appointment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member's Consultation Request History */}
      {currentUser && userRequests.length > 0 && (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 border border-stone-200 space-y-4">
          <h3 className="font-heading font-bold text-sm text-stone-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-[#680916]" />
            <span>Your Submitted Consultation Appointments</span>
          </h3>

          <div className="divide-y divide-stone-100">
            {userRequests.map((req) => (
              <div key={req.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-stone-900">{req.consultantName || 'Community Counselor'}</div>
                  <div className="text-stone-500">
                    Slot: {req.preferredDate} at {req.preferredTime}
                  </div>
                  <div className="text-stone-600 mt-1 italic line-clamp-1">
                    "{req.requirements}"
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    req.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                    req.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                    req.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {req.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-[#FAF6F0] w-full max-w-4xl rounded-3xl p-6 sm:p-8 border-2 border-[#D4AF37] shadow-2xl relative max-h-[90vh] overflow-y-auto">
          <button 
            onClick={onCloseModal} 
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          {content}
        </div>
      </div>
    );
  }

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {content}
    </section>
  );
};
