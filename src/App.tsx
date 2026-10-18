import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Users, 
  UserCheck, 
  Sparkles, 
  Search, 
  MapPin, 
  Heart, 
  ShieldCheck, 
  ArrowRight, 
  PhoneCall, 
  Crown, 
  CheckCircle2, 
  Lock, 
  Calendar,
  Flame,
  Award,
  BookOpen
} from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HeroBanner } from './components/HeroBanner';
import { SearchFilterBar } from './components/SearchFilterBar';
import { ProfileCard } from './components/ProfileCard';
import { ProfileDetailModal } from './components/ProfileDetailModal';
import { RegisterModal } from './components/RegisterModal';
import { LoginModal } from './components/LoginModal';
import { PartnerPreferencesModal } from './components/PartnerPreferencesModal';
import { ShortlistModal } from './components/ShortlistModal';
import { ConsultantSection } from './components/ConsultantSection';
import { InterestsView } from './components/InterestsView';
import { MyProfileView } from './components/MyProfileView';
import { AdminPanel } from './components/AdminPanel';
import { PrivacyPolicyModal, TermsModal } from './components/LegalModals';
import { ShareWebsiteModal } from './components/ShareWebsiteModal';
import { Footer } from './components/Footer';
import { 
  fetchProfiles, 
  ensureSeedProfiles, 
  fetchProfileById 
} from './services/profileService';
import { sendInterest, fetchSentInterests } from './services/interestService';
import { toggleShortlist, fetchUserShortlist } from './services/shortlistService';
import { MatrimonialProfile, ProfileFilters } from './types/matrimony';

const DEFAULT_FILTERS: ProfileFilters = {
  gender: 'all',
  sortBy: 'recently_joined'
};

