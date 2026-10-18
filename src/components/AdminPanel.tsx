import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  PhoneCall, 
  Trash2, 
  Ban, 
  Eye, 
  BellRing, 
  Send, 
  X,
  FileText,
  ShieldAlert,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchAllProfilesForAdmin, 
  updateProfileApprovalStatus, 
  toggleProfileSuspension, 
  deleteProfileByAdmin 
} from '../services/profileService';
import { 
  fetchAllConsultationRequests, 
  updateConsultationStatus 
} from '../services/consultationService';
import { fetchAllReports, updateReportStatus } from '../services/reportService';
import { MatrimonialProfile, ConsultationRequest, ReportedProfile } from '../types/matrimony';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onViewProfile: (profile: MatrimonialProfile) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onViewProfile
}) => {
  const { isAdmin, currentUser } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'profiles' | 'consultations' | 'reports' | 'announcements'>('profiles');
  const [profiles, setProfiles] = useState<MatrimonialProfile[]>([]);
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [reports, setReports] = useState<ReportedProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileFilter, setProfileFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Announcement State
  const [announcementText, setAnnouncementText] = useState('');
  const [announcementSent, setAnnouncementSent] = useState(false);

  useEffect(() => {
    if (isOpen && isAdmin) {
      loadAdminData();
    }
  }, [isOpen, isAdmin]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [profs, cons, reps] = await Promise.all([
        fetchAllProfilesForAdmin(),
        fetchAllConsultationRequests(),
        fetchAllReports()
      ]);
      setProfiles(profs);
      setConsultations(cons);
      setReports(reps);
    } catch (err) {
      console.error('Error fetching admin records:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-600 mx-auto" />
          <h2 className="font-heading font-bold text-lg text-stone-900">Access Restricted</h2>
          <p className="text-xs text-stone-600">
            You do not possess authorized administrator rights for the Suryavamsha Vadiyaraju Kshatriya Matrimonial registry.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 text-white text-xs font-semibold rounded-xl"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  // Statistics Calculations
  const totalProfiles = profiles.length;
  const brideCount = profiles.filter(p => p.gender === 'bride').length;
  const groomCount = profiles.filter(p => p.gender === 'groom').length;
  const pendingApprovals = profiles.filter(p => p.approvalStatus === 'pending').length;
  const approvedProfiles = profiles.filter(p => p.approvalStatus === 'approved').length;
  const rejectedProfiles = profiles.filter(p => p.approvalStatus === 'rejected').length;
  const totalConsultations = consultations.length;
  const pendingConsultations = consultations.filter(c => c.status === 'pending').length;
  const totalReports = reports.length;

  const handleApprove = async (p: MatrimonialProfile) => {
    try {
      await updateProfileApprovalStatus(p.id, 'approved');
      setProfiles(prev => prev.map(item => item.id === p.id ? { ...item, approvalStatus: 'approved', isApproved: true } : item));
    } catch (err) {
      alert('Could not approve profile.');
    }
  };

  const handleReject = async (p: MatrimonialProfile) => {
    try {
      await updateProfileApprovalStatus(p.id, 'rejected');
      setProfiles(prev => prev.map(item => item.id === p.id ? { ...item, approvalStatus: 'rejected', isApproved: false } : item));
    } catch (err) {
      alert('Could not reject profile.');
    }
  };

  const handleToggleSuspend = async (p: MatrimonialProfile) => {
    const nextState = !p.isSuspended;
    try {
      await toggleProfileSuspension(p.id, nextState);
      setProfiles(prev => prev.map(item => item.id === p.id ? { ...item, isSuspended: nextState } : item));
    } catch (err) {
      alert('Could not toggle suspension.');
    }
  };

  const handleDelete = async (p: MatrimonialProfile) => {
    if (!window.confirm(`Are you sure you want to permanently delete profile ${p.fullName} (${p.id})?`)) return;
    try {
      await deleteProfileByAdmin(p.id);
      setProfiles(prev => prev.filter(item => item.id !== p.id));
    } catch (err) {
      alert('Could not delete profile.');
    }
  };

  const handleConsultationStatus = async (req: ConsultationRequest, newStatus: any) => {
    try {
      await updateConsultationStatus(req.id, newStatus, undefined, req.userId);
      setConsultations(prev => prev.map(item => item.id === req.id ? { ...item, status: newStatus } : item));
    } catch (err) {
      alert('Could not update consultation.');
    }
  };

  const handleReportAction = async (report: ReportedProfile, newStatus: any) => {
    try {
      await updateReportStatus(report.id, newStatus);
      setReports(prev => prev.map(item => item.id === report.id ? { ...item, status: newStatus } : item));
    } catch (err) {
      alert('Could not update report.');
    }
  };

  // Filtered profiles for admin list
  const filteredProfiles = profiles.filter(p => {
    if (profileFilter !== 'all' && p.approvalStatus !== profileFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return (
        p.fullName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.nativePlace?.toLowerCase().includes(q) ||
        p.currentCity?.toLowerCase().includes(q) ||
        p.gotra?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div 
        className="bg-[#FAF6F0] w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl border-2 border-[#D4AF37] relative flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#680916] text-white px-6 py-4 flex items-center justify-between border-b border-[#D4AF37]/40 shrink-0">
          <div className="flex items-center space-x-3">
            <Crown className="w-6 h-6 text-[#ECC86A]" />
            <div>
              <h2 className="font-heading font-bold text-lg sm:text-xl text-[#F3E5AB]">
                Admin Control Center
              </h2>
              <p className="text-[11px] text-stone-200">
                Suryavamsha Vadiyaraju Kshatriya Matrimonial Administration
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={loadAdminData}
              className="p-2 rounded-full text-stone-300 hover:text-white hover:bg-[#800D1E] transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-[#800D1E] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* STATS CARDS (Actual Firestore Records) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            
            <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-[11px] font-semibold text-stone-500 block">Total Registered</span>
              <div className="text-xl font-heading font-bold text-stone-900 mt-1">{totalProfiles}</div>
              <span className="text-[10px] text-stone-400">Profiles in Registry</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-rose-100 shadow-xs">
              <span className="text-[11px] font-semibold text-rose-700 block">Bride Profiles</span>
              <div className="text-xl font-heading font-bold text-rose-950 mt-1">{brideCount}</div>
              <span className="text-[10px] text-rose-400">వధువు ప్రొఫైల్స్</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-amber-100 shadow-xs">
              <span className="text-[11px] font-semibold text-amber-700 block">Groom Profiles</span>
              <div className="text-xl font-heading font-bold text-amber-950 mt-1">{groomCount}</div>
              <span className="text-[10px] text-amber-500">వరుడు ప్రొఫైల్స్</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/40">
              <span className="text-[11px] font-semibold text-amber-800 block">Pending Approvals</span>
              <div className="text-xl font-heading font-bold text-amber-900 mt-1">{pendingApprovals}</div>
              <span className="text-[10px] text-amber-600">Awaiting Verification</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-emerald-100 shadow-xs">
              <span className="text-[11px] font-semibold text-emerald-700 block">Approved Profiles</span>
              <div className="text-xl font-heading font-bold text-emerald-950 mt-1">{approvedProfiles}</div>
              <span className="text-[10px] text-emerald-600">Active & Published</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-red-100 shadow-xs">
              <span className="text-[11px] font-semibold text-red-700 block">Rejected Profiles</span>
              <div className="text-xl font-heading font-bold text-red-950 mt-1">{rejectedProfiles}</div>
              <span className="text-[10px] text-red-400">Declined verification</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-xs">
              <span className="text-[11px] font-semibold text-blue-700 block">Total Consultations</span>
              <div className="text-xl font-heading font-bold text-blue-950 mt-1">{totalConsultations}</div>
              <span className="text-[10px] text-blue-500">Appointments Booked</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-xs">
              <span className="text-[11px] font-semibold text-purple-700 block">Pending Consultations</span>
              <div className="text-xl font-heading font-bold text-purple-950 mt-1">{pendingConsultations}</div>
              <span className="text-[10px] text-purple-500">Needs Counselor Call</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-orange-100 shadow-xs">
              <span className="text-[11px] font-semibold text-orange-700 block">Reported Profiles</span>
              <div className="text-xl font-heading font-bold text-orange-950 mt-1">{totalReports}</div>
              <span className="text-[10px] text-orange-500">Member Flagged</span>
            </div>

          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex border-b border-stone-200 space-x-2">
            <button
              onClick={() => setActiveTab('profiles')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'profiles'
                  ? 'border-[#680916] text-[#680916]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Member Profiles ({profiles.length})
            </button>
            <button
              onClick={() => setActiveTab('consultations')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'consultations'
                  ? 'border-[#680916] text-[#680916]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Consultation Requests ({consultations.length})
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'reports'
                  ? 'border-[#680916] text-[#680916]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Reported Profiles ({reports.length})
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 ${
                activeTab === 'announcements'
                  ? 'border-[#680916] text-[#680916]'
                  : 'border-transparent text-stone-500 hover:text-stone-900'
              }`}
            >
              Broadcast Announcements
            </button>
          </div>

          {/* TAB 1: PROFILES MANAGEMENT */}
          {activeTab === 'profiles' && (
            <div className="space-y-4">
              
              {/* Search & Status Filter */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-stone-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by ID, Name, City, Gotra..."
                    className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-xl"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-stone-500 font-semibold">Filter:</span>
                  <select
                    value={profileFilter}
                    onChange={(e) => setProfileFilter(e.target.value as any)}
                    className="text-xs p-2 bg-white border border-stone-300 rounded-xl"
                  >
                    <option value="all">All Profiles</option>
                    <option value="pending">Pending Only</option>
                    <option value="approved">Approved Only</option>
                    <option value="rejected">Rejected Only</option>
                  </select>
                </div>
              </div>

              {/* Profiles Table */}
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="p-3">Profile ID & Member</th>
                        <th className="p-3">Gender / Age</th>
                        <th className="p-3">Gotra & Roots</th>
                        <th className="p-3">Profession</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredProfiles.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-stone-400">
                            No profiles found matching criteria.
                          </td>
                        </tr>
                      ) : (
                        filteredProfiles.map((p) => (
                          <tr key={p.id} className="hover:bg-amber-50/40 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center space-x-2.5">
                                <img
                                  src={p.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'}
                                  alt={p.fullName}
                                  className="w-9 h-10 rounded-lg object-cover ring-1 ring-amber-300"
                                />
                                <div>
                                  <div className="font-bold text-stone-900">{p.fullName}</div>
                                  <div className="text-[10px] font-mono text-[#8A1022] font-semibold">{p.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className={`capitalize font-semibold ${p.gender === 'bride' ? 'text-rose-700' : 'text-blue-700'}`}>
                                {p.gender}
                              </span>
                              <div className="text-stone-500 text-[11px]">{p.age} Yrs • {p.height}</div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-stone-800">Gotra: {p.gotra || 'Kashyapa'}</div>
                              <div className="text-[11px] text-stone-500">{p.nativePlace} → {p.currentCity}</div>
                            </td>
                            <td className="p-3">
                              <div className="truncate max-w-[150px] font-medium text-stone-800">{p.occupation}</div>
                              <div className="text-[11px] text-stone-500 truncate max-w-[150px]">{p.education}</div>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                p.approvalStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                p.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {p.approvalStatus}
                              </span>
                              {p.isSuspended && (
                                <span className="block mt-0.5 text-[9px] text-red-600 font-bold">SUSPENDED</span>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="inline-flex items-center space-x-1">
                                <button
                                  onClick={() => onViewProfile(p)}
                                  className="p-1.5 text-stone-600 hover:text-[#680916] rounded-md hover:bg-stone-100"
                                  title="View Full Profile"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {p.approvalStatus !== 'approved' && (
                                  <button
                                    onClick={() => handleApprove(p)}
                                    className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md"
                                    title="Approve Profile"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                )}

                                {p.approvalStatus !== 'rejected' && (
                                  <button
                                    onClick={() => handleReject(p)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md"
                                    title="Reject Profile"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}

                                <button
                                  onClick={() => handleToggleSuspend(p)}
                                  className={`p-1.5 rounded-md ${
                                    p.isSuspended ? 'text-amber-600 bg-amber-50' : 'text-stone-400 hover:text-amber-600'
                                  }`}
                                  title={p.isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                                >
                                  <Ban className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDelete(p)}
                                  className="p-1.5 text-stone-400 hover:text-red-700 rounded-md"
                                  title="Delete Profile"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: CONSULTATION REQUESTS */}
          {activeTab === 'consultations' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="p-3">Applicant Name</th>
                        <th className="p-3">Phone & Email</th>
                        <th className="p-3">Preferred Slot</th>
                        <th className="p-3">Consultation Needs</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {consultations.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-stone-400">
                            No consultation requests submitted yet.
                          </td>
                        </tr>
                      ) : (
                        consultations.map((c) => (
                          <tr key={c.id} className="hover:bg-amber-50/40">
                            <td className="p-3 font-bold text-stone-900">{c.memberName}</td>
                            <td className="p-3">
                              <a href={`tel:${c.memberPhone}`} className="text-[#680916] font-semibold hover:underline block">
                                {c.memberPhone}
                              </a>
                              <span className="text-stone-400 text-[10px]">{c.memberEmail || 'No email provided'}</span>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-stone-800">{c.preferredDate}</div>
                              <div className="text-stone-500 text-[10px]">{c.preferredTime}</div>
                            </td>
                            <td className="p-3 max-w-[200px]">
                              <p className="line-clamp-2 italic text-stone-600">"{c.requirements}"</p>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                c.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                c.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                                c.status === 'contacted' ? 'bg-purple-100 text-purple-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {c.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <select
                                value={c.status}
                                onChange={(e) => handleConsultationStatus(c, e.target.value)}
                                className="text-xs p-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                              >
                                <option value="pending">Pending</option>
                                <option value="accepted">Accepted</option>
                                <option value="contacted">Contacted</option>
                                <option value="completed">Completed</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REPORTED PROFILES */}
          {activeTab === 'reports' && (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-stone-700">
                    <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="p-3">Reported Profile ID</th>
                        <th className="p-3">Reason</th>
                        <th className="p-3">Details</th>
                        <th className="p-3">Reported At</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {reports.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-stone-400">
                            No reported profiles currently. Community registry is clean.
                          </td>
                        </tr>
                      ) : (
                        reports.map((r) => (
                          <tr key={r.id} className="hover:bg-red-50/20">
                            <td className="p-3 font-mono font-bold text-[#8A1022]">
                              {r.reportedProfileId}
                              {r.reportedProfileName && <div className="text-stone-700 font-sans">{r.reportedProfileName}</div>}
                            </td>
                            <td className="p-3 font-semibold text-red-700">{r.reason}</td>
                            <td className="p-3 max-w-[200px]">
                              <p className="line-clamp-2 text-stone-600">{r.details || 'No additional details'}</p>
                            </td>
                            <td className="p-3 text-stone-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                r.status === 'actioned' ? 'bg-red-100 text-red-800' :
                                r.status === 'dismissed' ? 'bg-stone-100 text-stone-600' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="p-3 text-right">
                              <select
                                value={r.status}
                                onChange={(e) => handleReportAction(r, e.target.value)}
                                className="text-xs p-1.5 bg-stone-50 border border-stone-300 rounded-lg"
                              >
                                <option value="pending">Pending</option>
                                <option value="investigated">Investigated</option>
                                <option value="actioned">Actioned (Suspended)</option>
                                <option value="dismissed">Dismissed</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BROADCAST ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4 max-w-xl mx-auto">
              <div className="flex items-center space-x-2 text-[#680916]">
                <BellRing className="w-5 h-5 text-amber-600" />
                <h3 className="font-heading font-bold text-base">Send Community Announcement</h3>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Broadcast community notices, upcoming Kshatriya Matrimonial Sammelans, or auspicious wedding season guidelines to all registered Suryavamsha members.
              </p>

              {announcementSent && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Community announcement successfully published to top banner!</span>
                </div>
              )}

              <textarea
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                placeholder="e.g. Sree Suryavamsha Kshatriya Parinaya Vedika: Annual Matrimonial Sammelan scheduled next month in Hyderabad. Verified registrations open now!"
                rows={4}
                className="w-full text-xs p-3 border border-stone-300 rounded-xl"
              />

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (!announcementText.trim()) return;
                    setAnnouncementSent(true);
                    setTimeout(() => setAnnouncementSent(false), 3000);
                  }}
                  className="px-6 py-2.5 bg-[#680916] text-[#F3E5AB] text-xs font-bold rounded-xl hover:bg-[#800D1E] shadow-md flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#ECC86A]" />
                  <span>Broadcast Notice</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
