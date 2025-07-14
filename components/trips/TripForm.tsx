import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal, StyleSheet } from 'react-native';
import type { Trip } from '../../types';
import { TripType } from '../../types';

interface TripFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: Omit<Trip, 'id' | 'creator' | 'passengers' | 'status' | 'city'>) => void;
  tripType: TripType;
}

const TripForm: React.FC<TripFormProps> = ({ isOpen, onClose, onSubmit, tripType }) => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [seats, setSeats] = useState('1');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!from || !to || !date || !time) {
      setError('Please fill in all fields.');
      return;
    }

    setError('');
    onSubmit({
      from,
      to,
      date,
      time,
      seats: tripType === TripType.OFFER ? parseInt(seats, 10) : 1,
      type: tripType,
    });
    onClose();
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>
            {tripType === TripType.OFFER ? 'Post a New Ride' : 'Request a Ride'}
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TextInput style={styles.input} placeholder="From" value={from} onChangeText={setFrom} />
          <TextInput style={styles.input} placeholder="To" value={to} onChangeText={setTo} />
          <TextInput style={styles.input} placeholder="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
          <TextInput style={styles.input} placeholder="Time (HH:MM)" value={time} onChangeText={setTime} />
          {tripType === TripType.OFFER && (
            <TextInput
              style={styles.input}
              placeholder="Available Seats"
              keyboardType="number-pad"
              value={seats}
              onChangeText={setSeats}
            />
          )}
          <View style={styles.buttonRow}>
            <Button title="Cancel" onPress={onClose} color="#888" />
            <Button title={tripType === TripType.OFFER ? 'Post Ride' : 'Submit Request'} onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15,23,42,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 12,
    width: '90%',
  },
  title: {
    fontSize: 20,
    color: '#f8fafc',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#334155',
    padding: 10,
    borderRadius: 6,
    color: '#f1f5f9',
    marginBottom: 12,
  },
  error: {
    color: '#f87171',
    textAlign: 'center',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
});

export default TripForm;
