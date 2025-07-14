import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Trip, Notification } from '../types';
import { TripType, NotificationType } from '../types';

// In-memory "DB" for mock API
let users: User[] = [
  { id: 'user-1', name: 'Alice', mobile: '9876543210' },
  { id: 'user-2', name: 'Bob', mobile: '1234567890' },
  { id: 'user-3', name: 'Charlie (Driver)', mobile: '5555555555' },
];

let trips: Trip[] = [
  { id: 'trip-1', creator: users[2], type: TripType.OFFER, city: 'Hyderabad', from: 'Gachibowli', to: 'Airport', date: '2024-08-15', time: '10:00', seats: 3, passengers: [], status: 'ACTIVE' },
  { id: 'trip-2', creator: users[1], type: TripType.REQUEST, city: 'Hyderabad', from: 'Kondapur', to: 'Hitec City', date: '2024-08-16', time: '09:00', seats: 1, passengers: [], status: 'ACTIVE' },
  { id: 'trip-3', creator: users[0], type: TripType.OFFER, city: 'Bangalore', from: 'Koramangala', to: 'Indiranagar', date: '2024-08-17', time: '18:00', seats: 2, passengers: [], status: 'ACTIVE' },
  { id: 'trip-4', creator: users[1], type: TripType.REQUEST, city: 'Bangalore', from: 'Whitefield', to: 'Marathahalli', date: '2024-08-18', time: '20:00', seats: 1, passengers: [], status: 'ACTIVE' },
];

let notifications: Notification[] = [];

const LOGGED_IN_USER_KEY = 'zypool_user';
const SELECTED_CITY_KEY = 'zypool_city';

export const mockApi = {
  // Login / Logout
  async getLoggedInUser(): Promise<User | null> {
    try {
      const json = await AsyncStorage.getItem(LOGGED_IN_USER_KEY);
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },

  async setLoggedInUser(user: User) {
    await AsyncStorage.setItem(LOGGED_IN_USER_KEY, JSON.stringify(user));
  },

  async clearLoggedInUser() {
    await AsyncStorage.removeItem(LOGGED_IN_USER_KEY);
  },

  // City
  async getSelectedCity(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(SELECTED_CITY_KEY);
    } catch {
      return null;
    }
  },

  async setSelectedCity(city: string) {
    await AsyncStorage.setItem(SELECTED_CITY_KEY, city);
  },

  async clearSelectedCity() {
    await AsyncStorage.removeItem(SELECTED_CITY_KEY);
  },

  // Auth
  async login(mobile: string, name: string): Promise<User> {
    await new Promise((res) => setTimeout(res, 500));
    let user = users.find((u) => u.mobile === mobile);
    if (!user) {
      user = { id: `user-${Date.now()}`, name, mobile };
      users.push(user);
    } else {
      user.name = name; // update name on re-login
    }
    return user;
  },

  // Trips
  async getTrips(city: string): Promise<Trip[]> {
    await new Promise((res) => setTimeout(res, 300));
    return JSON.parse(
      JSON.stringify(
        trips.filter((t) => t.city === city && t.status !== 'COMPLETED' && t.status !== 'CANCELLED')
      )
    );
  },

  async createTrip(data: Omit<Trip, 'id' | 'passengers' | 'status'>): Promise<Trip> {
    await new Promise((res) => setTimeout(res, 500));
    const newTrip: Trip = {
      ...data,
      id: `trip-${Date.now()}`,
      passengers: [],
      status: 'ACTIVE',
    };
    trips.unshift(newTrip);
    return newTrip;
  },

  async requestToJoin(tripId: string, requesterId: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 500));
    const trip = trips.find((t) => t.id === tripId);
    const requester = users.find((u) => u.id === requesterId);
    if (!trip || !requester || trip.type !== TripType.OFFER) throw new Error('Invalid request');

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      recipientId: trip.creator.id,
      type: NotificationType.JOIN_REQUEST,
      message: `${requester.name} (${requester.mobile}) has requested to join your trip from ${trip.from} to ${trip.to}.`,
      tripId: trip.id,
      sender: requester,
      isRead: false,
      createdAt: new Date(),
    };
    notifications.push(newNotification);
  },

  async offerRide(tripId: string, driverId: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 500));
    const tripRequest = trips.find((t) => t.id === tripId);
    const driver = users.find((u) => u.id === driverId);
    if (!tripRequest || !driver || tripRequest.type !== TripType.REQUEST) throw new Error('Invalid offer');

    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      recipientId: tripRequest.creator.id,
      type: NotificationType.OFFER_REQUEST,
      message: `${driver.name} (${driver.mobile}) has offered you a ride from ${tripRequest.from} to ${tripRequest.to}.`,
      tripId: tripRequest.id,
      sender: driver,
      isRead: false,
      createdAt: new Date(),
    };
    notifications.push(newNotification);
  },

  // Notifications
  async getNotifications(userId: string): Promise<Notification[]> {
    await new Promise((res) => setTimeout(res, 300));
    return JSON.parse(JSON.stringify(notifications.filter((n) => n.recipientId === userId)));
  },

  async handleRequest(notificationId: string, action: 'accept' | 'decline'): Promise<void> {
    await new Promise((res) => setTimeout(res, 500));
    const notification = notifications.find((n) => n.id === notificationId);
    if (!notification) throw new Error('Notification not found');

    const trip = trips.find((t) => t.id === notification.tripId);
    if (!trip) throw new Error('Trip not found');

    if (action === 'accept') {
      if (notification.type === NotificationType.JOIN_REQUEST) {
        if (trip.seats > 0) {
          trip.seats -= 1;
          trip.passengers.push(notification.sender);
          if (trip.seats === 0) {
            trip.status = 'FULL';
          }
        }
      } else if (notification.type === NotificationType.OFFER_REQUEST) {
        trip.status = 'COMPLETED';
        trip.passengers.push(notification.sender);
      }
    }

    notifications = notifications.filter((n) => n.id !== notificationId);
  },

  async markNotificationAsRead(notificationId: string): Promise<void> {
    await new Promise((res) => setTimeout(res, 100));
    const notification = notifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.isRead = true;
    }
  },
};
