
export enum TripType {
  OFFER = 'OFFER', // Driver posting a ride with available seats
  REQUEST = 'REQUEST', // Rider looking for a ride
}

export enum RequestStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
}

export enum NotificationType {
    JOIN_REQUEST = 'JOIN_REQUEST', // Rider wants to join a driver's trip
    OFFER_REQUEST = 'OFFER_REQUEST', // Driver offers a ride to a requester
    REQUEST_ACCEPTED = 'REQUEST_ACCEPTED', // A request was accepted
    REQUEST_DECLINED = 'REQUEST_DECLINED', // A request was declined
}

export interface User {
  id: string;
  name: string;
  mobile: string;
}

export interface Trip {
  id: string;
  creator: User;
  type: TripType;
  city: string;
  from: string;
  to: string;
  date: string;
  time: string;
  seats: number; // For OFFER, it's available seats. For REQUEST, it's seats needed (e.g., 1).
  passengers: User[];
  status: 'ACTIVE' | 'FULL' | 'COMPLETED' | 'CANCELLED';
}

export interface Notification {
  id: string;
  recipientId: string;
  type: NotificationType;
  message: string;
  tripId: string;
  sender: User;
  isRead: boolean;
  createdAt: Date;
}