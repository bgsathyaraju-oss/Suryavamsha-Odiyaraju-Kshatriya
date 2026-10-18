import React, { useState } from 'react';
import { 
  Home, 
  UserCheck, 
  Users, 
  Sparkles, 
  User, 
  MoreVertical, 
  SlidersHorizontal, 
  Heart, 
  PhoneCall, 
  Bell, 
  HelpCircle, 
  Shield, 
  FileText, 
  LogOut,
  X,
  Crown,
  Share2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface BottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenLogin: () => void;
  onOpenPreferences: () => void;
  onOpenShortlist: () => void;
  onOpenConsultant: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
  onOpenAdmin: () => void;
  onOpenShare: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onNavigate,
  onOpenLogin,
  onOpenPreferences,
  onOpenShortlist,
  onOpenConsultant,
  onOpenPrivacy,
  onOpenTerms,
  onOpenAdmin,
  onOpenShare
}) => {
  const { currentUser, isAdmin, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleMyProfileClick = () => {
    if (!currentUser) {
      onOpenLogin();
    } else {
      onNavigate('my-profile');
    }
  };

  const handleInterestsClick = () => {
    if (!currentUser) {
      onOpenLogin();
    } else {
      onNavigate('interests');
    }
  };

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#5E0713] border-t border-[#D4AF37]/40 shadow-2xl pb-safe">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          
          {/* 1. Home */}
          <button
            onClick={() => onNavigate('home')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              currentTab === 'home' ? 'text-[#ECC86A] scale-105' : 'text-stone-300 hover:text-[#ECC86A]'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          {/* 2. Bride Profiles */}
          <button
            onClick={() => onNavigate('brides')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              currentTab === 'brides' ? 'text-[#ECC86A] scale-105' : 'text-stone-300 hover:text-[#ECC86A]'
            }`}
          >
            <UserCheck className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Brides</span>
          </button>

          {/* 3. Groom Profiles */}
          <button
            onClick={() => onNavigate('grooms')}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              currentTab === 'grooms' ? 'text-[#ECC86A] scale-105' : 'text-stone-300 hover:text-[#ECC86A]'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Grooms</span>
          </button>

          {/* 4. Interests */}
          <button
            onClick={handleInterestsClick}
            className={`flex flex-col items-center justify-center py-1 transition-all ${
              currentTab === 'interests' ? 'text-[#ECC86A] scale-105' : 'text-stone-300 hover:text-[#ECC86A]'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Interests</span>
          </button>

          {/* 5. More / My Profile / Drawer */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-stone-300 hover:text-[#ECC86A] transition-all"
          >
            <MoreVertical className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] font-medium">Menu</span>
          </button>

        </div>
      </div>

      {/* Comprehensive Bottom Menu Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end">
          <div 
            className="bg-[#FAF6F0] rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 shadow-2xl border-t-2 border-[#D4AF37] animate-in slide-in-from-bottom"
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center space-x-2">
                <span className="font-heading font-bold text-lg text-[#680916]">Quick Menu</span>
              </div>
              <button 
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-1">
              <button
                onClick={() => {
                  handleMyProfileClick();
                  setDrawerOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-amber-100/60 text-stone-800 text-sm font-medium"
              >
                <User className="w-5 h-5 text-[#8A1022]" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => {
                  onOpenPreferences();
                  setDrawerOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-amber-100/60 text-stone-800 text-sm font-medium"
              >
                <SlidersHorizontal className="w-5 h-5 text-[#8A1022]" />
                <span>Search & Partner Preferences</span>
              </button>

              <button
                onClick={() => {
                  onOpenShortlist();
                  setDrawerOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-amber-100/60 text-stone-800 text-sm font-medium"
              >
                <Heart className="w-5 h-5 text-[#8A1022]" />
                <span>Shortlisted Profiles</span>
              </button>

              <button
                onClick={() => {
                  onOpenConsultant();
                  setDrawerOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-amber-100/60 text-stone-800 text-sm font-medium"
              >
                <PhoneCall className="w-5 h-5 text-[#8A1022]" />
                <span>Marriage Consultant Service</span>
              </button>

              <button
                onClick={() => {
                  onOpenShare();
                  setDrawerOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#680916] text-sm font-bold border border-amber-200"
              >
                <Share2 className="w-5 h-5 text-[#8A1022]" />
                <span>Share Website Link</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => {
                    onOpenAdmin();
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 text-sm font-bold"
                >
                  <Crown className="w-5 h-5 text-amber-700" />
                  <span>Admin Control Panel</span>
                </button>
              )}

              <div className="pt-2 border-t border-stone-200">
                <button
                  onClick={() => {
                    onOpenPrivacy();
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-stone-100 text-stone-600 text-xs"
                >
                  <Shield className="w-4 h-4 text-stone-400" />
                  <span>Privacy Policy & Contact Security</span>
                </button>

                <button
                  onClick={() => {
                    onOpenTerms();
                    setDrawerOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-stone-100 text-stone-600 text-xs"
                >
                  <FileText className="w-4 h-4 text-stone-400" />
                  <span>Terms and Conditions</span>
                </button>

                {currentUser ? (
                  <button
                    onClick={() => {
                      logout();
                      setDrawerOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 text-xs font-semibold mt-1"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onOpenLogin();
                      setDrawerOpen(false);
                    }}
                    className="w-full flex items-center justify-center py-2.5 rounded-xl bg-[#680916] text-[#F3E5AB] font-semibold text-xs mt-2"
                  >
                    Member Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
