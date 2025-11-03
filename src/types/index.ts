export type UserRole = 'patient' | 'doctor';

export interface UserProfile {
  uid: string;
  email: string | null;
  firstName: string;
  lastName:string;
  role: UserRole;
  phone?: string;
  city?: string;
  profilePictureURL?: string;
  // Doctor-specific
  specialty?: string;
}

export type RequestStatus = 'pending' | 'accepted' | 'en-route' | 'completed' | 'cancelled';

export interface AppointmentRequest {
  id: string;
  patientId: string;
  doctorId: string | null;
  requestDate: number; // timestamp
  status: RequestStatus;
  description: string;
  address: string;
  location?: {
    lat: number;
    lng: number;
  };
  patient?: UserProfile; // denormalized for convenience
}

export interface Rating {
  id: string;
  doctorId: string;
  patientId: string;
  score: number; // 1-5
  comment: string;
  date: number; // timestamp
}
