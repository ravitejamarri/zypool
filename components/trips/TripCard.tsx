import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { Trip, User } from '../../types';

interface TripCardProps {
  trip: Trip;
  currentUser: User;
  onJoinRequest: (tripId: string) => void;
  onOfferRide: (tripId: string) => void;
}

const TripCard: React.FC<TripCardProps> = ({ trip, currentUser, onJoinRequest, onOfferRide }) => {
  const isOffer = trip.type === 'OFFER';
  const isCreatedByCurrentUser = trip.creator.id === currentUser.id;

  return (
    <View style={styles.card}>
      <Text style={styles.tripTitle}>{trip.from} → {trip.to}</Text>
      <Text style={styles.dateTime}>{trip.date} at {trip.time}</Text>
      <Text style={styles.info}>
        {isOffer ? 'Driver' : 'Rider'}: {trip.creator.name} ({trip.creator.mobile})
      </Text>
      <Text style={styles.info}>Seats: {trip.seats}</Text>
      <Text style={[styles.status, trip.status === 'FULL' && styles.full]}>
        Status: {trip.status}
      </Text>

      {!isCreatedByCurrentUser && (
        <TouchableOpacity
          onPress={() => (isOffer ? onJoinRequest(trip.id) : onOfferRide(trip.id))}
          style={[styles.button, isOffer ? styles.joinButton : styles.offerButton]}
        >
          <Text style={styles.buttonText}>
            {isOffer ? 'Request to Join' : 'Offer Ride'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    padding: 16,
    borderRadius: 12,
    borderColor: '#334155',
    borderWidth: 1,
    marginBottom: 12,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 4,
  },
  dateTime: {
    color: '#94a3b8',
    marginBottom: 6,
  },
  info: {
    color: '#cbd5e1',
    fontSize: 14,
    marginBottom: 4,
  },
  status: {
    color: '#22d3ee',
    marginBottom: 8,
  },
  full: {
    color: '#f87171',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButton: {
    backgroundColor: '#06b6d4',
  },
  offerButton: {
    backgroundColor: '#f472b6',
  },
  buttonText: {
    color: '#0f172a',
    fontWeight: '600',
  },
});

export default TripCard;
