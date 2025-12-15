// ============================================================================
// User Types (User.ts schema)
// ============================================================================

export type UserStatus = 'active' | 'inactive' | 'suspended';
export type Gender = 'male' | 'female' | 'other';
export type EmployeeType = 'full_time' | 'part_time' | 'contract' | 'intern';

export interface Allowance {
  type: string;
  amount: number;
  isPercentage: boolean;
}

export interface Deduction {
  type: string;
  amount: number;
  isPercentage: boolean;
}

export interface SalaryStructure {
  basicSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  bankName: string;
  ifscCode: string;
  branchName: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  lastLogin?: Date;
  lastPasswordChange: Date;
  organization: string;
  organizationCode: string;
  role: number;
  status: UserStatus;
  employeeCode?: string;
  gender?: Gender;
  dob?: Date;
  department?: string;
  designation?: string;
  joiningDate?: Date;
  employeeType?: EmployeeType;
  reportingManager?: string;
  salaryStructure?: SalaryStructure;
  bankDetails?: BankDetails;
  documents?: string[];
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Role & Permission Types
// ============================================================================

export type DataAccessLevel = 1 | 2 | 3; // 1=ALL, 2=TEAM, 3=OWN

export interface Permission {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  module: 'users' | 'employees' | 'attendance' | 'leave' | 'payroll' | 'documents' | 'settings' | 'reports' | 'dashboard' | 'system';
  action: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'export' | 'import' | 'configure';
  resource?: string;
  isActive: boolean;
  isSystemPermission: boolean;
  organizationCode?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  fullName?: string; // Virtual field
}

export interface Role {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  permissions: string[] | Permission[]; // Can be populated
  isActive: boolean;
  isSystemRole: boolean;
  level: number; // 1-100
  dataAccessLevel: DataAccessLevel;
  organizationCode: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  permissionCount?: number; // Virtual field
}

// ============================================================================
// User Profile Types
// ============================================================================

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type EmergencyRelationship = 'father' | 'mother' | 'spouse' | 'sibling' | 'friend' | 'other';

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface PersonalDetails {
  fatherName?: string;
  motherName?: string;
  spouseName?: string;
  maritalStatus?: MaritalStatus;
  nationality?: string;
  religion?: string;
  bloodGroup?: BloodGroup;
  aadharNumber?: string;
  panNumber?: string;
  passportNumber?: string;
  drivingLicenseNumber?: string;
  permanentAddress?: Address;
  currentAddress?: Address;
  isSameAddress?: boolean;
}

export interface EmergencyContact {
  name: string;
  relationship: EmergencyRelationship;
  phone: string;
  email?: string;
  address?: string;
  isPrimary: boolean;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startYear?: number;
  endYear?: number;
  grade?: string;
  percentage?: number;
}

export interface WorkExperience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrentJob: boolean;
  description?: string;
  reasonForLeaving?: string;
}

export interface Skill {
  name: string;
  level: SkillLevel;
  category?: string;
  yearsOfExperience?: number;
}

export interface Certificate {
  name: string;
  issuedBy: string;
  issuedDate: Date;
  expiryDate?: Date;
  fileUrl?: string;
}

export interface Language {
  name: string;
  proficiency: string;
  canRead: boolean;
  canWrite: boolean;
  canSpeak: boolean;
}

export interface SocialProfiles {
  linkedin?: string;
  twitter?: string;
  github?: string;
  portfolio?: string;
}

export interface Preferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language?: string;
  timezone?: string;
}

export interface Resume {
  fileName: string;
  fileUrl: string;
  uploadedOn: Date;
}

