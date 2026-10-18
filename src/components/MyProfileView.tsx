import React, { useState } from 'react';
import { 
  User, 
  Edit3, 
  Check, 
  Camera, 
  ShieldCheck, 
  Lock, 
  Save, 
  Phone, 
  Mail, 
  Flame, 
  MapPin, 
  GraduationCap, 
  Briefcase,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { MatrimonialProfile, PrivateContact } from '../types/matrimony';
import { calculateAge, formatDateOfBirth, formatFullDob } from '../utils/dateUtils';

interface MyProfileViewProps {
  onOpenPreferences: () => void;
  onOpenRegister: () => void;
}

export const MyProfileView: React.FC<MyProfileViewProps> = ({
  onOpenPreferences,
  onOpenRegister
}) => {
  const { currentProfile, privateContact, saveCurrentProfile, currentUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states initialized from current profile
  const [fullName, setFullName] = useState(currentProfile?.fullName || '');
  const [photoUrl, setPhotoUrl] = useState(currentProfile?.photoUrl || '');
  const [dateOfBirth, setDateOfBirth] = useState(currentProfile?.dateOfBirth || '2000-01-01');
  const [timeOfBirth, setTimeOfBirth] = useState(currentProfile?.timeOfBirth || '');
  const [placeOfBirth, setPlaceOfBirth] = useState(currentProfile?.placeOfBirth || '');
  const [age, setAge] = useState(currentProfile?.age || 26);
  const [height, setHeight] = useState(currentProfile?.height || "5'8\" (172 cm)");

  const handleDobChange = (newDob: string) => {
    setDateOfBirth(newDob);
    const calculated = calculateAge(newDob);
    setAge(calculated);
  };
  const [surname, setSurname] = useState(currentProfile?.surname || '');
  const [gotra, setGotra] = useState(currentProfile?.gotra || 'Kashyapa');
  const [subCommunity, setSubCommunity] = useState(currentProfile?.subCommunity || 'Vadiyaraju Kshatriya');
  const [nativePlace, setNativePlace] = useState(currentProfile?.nativePlace || '');
  const [currentCity, setCurrentCity] = useState(currentProfile?.currentCity || '');
  const [state, setState] = useState(currentProfile?.state || 'Andhra Pradesh');
  const [education, setEducation] = useState(currentProfile?.education || '');
  const [occupation, setOccupation] = useState(currentProfile?.occupation || '');
  const [annualIncome, setAnnualIncome] = useState(currentProfile?.annualIncome || '');
  const [fatherName, setFatherName] = useState(currentProfile?.fatherName || '');
  const [motherName, setMotherName] = useState(currentProfile?.motherName || '');
  const [familyDetails, setFamilyDetails] = useState(currentProfile?.familyDetails || '');
  const [profileDescription, setProfileDescription] = useState(currentProfile?.profileDescription || '');
  const [contactNumber, setContactNumber] = useState(privateContact?.contactNumber || '');

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto my-16 text-center p-8 bg-white rounded-3xl border border-stone-200 shadow-xl space-y-4">
        <User className="w-12 h-12 text-[#680916] mx-auto" />
        <h2 className="font-heading text-xl font-bold text-stone-900">
          Sign In to Access Your Matrimonial Profile
        </h2>
        <p className="text-xs text-stone-600">
          Create or edit your profile, upload your photograph, and manage confidential family contact details.
        </p>
        <button
          onClick={onOpenRegister}
          className="px-6 py-2.5 bg-[#680916] text-[#F3E5AB] font-bold text-xs rounded-xl hover:bg-[#800D1E] shadow-md"
        >
          Create Matrimonial Profile
        </button>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="max-w-2xl mx-auto my-16 text-center p-8 bg-white rounded-3xl border border-amber-300 shadow-xl space-y-4">
        <ShieldCheck className="w-12 h-12 text-[#D4AF37] mx-auto" />
        <h2 className="font-heading text-xl font-bold text-stone-900">
          Complete Your Matrimonial Profile
        </h2>
        <p className="text-xs text-stone-600">
          You are signed in as <strong className="text-stone-900">{currentUser.email}</strong>, but have not yet registered your complete Suryavamsha matrimonial profile details.
        </p>
        <button
          onClick={onOpenRegister}
          className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold text-xs rounded-xl shadow-md hover:brightness-105"
        >
          Register Matrimonial Profile Now
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveCurrentProfile(
        {
          fullName,
          photoUrl: photoUrl.trim() || currentProfile.photoUrl,
          age: Number(age),
          dateOfBirth,
          timeOfBirth,
          placeOfBirth,
          height,
          surname,
          gotra,
          subCommunity,
          nativePlace,
          currentCity,
          state,
          education,
          occupation,
          annualIncome,
          fatherName,
          motherName,
          familyDetails,
          profileDescription
        },
        {
          contactNumber
        }
      );
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert('Could not update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="font-heading text-2xl font-bold text-stone-900 flex items-center space-x-2">
            <User className="w-6 h-6 text-[#8A1022]" />
            <span>My Matrimonial Profile</span>
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Review and manage your public profile, lineage details, and private contact phone.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#680916] text-[#F3E5AB] font-bold text-xs rounded-xl hover:bg-[#800D1E] shadow-sm flex items-center space-x-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold text-xs rounded-xl hover:bg-stone-200"
            >
              Cancel Edit
            </button>
          )}

          <button
            onClick={onOpenPreferences}
            className="px-4 py-2 bg-white border border-stone-300 text-stone-700 font-semibold text-xs rounded-xl hover:bg-stone-50"
          >
            Partner Preferences
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-emerald-900 flex items-center space-x-2 text-xs font-semibold shadow-xs">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Your matrimonial profile has been updated and saved successfully!</span>
        </div>
      )}

      {/* Main Profile Card or Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-3xl p-6 sm:p-8 card-gold-border shadow-xl space-y-6">
          <h3 className="font-heading font-bold text-base text-[#680916]">
            Update Profile Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-700 block mb-1">Profile Photo URL</label>
              <input
                type="url"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://..."
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            {/* Date of Birth and Age */}
            <div className="sm:col-span-2 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="font-bold text-stone-800 flex items-center space-x-1.5">
                  <Calendar className="w-4 h-4 text-[#8A1022]" />
                  <span>Date of Birth (పుట్టిన తేదీ) & Age</span>
                </label>
                {dateOfBirth && (
                  <span className="text-[11px] font-semibold text-[#8A1022] bg-white px-2 py-0.5 rounded-md border border-amber-300">
                    {formatFullDob(dateOfBirth)} • Calculated: <strong>{age} Years</strong>
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Date of Birth</label>
                  <input
                    type="date"
                    required
                    max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                    value={dateOfBirth}
                    onChange={(e) => handleDobChange(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Age in Years</label>
                  <input
                    type="number"
                    min="18"
                    max="70"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl font-bold text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/50">
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Time of Birth (Horoscope)</label>
                  <input
                    type="time"
                    value={timeOfBirth}
                    onChange={(e) => setTimeOfBirth(e.target.value)}
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-stone-600 block mb-1">Place of Birth (Janma Sthalam)</label>
                  <input
                    type="text"
                    value={placeOfBirth}
                    onChange={(e) => setPlaceOfBirth(e.target.value)}
                    placeholder="e.g. Bhimavaram / Hyderabad"
                    className="w-full p-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Height</label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Surname</label>
              <input
                type="text"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Gotra</label>
              <input
                type="text"
                value={gotra}
                onChange={(e) => setGotra(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Native Place</label>
              <input
                type="text"
                value={nativePlace}
                onChange={(e) => setNativePlace(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Current City</label>
              <input
                type="text"
                value={currentCity}
                onChange={(e) => setCurrentCity(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Education</label>
              <input
                type="text"
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Occupation</label>
              <input
                type="text"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">Annual Income</label>
              <input
                type="text"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value)}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-700 block mb-1">
                Private Contact Phone Number
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 ..."
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-700 block mb-1">Family Details</label>
              <textarea
                value={familyDetails}
                onChange={(e) => setFamilyDetails(e.target.value)}
                rows={2}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-stone-700 block mb-1">About Candidate & Values</label>
              <textarea
                value={profileDescription}
                onChange={(e) => setProfileDescription(e.target.value)}
                rows={3}
                className="w-full p-2.5 border border-stone-300 rounded-xl"
              />
            </div>

          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:text-stone-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#680916] text-[#F3E5AB] hover:bg-[#800D1E] shadow-md flex items-center space-x-1"
            >
              <Save className="w-4 h-4 text-[#ECC86A]" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-gold-border shadow-xl space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-stone-200">
            <div className="w-32 h-40 rounded-2xl overflow-hidden ring-4 ring-[#D4AF37] shadow-lg shrink-0">
              <img
                src={currentProfile.photoUrl}
                alt={currentProfile.fullName}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h2 className="font-heading text-2xl font-bold text-stone-900">
                  {currentProfile.fullName}
                </h2>
                <span className="text-xs font-mono font-bold bg-amber-50 text-[#8A1022] px-3 py-1 rounded-full border border-amber-200">
                  ID: {currentProfile.id}
                </span>
              </div>

              <p className="text-xs text-stone-600">
                {currentProfile.age} Yrs • {currentProfile.height} • Gotra: <strong>{currentProfile.gotra}</strong>
              </p>
              {currentProfile.dateOfBirth && (
                <p className="text-xs text-stone-700 font-medium">
                  Date of Birth: <strong className="text-[#680916]">{formatFullDob(currentProfile.dateOfBirth)}</strong>
                  {currentProfile.timeOfBirth && ` at ${currentProfile.timeOfBirth}`}
                </p>
              )}

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1 text-xs">
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-800 rounded-md font-semibold border border-emerald-200">
                  Status: {currentProfile.approvalStatus}
                </span>
                <span className="px-2.5 py-0.5 bg-amber-50 text-amber-900 rounded-md font-semibold border border-amber-200">
                  {currentProfile.maritalStatus}
                </span>
                <span className="px-2.5 py-0.5 bg-stone-100 text-stone-700 rounded-md">
                  {currentProfile.community}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-700">
            <div className="p-3.5 bg-stone-50 rounded-xl space-y-1">
              <span className="font-bold text-[#680916] flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Roots & Residence</span>
              </span>
              <p>Native: {currentProfile.nativePlace}</p>
              <p>Living in: {currentProfile.currentCity}, {currentProfile.state}</p>
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl space-y-1">
              <span className="font-bold text-[#680916] flex items-center space-x-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Education & Career</span>
              </span>
              <p>Qualification: {currentProfile.education}</p>
              <p>Profession: {currentProfile.occupation}</p>
              {currentProfile.annualIncome && <p>Income: {currentProfile.annualIncome}</p>}
            </div>

            <div className="p-3.5 bg-stone-50 rounded-xl space-y-1">
              <span className="font-bold text-[#680916] flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5" />
                <span>Lineage & Parents</span>
              </span>
              <p>Father: {currentProfile.fatherName}</p>
              <p>Mother: {currentProfile.motherName}</p>
              <p>Gotra: {currentProfile.gotra}</p>
            </div>

            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <span className="font-bold text-emerald-900 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                <span>Private Contact Details</span>
              </span>
              <p>Contact Phone: {privateContact?.contactNumber || 'Not set'}</p>
              <p>Registered Email: {currentUser.email}</p>
              <span className="text-[10px] text-emerald-700">Protected by ABAC Firestore Rules</span>
            </div>
          </div>

          {/* Description */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
              About Candidate
            </h4>
            <p className="text-xs text-stone-600 bg-amber-50/40 p-4 rounded-xl border border-amber-200/50 leading-relaxed italic">
              "{currentProfile.profileDescription}"
            </p>
          </div>

        </div>
      )}

    </div>
  );
};
