export type Gender = 'bride' | 'groom';

export type MaritalStatus = 
  | 'Never Married' 
  | 'Divorced' 
  | 'Widowed' 
  | 'Awaiting Divorce';

export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface PartnerPreferences {
  ageMin?: number;
  ageMax?: number;
  heightMin?: string;
  maritalStatus?: string[];
  education?: string[];
  occupation?: string[];
  nativePlace?: string;
  currentCity?: string;
  gotra?: string;
  otherNotes?: string;
}

export interface MatrimonialProfile {
  id: string; // Document ID (e.g. SVK-1029)
  userId: string;
  fullName: string;
  gender: Gender;
  age: number;
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  surname: string;
  fatherName: string;
  motherName: string;
  maritalStatus: MaritalStatus;
  community: string; // 'Suryavamsha Vadiyaraju Kshatriya'
  subCommunity?: string;
  gotra?: string;
  nativePlace: string;
  currentCity: string;
  state: string;
  country: string;
  education: string;
  occupation: string;
  annualIncome?: string;
  height: string;
  languagesKnown: string[];
  photoUrl: string;
  additionalPhotos?: string[];
  familyDetails: string;
  partnerPreferences?: PartnerPreferences;
  profileDescription: string;
  approvalStatus: ApprovalStatus;
  isApproved: boolean;
  isPublished: boolean;
  isSuspended?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrivateContact {
  userId: string;
  profileId: string;
  contactNumber: string;
  email?: string;
  alternateNumber?: string;
  address?: string;
  allowVerifiedMembers?: boolean;
  updatedAt: string;
}

export type InterestStatus = 'pending' | 'accepted' | 'declined' | 'withdrawn';

export interface Interest {
  id: string;
  senderId: string;
  senderProfileId: string;
  senderName: string;
  senderPhotoUrl: string;
  recipientId: string;
  recipientProfileId: string;
  status: InterestStatus;
  message?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShortlistedProfile {
  id: string;
  userId: string;
  profileId: string;
  profileName: string;
  profileGender: Gender;
  profilePhotoUrl: string;
  profileCity: string;
  profileAge: number;
  profileGotra?: string;
  profileEducation?: string;
  profileOccupation?: string;
  createdAt: string;
}

export type ConsultationStatus = 'pending' | 'accepted' | 'contacted' | 'completed';

export interface ConsultationRequest {
  id: string;
  userId: string;
  memberName: string;
  memberPhone: string;
  memberEmail?: string;
  preferredDate: string;
  preferredTime: string;
  requirements: string;
  status: ConsultationStatus;
  notes?: string;
  consultantName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Consultant {
  id: string;
  name: string;
  title: string;
  experience: string;
  photoUrl: string;
  phone: string;
  whatsapp: string;
  bio: string;
  specialties: string[];
  availableTimings: string;
}

export type NotificationType = 
  | 'interest_received' 
  | 'interest_accepted' 
  | 'interest_declined' 
  | 'profile_approved' 
  | 'profile_rejected' 
  | 'consultation_update' 
  | 'match_alert';

export interface AppNotification {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedProfileId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ReportedProfile {
  id: string;
  reporterId: string;
  reportedProfileId: string;
  reportedProfileName?: string;
  reason: string;
  details: string;
  status: 'pending' | 'investigated' | 'dismissed' | 'actioned';
  createdAt: string;
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  role: 'member' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface ProfileFilters {
  gender: 'all' | 'bride' | 'groom';
  ageMin?: number;
  ageMax?: number;
  surname?: string;
  nativePlace?: string;
  currentCity?: string;
  state?: string;
  education?: string;
  occupation?: string;
  maritalStatus?: string;
  gotra?: string;
  heightMin?: string;
  sortBy: 'recently_joined' | 'age_asc' | 'age_desc' | 'recently_updated';
}