export interface UserProfile {
  _id: string;
  userId: string;
  organizationCode: string;
  personalDetails?: PersonalDetails;
  emergencyContacts: EmergencyContact[];
  education: Education[];
  workExperience: WorkExperience[];
  skills: Skill[];
  profilePhoto?: string;
  resume?: Resume;
  certificates: Certificate[];
  languages: Language[];
  socialProfiles?: SocialProfiles;
  preferences?: Preferences;
  reportingManagers: string[];
  isProfileComplete: boolean;
  completionPercentage: number;
  lastUpdated: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Attendance Types
// ============================================================================

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day' | 'work_from_home';

export interface Attendance {
  _id: string;
  employeeId: string;
  date: Date;
  checkIn: Date;
  checkOut?: Date;
  totalHours?: number;
  status: AttendanceStatus;
  notes?: string;
  isLoggedIn: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  formattedDate?: string; // Virtual
  checkInTime?: string; // Virtual
  checkOutTime?: string; // Virtual
}

// ============================================================================
// Leave Types
// ============================================================================

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveType {
  _id: string;
  name: string;
  description?: string;
  daysAllowed: number;
  isCarryForward: boolean;
  maxCarryForwardDays?: number;
  color: string;
  requiresApproval: boolean;
  minDaysNotice: number;
  maxConsecutiveDays: number;
  isActive: boolean;
  organizationCode: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Leave {
  _id: string;
  employeeId: string;
  leaveType: string | LeaveType; // Can be populated
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: Date;
  approvedBy?: string;
  approvedDate?: Date;
  rejectedBy?: string;
  rejectedDate?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  duration?: string; // Virtual
}

export interface LeaveBalance {
  leaveTypeId: string;
  leaveTypeName: string;
  daysAllowed: number;
  daysUsed: number;
  daysRemaining: number;
  color: string;
}

// ============================================================================
// Payroll Types
// ============================================================================

export type PayrollStatus = 'draft' | 'generated' | 'paid' | 'cancelled';

export interface Payroll {
  _id: string;
  userId: string;
  month: string; // "01" to "12"
  year: number;
  basicSalary: number;
  allowances: Allowance[];
  deductions: Deduction[];
  grossSalary: number;
  totalDeductions: number;
  netSalary: number;
  payslipPdfUrl?: string;
  generatedBy: string;
  organizationCode: string;
  generatedDate: Date;
  status: PayrollStatus;
  paidDate?: Date;
  paymentMethod?: string;
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Document Types
// ============================================================================

export type FileType = 'pdf' | 'doc' | 'docx' | 'jpg' | 'jpeg' | 'png';

export interface Document {
  _id: string;
  userId: string;
  fileName: string;
  originalName: string;
  fileType: FileType;
  fileSize: number;
  fileUrl: string;
  uploadedBy: string;
  uploadedOn: Date;
  createdAt: Date;
  updatedAt: Date;
  fileSizeFormatted?: string; // Virtual
  fileExtension?: string; // Virtual
  isImage?: boolean; // Virtual
  isDocument?: boolean; // Virtual
}

// ============================================================================
// Settings Types
// ============================================================================

export interface AllowedLocation {
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
}

export interface AttendanceSettings {
  _id: string;
  autoCheckOut: boolean;
  autoCheckOutTime: string; // "HH:MM"
  lateThreshold: number;
  earlyDepartureThreshold: number;
  overtimeThreshold: number;
  requireLocationTracking: boolean;
  allowedLocations: AllowedLocation[];
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website?: string;
}

export interface WorkingHours {
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  totalHours: number;
  breakDuration: number;
}

export interface CompanySettings {
  _id: string;
  companyName: string;
  companyLogo?: string;
  address: Address;
  contactInfo: ContactInfo;
  workingDays: string[];
  workingHours: WorkingHours;
  currency: string;
  timezone: string;
  fiscalYearStart: string; // "MM-DD"
  leaveResetMonth: number; // 1-12
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardStats {
  totalEmployees: number;
  activeEmployees: number;
  inactiveEmployees: number;
  todayAttendance: {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
  pendingLeaves: number;
  monthlyAttendance: {
    month: string;
    present: number;
    absent: number;
    late: number;
  }[];
  departmentDistribution: {
    department: string;
    count: number;
  }[];
  leaveBalances: LeaveBalance[];
  recentActivities: {
    type: string;
    description: string;
    timestamp: Date;
  }[];
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// ============================================================================
// Auth Types
// ============================================================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  organization: string;
  organizationCode: string;
  department?: string;
  designation?: string;
  role: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
    refreshToken: string;
  };
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

// ============================================================================
// ManaBot Types
// ============================================================================

export interface ManaBotMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ManaBotChatHistory {
  sessionId: string;
  messages: ManaBotMessage[];
}

export interface ManaBotInsights {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

export interface ManaBotRecommendation {
  employeeId: string;
  employeeName: string;
  category: string;
  recommendation: string;
  reason: string;
}

// ============================================================================
// Filter & Query Types
// ============================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserFilters extends PaginationParams {
  search?: string;
  status?: UserStatus;
  department?: string;
  designation?: string;
  employeeType?: EmployeeType;
  role?: number;
}

export interface AttendanceFilters extends PaginationParams {
  employeeId?: string;
  startDate?: string;
  endDate?: string;
  status?: AttendanceStatus;
}

export interface LeaveFilters extends PaginationParams {
  employeeId?: string;
  status?: LeaveStatus;
  leaveType?: string;
  startDate?: string;
  endDate?: string;
}

export interface PayrollFilters extends PaginationParams {
  userId?: string;
  month?: string;
  year?: number;
  status?: PayrollStatus;
}

// ============================================================================
// Form Types
// ============================================================================

export interface UserFormData {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  gender?: Gender;
  dob?: string;
  department?: string;
  designation?: string;
  joiningDate?: string;
  employeeType?: EmployeeType;
  reportingManager?: string;
  role: number;
  status: UserStatus;
}

export interface LeaveFormData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface AttendanceFormData {
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  status: AttendanceStatus;
  notes?: string;
}

// ============================================================================
// Statistics Types
// ============================================================================

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  byDepartment: Record<string, number>;
  byEmployeeType: Record<string, number>;
}

export interface AttendanceStats {
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  workFromHomeDays: number;
  attendancePercentage: number;
  averageWorkHours: number;
}

export interface LeaveStats {
  totalLeaves: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  byLeaveType: Record<string, number>;
}

export interface PayrollStats {
  totalEmployees: number;
  totalPaid: number;
  totalPending: number;
  averageSalary: number;
  totalPayroll: number;
}
