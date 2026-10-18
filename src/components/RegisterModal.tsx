import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Upload, 
  ShieldCheck, 
  Lock, 
  Phone, 
  Mail, 
  User, 
  HeartHandshake,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Gender, MaritalStatus } from '../types/matrimony';
import { calculateAge, formatFullDob } from '../utils/dateUtils';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin
}) => {
  const { registerWithEmail, saveCurrentProfile } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // 24 Fields
  const [fullName, setFullName] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [age, setAge] = useState(25);
  const [dateOfBirth, setDateOfBirth] = useState('2001-01-01');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [gender, setGender] = useState<Gender>('bride');
  const [surname, setSurname] = useState('Vadiyaraju');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('Never Married');
  
  // Community default
  const [community, setCommunity] = useState('Suryavamsha Vadiyaraju Kshatriya');
  const [subCommunity, setSubCommunity] = useState('Vadiyaraju Kshatriya');
  const [gotra, setGotra] = useState('Kashyapa');
  const [nativePlace, setNativePlace] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [state, setState] = useState('Andhra Pradesh');
  const [country, setCountry] = useState('India');
  
  // Education & Career
  const [education, setEducation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [height, setHeight] = useState("5'6\" (168 cm)");
  const [languagesKnown, setLanguagesKnown] = useState<string[]>(['Telugu', 'English']);
  const [newLang, setNewLang] = useState('');

  // Contact & Security
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [familyDetails, setFamilyDetails] = useState('');
  const [profileDescription, setProfileDescription] = useState('');

  if (!isOpen) return null;

  const handleAddLanguage = () => {
    if (newLang.trim() && !languagesKnown.includes(newLang.trim())) {
      setLanguagesKnown([...languagesKnown, newLang.trim()]);
      setNewLang('');
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setLanguagesKnown(languagesKnown.filter(l => l !== lang));
  };

  const handleDobChange = (newDob: string) => {
    setDateOfBirth(newDob);
    const computed = calculateAge(newDob);
    setAge(computed);
  };

  const validateStep1 = () => {
    if (!fullName.trim()) return 'Please enter Full Name';
    if (!surname.trim()) return 'Please enter Surname';
    if (!fatherName.trim()) return "Please enter Father's Name";
    if (!motherName.trim()) return "Please enter Mother's Name";
    if (!dateOfBirth) return 'Please select Date of Birth';
    return '';
  };

  const validateStep2 = () => {
    if (!nativePlace.trim()) return 'Please enter Native Place';
    if (!currentCity.trim()) return 'Please enter Current City';
    if (!gotra.trim()) return 'Please enter Gotra';
    return '';
  };

  const validateStep3 = () => {
    if (!education.trim()) return 'Please enter Education qualification';
    if (!occupation.trim()) return 'Please enter Occupation / Profession';
    return '';
  };

  const validateStep4 = () => {
    if (!contactNumber.trim() || contactNumber.length < 10) {
      return 'Please enter a valid 10-digit Contact Number';
    }
    const finalEmail = email.trim() || `member_${contactNumber.replace(/\D/g, '')}@suryavamshamatrimony.internal`;
    if (!password || password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handleNext = () => {
    setErrorMsg('');
    if (step === 1) {
      const err = validateStep1();
      if (err) { setErrorMsg(err); return; }
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setErrorMsg(err); return; }
    } else if (step === 3) {
      const err = validateStep3();
      if (err) { setErrorMsg(err); return; }
    }
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const err = validateStep4();
    if (err) { setErrorMsg(err); return; }

    setLoading(true);
    try {
      const authEmail = email.trim() || `${contactNumber.replace(/\D/g, '')}@suryavamsha.org`;
      
      // 1. Create auth user with Firebase Authentication
      await registerWithEmail(authEmail, password, fullName);

      // 2. Persist full profile and isolated private contact
      await saveCurrentProfile(
        {
          fullName,
          photoUrl: photoUrl.trim() || (gender === 'bride' 
            ? 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=800' 
            : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'),
          gender,
          age: Number(age),
          dateOfBirth,
          timeOfBirth,
          placeOfBirth,
          surname,
          fatherName,
          motherName,
          maritalStatus,
          community: 'Suryavamsha Vadiyaraju Kshatriya',
          subCommunity,
          gotra,
          nativePlace,
          currentCity,
          state,
          country,
          education,
          occupation,
          annualIncome,
          height,
          languagesKnown,
          familyDetails: familyDetails || 'Respected Suryavamsha Vadiyaraju Kshatriya family.',
          profileDescription: profileDescription || `Dedicated to personal and community growth. Looking for an understanding life partner from the Suryavamsha Vadiyaraju Kshatriya community.`
        },
        {
          contactNumber,
          email: authEmail
        }
      );

      onClose();
    } catch (err: any) {
      console.error('Registration failed:', err);
      if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email or mobile already exists. Please log in.');
      } else {
        setErrorMsg(err.message || 'Registration failed. Please check details and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        className="bg-[#FAF6F0] w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#680916] text-white px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center space-x-2">
            <Crown className="w-5 h-5 text-[#ECC86A]" />
            <div>
              <h2 className="font-heading font-bold text-lg text-[#F3E5AB]">
                Member Registration
              </h2>
              <p className="text-[11px] text-stone-200">
                Suryavamsha Vadiyaraju Kshatriya Matrimonial Registry
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

        {/* Wizard Step Progress */}
        <div className="bg-[#570712] px-6 py-2.5 flex items-center justify-between text-xs text-[#F3E5AB] font-semibold border-b border-[#D4AF37]/30">
          <span className={step >= 1 ? 'text-[#ECC86A]' : 'text-stone-400'}>1. Identity</span>
          <span>→</span>
          <span className={step >= 2 ? 'text-[#ECC86A]' : 'text-stone-400'}>2. Lineage & Roots</span>
          <span>→</span>
          <span className={step >= 3 ? 'text-[#ECC86A]' : 'text-stone-400'}>3. Career & Lifestyle</span>
          <span>→</span>
          <span className={step >= 4 ? 'text-[#ECC86A]' : 'text-stone-400'}>4. Contact & Security</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: IDENTITY & BASIC PROFILE */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 1. Full Name */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    1. Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sai Varma Vadiyaraju"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 4. Gender */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    4. Gender *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('bride')}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        gender === 'bride' 
                          ? 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-300' 
                          : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      Bride (వధువు)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('groom')}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        gender === 'groom' 
                          ? 'bg-amber-50 border-amber-400 text-amber-950 ring-2 ring-amber-300' 
                          : 'bg-white border-stone-200 text-stone-600'
                      }`}
                    >
                      Groom (వరుడు)
                    </button>
                  </div>
                </div>

                {/* 5. Surname */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    5. Surname (ఇంటి పేరు) *
                  </label>
                  <input
                    type="text"
                    required
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="e.g. Vadiyaraju / Alluri / Poosapati"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 3. Date of Birth & Age */}
                <div className="sm:col-span-2 bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <label className="text-xs font-bold text-stone-800 flex items-center space-x-1.5">
                      <Calendar className="w-4 h-4 text-[#8A1022]" />
                      <span>3. Date of Birth (పుట్టిన తేదీ) & Age *</span>
                    </label>
                    {dateOfBirth && (
                      <span className="text-[11px] font-semibold text-[#8A1022] bg-white px-2.5 py-1 rounded-lg border border-amber-300 shadow-xs">
                        {formatFullDob(dateOfBirth)} • Calculated Age: <strong className="text-stone-900">{age} Yrs</strong>
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Select Date of Birth *
                      </label>
                      <input
                        type="date"
                        required
                        max={new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        min="1950-01-01"
                        value={dateOfBirth}
                        onChange={(e) => handleDobChange(e.target.value)}
                        className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500 font-medium"
                      />
                      <span className="text-[10px] text-stone-500 mt-1 block">
                        Age is automatically calculated from the chosen birth date.
                      </span>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Age (Years) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="18"
                          max="75"
                          required
                          value={age}
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500 font-bold text-stone-800"
                        />
                        <span className="absolute right-3 top-2.5 text-xs text-stone-400 font-semibold pointer-events-none">
                          Yrs
                        </span>
                      </div>
                      <span className="text-[10px] text-stone-500 mt-1 block">Auto-verified</span>
                    </div>
                  </div>

                  {/* Optional Time and Place of Birth for Horoscope / Kundali Matching */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                        Time of Birth (Optional - for Horoscope)
                      </label>
                      <input
                        type="time"
                        value={timeOfBirth}
                        onChange={(e) => setTimeOfBirth(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                        Place of Birth (Janma Sthalam - Optional)
                      </label>
                      <input
                        type="text"
                        value={placeOfBirth}
                        onChange={(e) => setPlaceOfBirth(e.target.value)}
                        placeholder="e.g. Bhimavaram / Rajahmundry"
                        className="w-full text-xs p-2 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Father's Name */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    6. Father's Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="e.g. Ramachandra Raju"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 7. Mother's Name */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    7. Mother's Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                    placeholder="e.g. Annapurna Devi"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 8. Marital Status */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    8. Marital Status *
                  </label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value as MaritalStatus)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  >
                    <option>Never Married</option>
                    <option>Divorced</option>
                    <option>Widowed</option>
                    <option>Awaiting Divorce</option>
                  </select>
                </div>

                {/* 2. Profile Photo URL */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    2. Profile Photo URL
                  </label>
                  <input
                    type="url"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="https://... (or leave blank for royal placeholder)"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 2: COMMUNITY & LINEAGE */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-amber-50/70 p-3.5 rounded-xl border border-amber-300 text-xs text-amber-950">
                <span className="font-bold flex items-center space-x-1 mb-1">
                  <ShieldCheck className="w-4 h-4 text-amber-700" />
                  <span>Suryavamsha Community Heritage Confirmation</span>
                </span>
                Our matrimonial portal is exclusively consecrated for the royal Suryavamsha Kshatriya lineages.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 9. Community */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    9. Community (Defaulted & Confirmed) *
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={community}
                    className="w-full text-xs p-2.5 bg-amber-100/60 border border-amber-300 rounded-xl font-bold text-[#680916]"
                  />
                </div>

                {/* 10. Sub-community / Vamsha */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    10. Sub-community / Vamsha
                  </label>
                  <input
                    type="text"
                    value={subCommunity}
                    onChange={(e) => setSubCommunity(e.target.value)}
                    placeholder="e.g. Vadiyaraju Kshatriya / Solar Dynasty"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 11. Gotra */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    11. Gotra (గోత్రం) *
                  </label>
                  <input
                    type="text"
                    required
                    value={gotra}
                    onChange={(e) => setGotra(e.target.value)}
                    placeholder="e.g. Kashyapa / Vasishtha / Bharadwaja"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 12. Native Place */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    12. Native Place (స్వగ్రామం) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nativePlace}
                    onChange={(e) => setNativePlace(e.target.value)}
                    placeholder="e.g. Bhimavaram / Rajahmundry / Tanuku"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 13. Current City */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    13. Current City *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentCity}
                    onChange={(e) => setCurrentCity(e.target.value)}
                    placeholder="e.g. Hyderabad / Bengaluru / Visakhapatnam"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 14. State */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    14. State *
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Andhra Pradesh / Telangana"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 15. Country */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    15. Country *
                  </label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="India / USA"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: EDUCATION, OCCUPATION & ATTRIBUTES */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 16. Education */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    16. Education (Highest Qualification) *
                  </label>
                  <input
                    type="text"
                    required
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    placeholder="e.g. B.Tech (CSE) & MS / MBBS / MBA"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 17. Occupation */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    17. Occupation & Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Senior Software Engineer at Google / Doctor"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 18. Annual Income */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    18. Annual Income (Optional)
                  </label>
                  <input
                    type="text"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    placeholder="e.g. ₹ 25 - 30 Lakhs"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 19. Height */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    19. Height *
                  </label>
                  <input
                    type="text"
                    required
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 5'8&quot; (172 cm)"
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* 20. Languages Known */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    20. Languages Known
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {languagesKnown.map((lang) => (
                      <span key={lang} className="px-2.5 py-1 bg-amber-100 text-amber-950 text-xs rounded-lg flex items-center space-x-1">
                        <span>{lang}</span>
                        <button type="button" onClick={() => handleRemoveLanguage(lang)} className="hover:text-red-700">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newLang}
                      onChange={(e) => setNewLang(e.target.value)}
                      placeholder="Add language (e.g. Hindi, Kannada, Tamil)"
                      className="flex-1 text-xs p-2 bg-white border border-stone-300 rounded-lg focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      className="px-3 py-1 bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold hover:bg-stone-300"
                    >
                      Add
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* STEP 4: CONTACT, PRIVACY & SECURITY */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-900 flex items-start space-x-2">
                <Lock className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-semibold">Strict Contact Privacy Enforced</strong>
                  Your phone number will NOT be published publicly. Only members you grant permission to can view it.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 21. Contact Number */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    21. Contact Number (Private & Confidential) *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="tel"
                      required
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      placeholder="+91 98490 12345"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* 22. Email Address */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    22. Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* 23. Password */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    23. Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* 24. Confirm Password */}
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    24. Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-type password"
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Family Details */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Family Background & Lineage Details
                  </label>
                  <textarea
                    value={familyDetails}
                    onChange={(e) => setFamilyDetails(e.target.value)}
                    placeholder="Briefly describe family roots, siblings, parents' occupation..."
                    rows={2}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                {/* Profile Description */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    About Candidate & Partner Expectations
                  </label>
                  <textarea
                    value={profileDescription}
                    onChange={(e) => setProfileDescription(e.target.value)}
                    placeholder="Describe personality, values, hobbies, and desired partner attributes..."
                    rows={2}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
                  />
                </div>

              </div>
            </div>
          )}

          {/* Action Navigation Footer */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 flex items-center space-x-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#680916] text-[#F3E5AB] hover:bg-[#800D1E] shadow-md flex items-center space-x-1"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-stone-950 hover:brightness-105 shadow-lg flex items-center space-x-1.5 disabled:opacity-50"
              >
                {loading ? (
                  <span>Registering Account...</span>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Complete Kshatriya Registration</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-stone-500">Already have an account? </span>
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs font-bold text-[#680916] hover:underline"
            >
              Sign In Here
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
