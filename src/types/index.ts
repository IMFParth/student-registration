/**
 * Type Definitions for Nexus Student Management System
 * Author: Parth Rai
 */

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  rollNo: string;
  password?: string;
  contact: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: Address;
  course: string;
  department: string;
  year: number;
  semester: number;
  gpa: number;
  credits: number;
  enrollmentDate: Date;
  graduationDate?: Date;
  status: 'active' | 'inactive' | 'graduated' | 'suspended';
  profileImage?: string;
  emergencyContact: EmergencyContact;
  academicHistory: AcademicRecord[];
  extracurriculars: string[];
  achievements: Achievement[];
  fees: FeeRecord[];
  attendance: AttendanceRecord[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface AcademicRecord {
  semester: number;
  year: number;
  courses: CourseGrade[];
  gpa: number;
  credits: number;
}

export interface CourseGrade {
  courseId: string;
  courseName: string;
  grade: string;
  credits: number;
  instructor: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: Date;
  category: 'academic' | 'sports' | 'cultural' | 'leadership' | 'other';
}

export interface FeeRecord {
  id: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'pending' | 'paid' | 'overdue';
  description: string;
}

export interface AttendanceRecord {
  date: Date;
  courseId: string;
  status: 'present' | 'absent' | 'late';
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  permissions: Permission[];
  lastLogin?: Date;
  isActive: boolean;
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  department: string;
  instructor: string;
  prerequisites: string[];
  schedule: Schedule[];
  capacity: number;
  enrolled: number;
  semester: number;
  year: number;
}

export interface Schedule {
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  faculty: string[];
  courses: string[];
  budget: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  recipient: string;
  read: boolean;
  createdAt: Date;
}

export interface SystemMetrics {
  totalStudents: number;
  activeStudents: number;
  totalCourses: number;
  totalDepartments: number;
  averageGPA: number;
  attendanceRate: number;
  graduationRate: number;
  lastUpdated: Date;
}

export interface SearchFilters {
  department?: string;
  course?: string;
  year?: number;
  semester?: number;
  status?: string;
  gpaRange?: { min: number; max: number };
  dateRange?: { start: Date; end: Date };
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: Date;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string | string[];
  borderWidth?: number;
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'chart' | 'metric' | 'table' | 'list';
  data: any;
  config: WidgetConfig;
  position: { x: number; y: number; w: number; h: number };
}

export interface WidgetConfig {
  refreshInterval?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  colors?: string[];
  [key: string]: any;
}

export interface ExportOptions {
  format: 'csv' | 'xlsx' | 'pdf' | 'json';
  fields: string[];
  filters?: SearchFilters;
  includeHeaders: boolean;
}

export interface ImportResult {
  success: boolean;
  imported: number;
  failed: number;
  errors: ValidationError[];
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: Record<string, any>;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export interface BackupInfo {
  id: string;
  filename: string;
  size: number;
  createdAt: Date;
  type: 'full' | 'incremental';
  status: 'completed' | 'failed' | 'in_progress';
}

export interface SystemConfig {
  siteName: string;
  siteUrl: string;
  adminEmail: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  features: {
    enableNotifications: boolean;
    enableAuditLog: boolean;
    enableBackup: boolean;
    enableAnalytics: boolean;
  };
  limits: {
    maxStudents: number;
    maxFileSize: number;
    sessionTimeout: number;
  };
}

export type SortDirection = 'asc' | 'desc';
export type StudentStatus = 'active' | 'inactive' | 'graduated' | 'suspended';
export type UserRole = 'admin' | 'faculty' | 'student';
export type NotificationType = 'info' | 'warning' | 'error' | 'success';
export type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'json';