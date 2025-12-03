
export enum ReportStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED'
}

export enum WasteCategory {
  ROADSIDE = 'Roadside Garbage',
  BIN_OVERFLOW = 'Overflowing Dustbin',
  PLASTIC = 'Plastic Waste',
  WET = 'Wet Waste',
  CONSTRUCTION = 'Construction Waste',
  OTHER = 'Other'
}

export interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  pincode?: string;
}

export interface TimelineEvent {
  status: ReportStatus;
  timestamp: number;
  note?: string;
}

export interface WasteReport {
  id: string;
  token: string;
  imageUrl?: string;
  title?: string;
  category: WasteCategory;
  description: string;
  severity: number; // 1-5
  location: LocationData;
  timestamp: number;
  status: ReportStatus;
  timeline: TimelineEvent[];
  aiAnalysis?: string;
  resolvedImageUrl?: string; // For "After" photo
}

export interface UserStats {
  reportsSubmitted: number;
  points: number;
  rank: string;
}

export type ViewState = 'LANDING' | 'DASHBOARD' | 'REPORT' | 'PROFILE' | 'MAP' | 'WORKER' | 'TRACK' | 'ADMIN';
