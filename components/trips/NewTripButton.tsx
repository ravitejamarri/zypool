import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { TripType } from '../../types';

interface NewTripButtonProps {
  onSelect: (type: TripType) => void;
}

const NewTripButton: React.FC<NewTripButtonProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (type: TripType) => {
    onSelect(type);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      {isOpen && (
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.option} onPress={() => handleSelect(TripType.OFFER)}>
            <Text style={[styles.optionText, { color: '#22d3ee' }]}>🚗 Post a Ride</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => handleSelect(TripType.REQUEST)}>
            <Text style={[styles.optionText, { color: '#f472b6' }]}>🙋 Get a Ride</Text>
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity style={styles.button} onPress={() => setIsOpen((prev) => !prev)}>
        <Text style={styles.plus}>{isOpen ? '✕' : '+'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    zIndex: 999,
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#22d3ee',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  plus: {
    fontSize: 32,
    color: '#0f172a',
    fontWeight: 'bold',
  },
  dropdown: {
    marginBottom: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderColor: '#334155',
    borderWidth: 1,
  },
  option: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: '#f8fafc',
  },
});

export default NewTripButton;
