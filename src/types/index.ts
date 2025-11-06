export type UserRole = 'patient' | 'doctor';

export interface UserProfile {
  uid: string;
  email: string | null;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  city?: string;
  profilePictureURL?: string;
  // Doctor-specific
  specialty?: string;
  // Availability and location
  isOnline?: boolean; // Online/Offline status for doctors
  currentLocation?: {
    lat: number;
    lng: number;
    updatedAt: number; // timestamp
  };
  // Doctor profile enhancements
  yearsOfExperience?: number;
  certifications?: string[]; // Array of certification names
  languages?: string[]; // Languages spoken
  consultationPrice?: number; // Price per consultation
  serviceRadius?: number; // Service radius in km
  availability?: {
    monday?: { start: string; end: string; available: boolean }; // Format: "09:00", "18:00"
    tuesday?: { start: string; end: string; available: boolean };
    wednesday?: { start: string; end: string; available: boolean };
    thursday?: { start: string; end: string; available: boolean };
    friday?: { start: string; end: string; available: boolean };
    saturday?: { start: string; end: string; available: boolean };
    sunday?: { start: string; end: string; available: boolean };
  };
  averageRating?: number; // Calculated from ratings
  totalConsultations?: number; // Total completed consultations
  verified?: boolean; // Identity verification badge
}

export type RequestStatus = 'pending' | 'accepted' | 'en-route' | 'completed' | 'cancelled';
export type AppointmentStatus = RequestStatus;

export interface AppointmentRequest {
  id: string;
  patientId: string;
  doctorId: string | null;
  requestDate: number; // timestamp
  status: RequestStatus;
  description: string;
  address: string;
  specialty?: string; // Medical specialty required
  urgency?: 'low' | 'medium' | 'high' | 'emergency'; // Urgency level
  contactPhone?: string; // Contact phone number
  additionalNotes?: string; // Additional notes or instructions
  location?: {
    lat: number;
    lng: number;
  };
  patient?: UserProfile; // denormalized for convenience
  doctor?: UserProfile; // denormalized for convenience
  // Tracking and timing
  acceptedAt?: number; // timestamp when doctor accepted
  enRouteAt?: number; // timestamp when doctor started route
  arrivedAt?: number; // timestamp when doctor arrived
  completedAt?: number; // timestamp when appointment completed
  estimatedArrivalTime?: number; // ETA in minutes
  doctorLocation?: {
    lat: number;
    lng: number;
    updatedAt: number; // timestamp
  }; // Current location of doctor when en-route
  // Payment
  price?: number; // Consultation price
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  paymentMethod?: string;
}

export interface Rating {
  id: string;
  doctorId: string;
  patientId: string;
  score: number; // 1-5
  comment: string;
  date: number; // timestamp
  appointmentId?: string; // Link to appointment
}
