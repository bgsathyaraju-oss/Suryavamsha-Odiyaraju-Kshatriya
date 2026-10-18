import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  User as UserIcon, 
  Menu, 
  X, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  LogOut, 
  FileText, 
  Search, 
  PhoneCall, 
  Crown,
  ChevronDown,
  CheckCircle2,
  SlidersHorizontal,
  Share2
} from 'lucide-react';
import { RoyalEmblem } from './RoyalEmblem';
import { useAuth } from '../context/AuthContext';
import { AppNotification } from '../types/matrimony';
import { fetchNotifications, markNotificationAsRead } from '../services/notificationService';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onOpenShortlist: () => void;
  onOpenPreferences: () => void;
  onOpenAdmin: () => void;
  onOpenConsultant: () => void;
  onOpenShare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenLogin,
  onOpenRegister,
  onOpenShortlist,
  onOpenPreferences,
  onOpenAdmin,
  onOpenConsultant,
  onOpenShare
}) => {
  const { currentUser, currentProfile, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (currentUser) {
      loadNotifs();
      const interval = setInterval(loadNotifs, 15000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [currentUser]);

  const loadNotifs = async () => {
    if (!currentUser) return;
    try {
      const data = await fetchNotifications(currentUser.uid);
      setNotifications(data);
    } catch (e) {
      // Notification polling error fallback
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = async (notif: AppNotification) => {
    if (!notif.isRead) {
      await markNotificationAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    }
    if (notif.type.includes('interest')) {
      onNavigate('interests');
    } else if (notif.type.includes('consultation')) {
      onOpenConsultant();
    }
    setNotifDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#680916] text-white shadow-xl border-b border-[#D4AF37]/40">
      {/* Top Royal Announcement Bar */}
      <div className="bg-[#4D0610] text-[#F3E5AB] text-xs py-1.5 px-4 text-center font-medium tracking-wider flex items-center justify-between sm:justify-center flex-wrap gap-1 border-b border-[#D4AF37]/20">
        <div className="flex items-center space-x-2">
          <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Exclusive, Verified Matrimony for the Suryavamsha Vadiyaraju Kshatriya Community</span>
          <span className="hidden md:inline text-[#D4AF37]">•</span>
          <span className="hidden md:inline">Helpline: +91 98490 23456</span>
        </div>
        <button
          onClick={onOpenShare}
          className="px-2.5 py-0.5 bg-[#680916] hover:bg-[#800D1E] text-[#ECC86A] text-[11px] font-bold rounded-md border border-[#D4AF37]/50 inline-flex items-center space-x-1 transition-colors shadow-xs"
        >
          <Share2 className="w-3 h-3" />
          <span>Website Link</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Emblem */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center space-x-3 cursor-pointer group"
          >
            <RoyalEmblem size={52} className="transform group-hover:scale-105 transition-transform drop-shadow-md" />
            <div className="flex flex-col">
              <span className="font-heading text-lg sm:text-xl font-bold tracking-wider text-[#FAF6F0] leading-tight">
                SURYAVAMSHA
              </span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#F3E5AB]">
                Vadiyaraju Kshatriya Matrimony
              </span>
              <span className="text-[10px] text-[#ECC86A]/80 tracking-widest uppercase font-mono">
                సూర్యవంశ క్షత్రియ పరిణయ వేదిక
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 font-medium text-sm">
            <button
              onClick={() => onNavigate('home')}
              className={`px-3 py-2 rounded-md transition-all ${
                currentTab === 'home' 
                  ? 'bg-[#8A1022] text-[#F3E5AB] font-semibold border-b-2 border-[#D4AF37]' 
                  : 'text-stone-100 hover:text-[#F3E5AB] hover:bg-[#800D1E]/60'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('brides')}
              className={`px-3 py-2 rounded-md transition-all ${
                currentTab === 'brides' 
                  ? 'bg-[#8A1022] text-[#F3E5AB] font-semibold border-b-2 border-[#D4AF37]' 
                  : 'text-stone-100 hover:text-[#F3E5AB] hover:bg-[#800D1E]/60'
              }`}
            >
              Bride Profiles
            </button>
            <button
              onClick={() => onNavigate('grooms')}
              className={`px-3 py-2 rounded-md transition-all ${
                currentTab === 'grooms' 
                  ? 'bg-[#8A1022] text-[#F3E5AB] font-semibold border-b-2 border-[#D4AF37]' 
                  : 'text-stone-100 hover:text-[#F3E5AB] hover:bg-[#800D1E]/60'
              }`}
            >
              Groom Profiles
            </button>
            <button
              onClick={() => onNavigate('search')}
              className={`px-3 py-2 rounded-md transition-all flex items-center space-x-1 ${
                currentTab === 'search' 
                  ? 'bg-[#8A1022] text-[#F3E5AB] font-semibold border-b-2 border-[#D4AF37]' 
                  : 'text-stone-100 hover:text-[#F3E5AB] hover:bg-[#800D1E]/60'
              }`}
            >
              <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Search</span>
            </button>
            <button
              onClick={onOpenConsultant}
              className="px-3 py-2 rounded-md text-stone-100 hover:text-[#F3E5AB] hover:bg-[#800D1E]/60 transition-all flex items-center space-x-1"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#ECC86A]" />
              <span>Marriage Consultant</span>
            </button>
            <button
              onClick={() => onNavigate('interests')}
              className={`px-3 py-2 rounded-md transition-all flex items-center space-x-1 ${
                currentTab === 'interests' 
                  ? 'bg-[#8A1022] text-[#F3E5AB] font-semibold border-b-2 border-[#D4AF37]' 
                  : 'text-stone-100 hover:text-[#F3E5AB] hover:bg-[#800D1E]/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ECC86A]" />
              <span>Interests</span>
            </button>
          </nav>

          {/* Right Action Icons & Auth Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Share Website Link Button */}
            <button
              onClick={onOpenShare}
              title="Share Website Link"
              className="p-2 rounded-full text-[#F3E5AB] hover:bg-[#800D1E] transition-colors relative flex items-center space-x-1 border border-[#D4AF37]/30 bg-[#570712]/50"
            >
              <Share2 className="w-4 h-4 text-[#ECC86A]" />
              <span className="hidden xl:inline text-xs font-semibold text-[#F3E5AB]">Share Link</span>
            </button>

            {/* Shortlist Button */}
            {currentUser && (
              <button
                onClick={onOpenShortlist}
                title="Shortlisted Profiles"
                className="p-2 rounded-full text-[#F3E5AB] hover:bg-[#800D1E] transition-colors relative"
              >
                <Heart className="w-5 h-5" />
              </button>
            )}

            {/* Notification Bell */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setNotifDropdownOpen(!notifDropdownOpen);
                    setUserDropdownOpen(false);
                  }}
                  title="Notifications"
                  className="p-2 rounded-full text-[#F3E5AB] hover:bg-[#800D1E] transition-colors relative"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#D4AF37] text-[#55060F] font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#680916]">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-stone-200 text-stone-800 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="bg-[#680916] text-[#FAF6F0] p-3 flex items-center justify-between border-b border-[#D4AF37]/30">
                      <div className="flex items-center space-x-2">
                        <Bell className="w-4 h-4 text-[#D4AF37]" />
                        <span className="font-semibold text-sm">Notifications</span>
                      </div>
                      <span className="text-xs bg-[#4D0610] text-[#F3E5AB] px-2 py-0.5 rounded-full font-mono">
                        {unreadCount} new
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-stone-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-stone-500 text-sm">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`p-3.5 hover:bg-amber-50/60 cursor-pointer transition-colors flex items-start space-x-3 ${
                              !notif.isRead ? 'bg-amber-50/40 font-medium' : ''
                            }`}
                          >
                            <div className="mt-0.5">
                              <Sparkles className="w-4 h-4 text-[#B8860B]" />
                            </div>
                            <div className="flex-1 text-xs">
                              <div className="font-semibold text-stone-900">{notif.title}</div>
                              <div className="text-stone-600 mt-0.5 leading-relaxed">{notif.message}</div>
                              <div className="text-[10px] text-stone-400 mt-1">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                            {!notif.isRead && (
                              <span className="w-2 h-2 rounded-full bg-[#B8860B] mt-1"></span>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Admin Badge & Direct Entry */}
            {isAdmin && (
              <button
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-amber-950 font-bold text-xs shadow-md hover:from-amber-400 hover:to-amber-500 transition-all border border-amber-300"
              >
                <Crown className="w-4 h-4" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* User Profile or Login/Register Buttons */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdownOpen(!userDropdownOpen);
                    setNotifDropdownOpen(false);
                  }}
                  className="flex items-center space-x-2 p-1.5 rounded-lg bg-[#800D1E] hover:bg-[#8A1022] border border-[#D4AF37]/40 transition-colors"
                >
                  <img
                    src={currentProfile?.photoUrl || currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-[#D4AF37]"
                  />
                  <span className="hidden md:inline text-xs font-semibold text-[#F3E5AB] max-w-[100px] truncate">
                    {currentProfile?.fullName || currentUser.displayName || 'Member'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#D4AF37]" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-stone-200 text-stone-800 z-50 overflow-hidden divide-y divide-stone-100">
                    <div className="p-3 bg-stone-50">
                      <p className="text-xs text-stone-500">Signed in as</p>
                      <p className="text-sm font-bold text-[#680916] truncate">
                        {currentProfile?.fullName || currentUser.displayName || currentUser.email}
                      </p>
                      {currentProfile?.id && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-mono text-[10px] font-bold">
                          ID: {currentProfile.id}
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onNavigate('my-profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-amber-50 flex items-center space-x-2"
                      >
                        <UserIcon className="w-4 h-4 text-[#8A1022]" />
                        <span>My Matrimonial Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenPreferences();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-amber-50 flex items-center space-x-2"
                      >
                        <SlidersHorizontal className="w-4 h-4 text-[#8A1022]" />
                        <span>Partner Preferences</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenShortlist();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-amber-50 flex items-center space-x-2"
                      >
                        <Heart className="w-4 h-4 text-[#8A1022]" />
                        <span>Shortlisted Profiles</span>
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => {
                            onOpenAdmin();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 flex items-center space-x-2"
                        >
                          <Crown className="w-4 h-4 text-amber-700" />
                          <span>Admin Control Center</span>
                        </button>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[#F3E5AB] hover:bg-[#800D1E] border border-[#D4AF37]/50 transition-colors"
                >
                  Member Login
                </button>
                <button
                  onClick={onOpenRegister}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[#ECC86A] via-[#D4AF37] to-[#B8860B] text-[#45030C] shadow-md hover:brightness-105 transition-all"
                >
                  Register Free
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#F3E5AB] hover:bg-[#800D1E] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#570712] border-t border-[#D4AF37]/30 px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-200 hover:bg-[#800D1E] hover:text-[#F3E5AB]"
          >
            Home
          </button>
          <button
            onClick={() => { onNavigate('brides'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-200 hover:bg-[#800D1E] hover:text-[#F3E5AB]"
          >
            Bride Profiles (వధువులు)
          </button>
          <button
            onClick={() => { onNavigate('grooms'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-200 hover:bg-[#800D1E] hover:text-[#F3E5AB]"
          >
            Groom Profiles (వరులు)
          </button>
          <button
            onClick={() => { onNavigate('search'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-200 hover:bg-[#800D1E] hover:text-[#F3E5AB]"
          >
            Advanced Search
          </button>
          <button
            onClick={() => { onOpenConsultant(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-200 hover:bg-[#800D1E] hover:text-[#F3E5AB]"
          >
            Marriage Consultant Service
          </button>
          <button
            onClick={() => { onNavigate('interests'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-200 hover:bg-[#800D1E] hover:text-[#F3E5AB]"
          >
            Interests & Messages
          </button>
          {currentUser && (
            <button
              onClick={() => { onNavigate('my-profile'); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-stone-200 hover:bg-[#800D1E] hover:text-[#F3E5AB]"
            >
              My Matrimonial Profile
            </button>
          )}
          <button
            onClick={() => { onOpenShare(); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-[#ECC86A] bg-[#680916] hover:bg-[#800D1E] flex items-center space-x-2 border border-[#D4AF37]/30"
          >
            <Share2 className="w-4 h-4 text-[#ECC86A]" />
            <span>Share Website Link</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-amber-950 bg-amber-400 hover:bg-amber-300"
            >
              Admin Control Center
            </button>
          )}

          {!currentUser && (
            <div className="pt-4 border-t border-[#800D1E] flex flex-col space-y-2">
              <button
                onClick={() => { onOpenLogin(); setMobileMenuOpen(false); }}
                className="w-full py-2 rounded-lg text-center font-semibold text-sm text-[#F3E5AB] border border-[#D4AF37]/50"
              >
                Member Login
              </button>
              <button
                onClick={() => { onOpenRegister(); setMobileMenuOpen(false); }}
                className="w-full py-2 rounded-lg text-center font-bold text-sm bg-gradient-to-r from-[#ECC86A] to-[#D4AF37] text-[#45030C]"
              >
                Register Free
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
