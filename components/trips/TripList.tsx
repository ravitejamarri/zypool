import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Trip, User } from '../../types';
import TripCard from './TripCard';

interface TripListProps {
  trips: Trip[];
  currentUser: User;
  searchQuery: string;
  onJoinRequest: (tripId: string) => void;
  onOfferRide: (tripId: string) => void;
}

const TripList: React.FC<TripListProps> = ({
  trips,
  currentUser,
  searchQuery,
  onJoinRequest,
  onOfferRide,
}) => {
  if (trips.length === 0) {
    const message = searchQuery
      ? `Your search for "${searchQuery}" did not match any trips.`
      : 'Be the first to post a trip in this city using the "+" button!';
    const icon = searchQuery ? '🔍' : '🚗';
    const title = searchQuery ? 'No Results Found' : 'No trips found';

    return (
      <View style={styles.messageBox}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.tripList}>
      {trips.map((trip) => (
        <TripCard
          key={trip.id}
          trip={trip}
          currentUser={currentUser}
          onJoinRequest={onJoinRequest}
          onOfferRide={onOfferRide}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tripList: {
    gap: 16,
  },
  messageBox: {
    backgroundColor: '#1e293b',
    borderColor: '#334155',
    borderWidth: 1,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 16,
  },
  icon: {
    fontSize: 40,
    color: '#94a3b8',
  },
  title: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#cbd5e1',
    textAlign: 'center',
  },
});

export default TripList;