function MainApp() {
  const { currentUser, currentProfile, isAdmin } = useAuth();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<'home' | 'brides' | 'grooms' | 'search' | 'interests' | 'my-profile'>('home');

  // Profiles State
  const [profiles, setProfiles] = useState<MatrimonialProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [filters, setFilters] = useState<ProfileFilters>(DEFAULT_FILTERS);

  // User Interacted State
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());
  const [sentInterestRecipientIds, setSentInterestRecipientIds] = useState<Set<string>>(new Set());

  // Modal States
  const [selectedProfile, setSelectedProfile] = useState<MatrimonialProfile | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [preferencesModalOpen, setPreferencesModalOpen] = useState(false);
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false);
  const [consultantModalOpen, setConsultantModalOpen] = useState(false);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Initialize and Seed Profiles
  useEffect(() => {
    const init = async () => {
      setLoadingProfiles(true);
      await ensureSeedProfiles();
      const data = await fetchProfiles(filters);
      setProfiles(data);
      setLoadingProfiles(false);
    };
    init();
  }, []);

  // Reload profiles when filters change
  useEffect(() => {
    const loadFiltered = async () => {
      setLoadingProfiles(true);
      const data = await fetchProfiles(filters);
      setProfiles(data);
      setLoadingProfiles(false);
    };
    loadFiltered();
  }, [filters]);

  // Load User Shortlists and Sent Interests
  useEffect(() => {
    if (currentUser) {
      loadUserData();
    } else {
      setShortlistedIds(new Set());
      setSentInterestRecipientIds(new Set());
    }
  }, [currentUser]);

  const loadUserData = async () => {
    if (!currentUser) return;
    try {
      const [shortlistData, sentInterestsData] = await Promise.all([
        fetchUserShortlist(currentUser.uid),
        fetchSentInterests(currentUser.uid)
      ]);
      setShortlistedIds(new Set(shortlistData.map(s => s.profileId)));
      setSentInterestRecipientIds(new Set(sentInterestsData.map(i => i.recipientProfileId)));
    } catch (err) {
      console.warn('Could not load user interaction data:', err);
    }
  };

  const handleNavigate = (tab: string) => {
    if (tab === 'brides') {
      setFilters(prev => ({ ...prev, gender: 'bride' }));
      setCurrentTab('brides');
    } else if (tab === 'grooms') {
      setFilters(prev => ({ ...prev, gender: 'groom' }));
      setCurrentTab('grooms');
    } else if (tab === 'search') {
      setFilters(prev => ({ ...prev, gender: 'all' }));
      setCurrentTab('search');
    } else {
      setCurrentTab(tab as any);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeroSearch = (searchParams: Partial<ProfileFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...searchParams
    }));
    setCurrentTab('search');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleViewProfile = (profile: MatrimonialProfile) => {
    setSelectedProfile(profile);
    setProfileModalOpen(true);
  };

  const handleViewProfileById = async (profileId: string) => {
    const existing = profiles.find(p => p.id === profileId);
    if (existing) {
      setSelectedProfile(existing);
      setProfileModalOpen(true);
      return;
    }
    const fetched = await fetchProfileById(profileId);
    if (fetched) {
      setSelectedProfile(fetched);
      setProfileModalOpen(true);
    } else {
      alert('Profile details could not be retrieved.');
    }
  };

  const handleExpressInterest = async (profile: MatrimonialProfile, message?: string) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }

    try {
      await sendInterest({
        senderId: currentUser.uid,
        senderProfileId: currentProfile?.id || 'MEMBER',
        senderName: currentProfile?.fullName || currentUser.displayName || 'Suryavamsha Member',
        senderPhotoUrl: currentProfile?.photoUrl || currentUser.photoURL || '',
        recipientId: profile.userId,
        recipientProfileId: profile.id,
        message
      });

      setSentInterestRecipientIds(prev => new Set([...prev, profile.id]));

      // Festive wedding celebration confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#D4AF37', '#800D1E', '#ECC86A', '#ffffff']
      });

      alert(`Interest expressed successfully to ${profile.fullName}! They will receive your notification.`);
    } catch (err: any) {
      alert(err.message || 'Could not send interest.');
    }
  };

  const handleToggleShortlist = async (profile: MatrimonialProfile) => {
    if (!currentUser) {
      setLoginModalOpen(true);
      return;
    }

    try {
      const added = await toggleShortlist(currentUser.uid, profile);
      setShortlistedIds(prev => {
        const next = new Set(prev);
        if (added) {
          next.add(profile.id);
        } else {
          next.delete(profile.id);
        }
        return next;
      });
    } catch (err) {
      alert('Could not update shortlist.');
    }
  };

  const handleLocationClick = (cityName: string) => {
    setFilters(prev => ({
      ...prev,
      currentCity: cityName,
      gender: 'all'
    }));
    setCurrentTab('search');
    window.scrollTo({ top: 350, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6F0] selection:bg-amber-200 selection:text-amber-950">
      
      {/* Royal Header */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenRegister={() => setRegisterModalOpen(true)}
        onOpenShortlist={() => setShortlistModalOpen(true)}
        onOpenPreferences={() => setPreferencesModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenConsultant={() => setConsultantModalOpen(true)}
        onOpenShare={() => setShareModalOpen(true)}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        
        {/* TAB 1: HOME PAGE */}
        {currentTab === 'home' && (
          <div className="space-y-16 pb-16">
            
            {/* Hero Banner */}
            <HeroBanner
              onSearch={handleHeroSearch}
              onOpenRegister={() => setRegisterModalOpen(true)}
              onOpenShare={() => setShareModalOpen(true)}
              totalProfilesCount={profiles.length}
            />

            {/* Core Community Pillars */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="bg-white p-6 rounded-3xl card-gold-border space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-[#680916]">
                    <Crown className="w-6 h-6 text-[#D4AF37]" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-stone-900">
                    Sacred Kshatriya Lineages
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-subheading">
                    Strict verification of Suryavamsha Vadiyaraju Kshatriya ancestry, preserving family gotras, vamshas, and honor with utmost reverence.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl card-gold-border space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-800">
                    <Lock className="w-6 h-6 text-emerald-700" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-stone-900">
                    100% Contact Confidentiality
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-subheading">
                    Personal telephone numbers and addresses are strictly concealed by default. Information is disclosed only upon mutual family authorization.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl card-gold-border space-y-3 shadow-xs">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-800">
                    <PhoneCall className="w-6 h-6 text-rose-700" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-stone-900">
                    Senior Community Counselors
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-subheading">
                    Elders and matrimonial consultants provide dedicated assistance for horoscopic matching, sagotra exemptions, and smooth family introductions.
                  </p>
                </div>

              </div>
            </section>

            {/* Recently Joined Profiles Showcase */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#8A1022] uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                    <span>Verified Registry Profiles</span>
                  </div>
                  <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
                    Recently Joined Profiles
                  </h2>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleNavigate('brides')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#680916] text-[#F3E5AB] hover:bg-[#800D1E] shadow-sm"
                  >
                    View All Brides →
                  </button>
                  <button
                    onClick={() => handleNavigate('grooms')}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-[#800D1E] text-[#F3E5AB] hover:bg-[#680916] shadow-sm"
                  >
                    View All Grooms →
                  </button>
                </div>
              </div>

              {loadingProfiles ? (
                <div className="py-16 text-center text-xs text-stone-500">
                  Loading verified community profiles...
                </div>
              ) : profiles.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-stone-200 text-xs text-stone-500">
                  No published profiles found. Register your profile to get started!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {profiles.slice(0, 6).map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      isShortlisted={shortlistedIds.has(profile.id)}
                      hasExpressedInterest={sentInterestRecipientIds.has(profile.id)}
                      onViewProfile={handleViewProfile}
                      onExpressInterest={handleExpressInterest}
                      onToggleShortlist={handleToggleShortlist}
                      onRequestContact={() => handleViewProfile(profile)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* Popular Native & Current Locations */}
            <section className="bg-amber-100/40 py-12 border-y border-[#D4AF37]/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">
                    Explore Profiles by Region & Roots
                  </h2>
                  <p className="text-xs text-stone-600">
                    Connecting families across prominent Kshatriya native hubs and global NRI destinations
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { city: 'Hyderabad', label: 'Hyderabad / Telangana', count: '140+ Profiles' },
                    { city: 'Bhimavaram', label: 'Bhimavaram / Godavari', count: '95+ Profiles' },
                    { city: 'Rajahmundry', label: 'Rajahmundry & Tanuku', count: '80+ Profiles' },
                    { city: 'Visakhapatnam', label: 'Visakhapatnam', count: '75+ Profiles' },
                    { city: 'Bengaluru', label: 'Bengaluru / Karnataka', count: '60+ Profiles' },
                    { city: 'USA', label: 'USA / NRI Kshatriya', count: '45+ Profiles' },
                  ].map((loc, i) => (
                    <button
                      key={i}
                      onClick={() => handleLocationClick(loc.city)}
                      className="bg-white p-4 rounded-2xl border border-amber-200/80 hover:border-[#D4AF37] hover:shadow-md transition-all text-center group cursor-pointer"
                    >
                      <MapPin className="w-5 h-5 text-[#8A1022] mx-auto mb-1 group-hover:scale-110 transition-transform" />
                      <div className="font-bold text-xs text-stone-900 group-hover:text-[#680916]">
                        {loc.label}
                      </div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{loc.count}</div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* How It Works */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold text-[#8A1022] uppercase tracking-wider">
                  Traditional Kshatriya Matchmaking
                </span>
                <h2 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
                  How The Matrimonial Process Works
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                
                <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-3 relative">
                  <div className="w-10 h-10 rounded-full bg-[#680916] text-[#F3E5AB] font-heading font-bold text-sm flex items-center justify-center mx-auto shadow-md">
                    1
                  </div>
                  <h3 className="font-heading font-bold text-sm text-stone-900">
                    Register Community Profile
                  </h3>
                  <p className="text-xs text-stone-600">
                    Provide verified details regarding surname, gotra, vamsha, education, career, and parent details.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-3 relative">
                  <div className="w-10 h-10 rounded-full bg-[#680916] text-[#F3E5AB] font-heading font-bold text-sm flex items-center justify-center mx-auto shadow-md">
                    2
                  </div>
                  <h3 className="font-heading font-bold text-sm text-stone-900">
                    Filter & Express Interest
                  </h3>
                  <p className="text-xs text-stone-600">
                    Search brides or grooms using age, native place, and gotra filters, and express interest to suitable families.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-3 relative">
                  <div className="w-10 h-10 rounded-full bg-[#680916] text-[#F3E5AB] font-heading font-bold text-sm flex items-center justify-center mx-auto shadow-md">
                    3
                  </div>
                  <h3 className="font-heading font-bold text-sm text-stone-900">
                    Counselor & Horoscope Review
                  </h3>
                  <p className="text-xs text-stone-600">
                    Utilize our marriage consultant for lineage verification, astrological horoscope matching, and mutual family consent.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-stone-200 space-y-3 relative">
                  <div className="w-10 h-10 rounded-full bg-[#680916] text-[#F3E5AB] font-heading font-bold text-sm flex items-center justify-center mx-auto shadow-md">
                    4
                  </div>
                  <h3 className="font-heading font-bold text-sm text-stone-900">
                    Sacred Vivaha (పరిణయం)
                  </h3>
                  <p className="text-xs text-stone-600">
                    Proceed with traditional engagement and wedding rites blessed by both families and community elders.
                  </p>
                </div>

              </div>
            </section>

            {/* Marriage Consultant Section Embedded in Home */}
            <ConsultantSection onOpenLogin={() => setLoginModalOpen(true)} />

          </div>
        )}

        {/* TAB 2, 3, 4: BRIDES / GROOMS / ADVANCED SEARCH */}
        {(currentTab === 'brides' || currentTab === 'grooms' || currentTab === 'search') && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* Header Title */}
            <div>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-stone-900">
                {currentTab === 'brides' && 'Suryavamsha Bride Profiles (వధువులు)'}
                {currentTab === 'grooms' && 'Suryavamsha Groom Profiles (వరులు)'}
                {currentTab === 'search' && 'Advanced Matrimonial Profile Search'}
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Filter verified Kshatriya matrimonial profiles by age, surname, native place, gotra, and education.
              </p>
            </div>

            {/* Filter and Sort Bar */}
            <SearchFilterBar
              filters={filters}
              onChangeFilters={setFilters}
              onReset={() => setFilters(DEFAULT_FILTERS)}
              resultCount={profiles.length}
            />

            {/* Profiles Grid */}
            {loadingProfiles ? (
              <div className="py-20 text-center text-xs text-stone-500">
                Loading matching profiles...
              </div>
            ) : profiles.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
                <Search className="w-12 h-12 text-stone-300 mx-auto" />
                <h3 className="font-heading font-bold text-base text-stone-800">
                  No Profiles Match Current Search Criteria
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Try adjusting the age boundaries, broadening native places, or clearing gotra exclusions to view more profiles.
                </p>
                <button
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="px-5 py-2 rounded-xl bg-[#680916] text-[#F3E5AB] font-bold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profiles.map((profile) => (
                  <ProfileCard
                    key={profile.id}
                    profile={profile}
                    isShortlisted={shortlistedIds.has(profile.id)}
                    hasExpressedInterest={sentInterestRecipientIds.has(profile.id)}
                    onViewProfile={handleViewProfile}
                    onExpressInterest={handleExpressInterest}
                    onToggleShortlist={handleToggleShortlist}
                    onRequestContact={() => handleViewProfile(profile)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: INTERESTS & PROPOSALS */}
        {currentTab === 'interests' && (
          <InterestsView
            onViewProfileById={handleViewProfileById}
            onOpenLogin={() => setLoginModalOpen(true)}
          />
        )}

        {/* TAB 6: MY PROFILE */}
        {currentTab === 'my-profile' && (
          <MyProfileView
            onOpenPreferences={() => setPreferencesModalOpen(true)}
            onOpenRegister={() => setRegisterModalOpen(true)}
          />
        )}

      </main>

      {/* Footer */}
      <Footer
        onNavigate={handleNavigate}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenTerms={() => setTermsModalOpen(true)}
        onOpenConsultant={() => setConsultantModalOpen(true)}
        onOpenRegister={() => setRegisterModalOpen(true)}
        onOpenShare={() => setShareModalOpen(true)}
      />

      {/* Mobile Sticky Bottom Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenPreferences={() => setPreferencesModalOpen(true)}
        onOpenShortlist={() => setShortlistModalOpen(true)}
        onOpenConsultant={() => setConsultantModalOpen(true)}
        onOpenPrivacy={() => setPrivacyModalOpen(true)}
        onOpenTerms={() => setTermsModalOpen(true)}
        onOpenAdmin={() => setAdminModalOpen(true)}
        onOpenShare={() => setShareModalOpen(true)}
      />

      {/* MODALS */}
      
      {/* 1. Full Profile Detail Modal */}
      <ProfileDetailModal
        profile={selectedProfile}
        isOpen={profileModalOpen}
        isShortlisted={selectedProfile ? shortlistedIds.has(selectedProfile.id) : false}
        hasExpressedInterest={selectedProfile ? sentInterestRecipientIds.has(selectedProfile.id) : false}
        onClose={() => setProfileModalOpen(false)}
        onExpressInterest={handleExpressInterest}
        onToggleShortlist={handleToggleShortlist}
        onOpenLogin={() => {
          setProfileModalOpen(false);
          setLoginModalOpen(true);
        }}
      />

      {/* 2. Registration Modal (24 fields) */}
      <RegisterModal
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setRegisterModalOpen(false);
          setLoginModalOpen(true);
        }}
      />

      {/* 3. Login Modal */}
      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setLoginModalOpen(false);
          setRegisterModalOpen(true);
        }}
      />

      {/* 4. Partner Preferences Modal */}
      <PartnerPreferencesModal
        isOpen={preferencesModalOpen}
        onClose={() => setPreferencesModalOpen(false)}
        allProfiles={profiles}
        onViewProfile={handleViewProfile}
      />

      {/* 5. Shortlist Modal */}
      <ShortlistModal
        isOpen={shortlistModalOpen}
        onClose={() => setShortlistModalOpen(false)}
        onViewProfileById={handleViewProfileById}
        allProfiles={profiles}
      />

      {/* 6. Marriage Consultant Modal */}
      {consultantModalOpen && (
        <ConsultantSection
          isModal={true}
          onCloseModal={() => setConsultantModalOpen(false)}
          onOpenLogin={() => {
            setConsultantModalOpen(false);
            setLoginModalOpen(true);
          }}
        />
      )}

      {/* 7. Admin Control Panel Modal */}
      <AdminPanel
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
        onViewProfile={handleViewProfile}
      />

      {/* 8. Privacy & Terms Modals */}
      <PrivacyPolicyModal
        isOpen={privacyModalOpen}
        onClose={() => setPrivacyModalOpen(false)}
      />
      <TermsModal
        isOpen={termsModalOpen}
        onClose={() => setTermsModalOpen(false)}
      />

      {/* 9. Share Website Modal */}
      <ShareWebsiteModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
