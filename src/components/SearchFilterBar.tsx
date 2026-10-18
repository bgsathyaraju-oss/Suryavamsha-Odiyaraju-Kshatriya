import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  GraduationCap,
  Flame,
  ArrowUpDown
} from 'lucide-react';
import { ProfileFilters } from '../types/matrimony';

interface SearchFilterBarProps {
  filters: ProfileFilters;
  onChangeFilters: (newFilters: ProfileFilters) => void;
  onReset: () => void;
  resultCount: number;
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  filters,
  onChangeFilters,
  onReset,
  resultCount
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateField = (field: keyof ProfileFilters, value: any) => {
    onChangeFilters({
      ...filters,
      [field]: value
    });
  };

  return (
    <div className="bg-white rounded-3xl p-5 card-gold-border shadow-md space-y-4">
      
      {/* Top Primary Filter Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Gender Tabs */}
        <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 self-start md:self-auto shrink-0">
          <button
            onClick={() => updateField('gender', 'all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filters.gender === 'all'
                ? 'bg-[#680916] text-[#F3E5AB] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Profiles
          </button>
          <button
            onClick={() => updateField('gender', 'bride')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filters.gender === 'bride'
                ? 'bg-[#680916] text-[#F3E5AB] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Brides (వధువులు)
          </button>
          <button
            onClick={() => updateField('gender', 'groom')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filters.gender === 'groom'
                ? 'bg-[#680916] text-[#F3E5AB] shadow-sm'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Grooms (వరులు)
          </button>
        </div>

        {/* Search by Surname / Name keyword */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-stone-400" />
          <input
            type="text"
            value={filters.surname || ''}
            onChange={(e) => updateField('surname', e.target.value)}
            placeholder="Search by Surname, Full Name, or Family..."
            className="w-full text-xs pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:ring-1 focus:ring-amber-500"
          />
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center space-x-2 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
          <select
            value={filters.sortBy}
            onChange={(e) => updateField('sortBy', e.target.value as any)}
            className="text-xs p-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-700"
          >
            <option value="recently_joined">Recently Joined</option>
            <option value="recently_updated">Recently Updated</option>
            <option value="age_asc">Age: Low to High</option>
            <option value="age_desc">Age: High to Low</option>
          </select>

          {/* Toggle Advanced Filters Button */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center space-x-1 ${
              showAdvanced 
                ? 'bg-amber-100 border-amber-300 text-amber-950' 
                : 'bg-stone-50 border-stone-300 text-stone-700 hover:bg-stone-100'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Advanced Filters Expandable Drawer */}
      {showAdvanced && (
        <div className="pt-4 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-in fade-in">
          
          {/* Age Bounds & Birth Year */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Age Range: {filters.ageMin || 18} - {filters.ageMax || 65} Yrs
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="18"
                max="65"
                value={filters.ageMin || ''}
                onChange={(e) => updateField('ageMin', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Min"
                className="w-1/2 p-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
              <span>to</span>
              <input
                type="number"
                min="18"
                max="70"
                value={filters.ageMax || ''}
                onChange={(e) => updateField('ageMax', e.target.value ? Number(e.target.value) : undefined)}
                placeholder="Max"
                className="w-1/2 p-2 bg-stone-50 border border-stone-300 rounded-xl"
              />
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">
              Born approx {new Date().getFullYear() - (filters.ageMax || 65)} - {new Date().getFullYear() - (filters.ageMin || 18)}
            </span>
          </div>

          {/* Native Place */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Native Place (స్వగ్రామం)
            </label>
            <input
              type="text"
              value={filters.nativePlace || ''}
              onChange={(e) => updateField('nativePlace', e.target.value)}
              placeholder="e.g. Bhimavaram, Rajahmundry"
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>

          {/* Current City */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Current City / Location
            </label>
            <input
              type="text"
              value={filters.currentCity || ''}
              onChange={(e) => updateField('currentCity', e.target.value)}
              placeholder="e.g. Hyderabad, Bengaluru, USA"
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>

          {/* Gotra */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Gotra (గోత్రం)
            </label>
            <input
              type="text"
              value={filters.gotra || ''}
              onChange={(e) => updateField('gotra', e.target.value)}
              placeholder="e.g. Kashyapa, Vasishtha"
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>

          {/* Education */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Education Qualification
            </label>
            <input
              type="text"
              value={filters.education || ''}
              onChange={(e) => updateField('education', e.target.value)}
              placeholder="e.g. B.Tech, MS, MBBS, CA"
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>

          {/* Occupation */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Occupation / Profession
            </label>
            <input
              type="text"
              value={filters.occupation || ''}
              onChange={(e) => updateField('occupation', e.target.value)}
              placeholder="e.g. Software, Doctor, Business"
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
            />
          </div>

          {/* Marital Status */}
          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Marital Status
            </label>
            <select
              value={filters.maritalStatus || 'All'}
              onChange={(e) => updateField('maritalStatus', e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-xl"
            >
              <option value="All">Any Status</option>
              <option value="Never Married">Never Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="Awaiting Divorce">Awaiting Divorce</option>
            </select>
          </div>

          {/* Reset button */}
          <div className="flex items-end">
            <button
              onClick={onReset}
              className="w-full py-2 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>

        </div>
      )}

      {/* Results Header Count */}
      <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
        <span>
          Showing <strong className="text-stone-900 font-bold">{resultCount}</strong> verified Suryavamsha Kshatriya profiles
        </span>
        <span className="text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
          Verified Kshatriya Registry
        </span>
      </div>

    </div>
  );
};
