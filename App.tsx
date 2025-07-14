import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, Trip, Notification } from './types';
import { TripType } from './types';
import LoginScreen from './components/auth/LoginScreen';
import Header from './components/layout/Header';
import TripList from './components/trips/TripList';
import NewTripButton from './components/trips/NewTripButton';
import TripForm from './components/trips/TripForm';
import { mockApi } from './services/mockApi';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isTripFormOpen, setIsTripFormOpen] = useState<boolean>(false);
  const [tripFormType, setTripFormType] = useState<TripType>(TripType.OFFER);

  const fetchData = useCallback(async () => {
    if (currentUser && selectedCity) {
      const [fetchedTrips, fetchedNotifications] = await Promise.all([
        mockApi.getTrips(selectedCity),
        mockApi.getNotifications(currentUser.id),
      ]);
      setTrips(fetchedTrips);
      setNotifications(fetchedNotifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } else {
      setTrips([]);
    }
  }, [currentUser, selectedCity]);

  useEffect(() => {
    (async () => {
      const user = await mockApi.getLoggedInUser();
      const isFirstLogin = await AsyncStorage.getItem('hasLoggedInBefore');

      if (user) {
        setCurrentUser(user);
        const savedCity = await mockApi.getSelectedCity();
        if (savedCity) setSelectedCity(savedCity);

        if (!isFirstLogin) {
          await AsyncStorage.setItem('hasLoggedInBefore', 'true');
        }
      } else {
        setCurrentUser(null); // Show login screen
      }
    })();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogin = async (user: User) => {
    setCurrentUser(user);
    await mockApi.setLoggedInUser(user);
    await AsyncStorage.setItem('hasLoggedInBefore', 'true');
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    setSelectedCity(null);
    await mockApi.clearLoggedInUser();
    await mockApi.clearSelectedCity();
    setTrips([]);
    setNotifications([]);
  };

  const handleCitySelect = async (city: string) => {
    setSelectedCity(city);
    await mockApi.setSelectedCity(city);
  };

  const handleOpenTripForm = (type: TripType) => {
    if (!selectedCity) {
      Alert.alert('Please select a city first!');
      return;
    }
    setTripFormType(type);
    setIsTripFormOpen(true);
  };

  const handleCreateTrip = async (tripData: Omit<Trip, 'id' | 'creator' | 'passengers' | 'status' | 'city'>) => {
    if (!currentUser || !selectedCity) return;
    await mockApi.createTrip({ ...tripData, creator: currentUser, city: selectedCity });
    setIsTripFormOpen(false);
    fetchData();
  };

  const handleJoinRequest = async (tripId: string) => {
    if (!currentUser) return;
    await mockApi.requestToJoin(tripId, currentUser.id);
    Alert.alert('Your request has been sent to the trip creator!');
    fetchData();
  };

  const handleOfferRide = async (tripId: string) => {
    if (!currentUser) return;
    await mockApi.offerRide(tripId, currentUser.id);
    Alert.alert('Your offer has been sent to the person requesting a ride!');
    fetchData();
  };

  const handleNotificationAction = async (notificationId: string, action: 'accept' | 'decline') => {
    await mockApi.handleRequest(notificationId, action);
    fetchData();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await mockApi.markNotificationAsRead(notificationId);
    fetchData();
  };

  const filteredTrips = trips.filter(trip => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      trip.from.toLowerCase().includes(query) ||
      trip.to.toLowerCase().includes(query) ||
      trip.creator.name.toLowerCase().includes(query) ||
      trip.creator.mobile.includes(query)
    );
  });

  if (!currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        user={currentUser}
        notifications={notifications}
        selectedCity={selectedCity}
        onCitySelect={handleCitySelect}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onNotificationAction={handleNotificationAction}
        onMarkAsRead={handleMarkAsRead}
        onLogout={handleLogout}
      />
      <ScrollView style={styles.container}>
        {selectedCity ? (
          <>
            <Text style={styles.cityTitle}>Live Feed for {selectedCity}</Text>
            <TripList
              trips={filteredTrips}
              currentUser={currentUser}
              searchQuery={searchQuery}
              onJoinRequest={handleJoinRequest}
              onOfferRide={handleOfferRide}
            />
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Welcome, {currentUser.name}!</Text>
            <Text style={styles.emptySubtitle}>Please select a city to view and post trips.</Text>
          </View>
        )}
      </ScrollView>
      <NewTripButton onSelect={handleOpenTripForm} />
      {isTripFormOpen && (
        <TripForm
          isOpen={isTripFormOpen}
          onClose={() => setIsTripFormOpen(false)}
          onSubmit={handleCreateTrip}
          tripType={tripFormType}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  cityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default App;
