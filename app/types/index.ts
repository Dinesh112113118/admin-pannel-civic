import { LucideIcon } from 'lucide-react';

export type Status = 'Pending' | 'In Progress' | 'Resolved' | 'Error';

export interface Issue {
  id: string;
  title: string;
  description: string;
  department: 'Electrical' | 'Sewer' | 'Road & Transport' | 'Water' | 'Sanitation';
  status: Status;
  location: {
    lat: number;
    lng: number;
  };
  locationAddress: string;
  distance: number;
  imageUrl: string;
  submittedAt: Date;
  resolvedAt: Date | null;
  userId: string;
  userContact: string;
  notes: string;
  questions: string[];
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  
  // New fields for proof of resolution
  resolvedImageUrl: string | null;
  resolutionNotes: string | null;
  resolvedBy: string | null;
}

export interface Notification {
  id: string;
  issueId?: string;
  icon: LucideIcon;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
}
