import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import type { Notification } from '../../types';
import Icon from '../ui/Icon';

interface Props {
  notifications: Notification[];
  onAction: (notificationId: string, action: 'accept' | 'decline') => void;
  onClose: () => void;
}

const NotificationPanel: React.FC<Props> = ({ notifications, onAction, onClose }) => {
  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notifications</Text>
        <TouchableOpacity onPress={onClose}>
          <Icon name="x" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
      {notifications.length === 0 ? (
        <Text style={styles.empty}>No new notifications</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.notification}>
              <Text style={styles.message}>{item.message}</Text>
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => onAction(item.id, 'accept')}>
                  <Text style={styles.accept}>Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onAction(item.id, 'decline')}>
                  <Text style={styles.decline}>Decline</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  panel: {
    position: 'absolute',
    top: 50,
    right: 10,
    width: 280,
    maxHeight: 400,
    backgroundColor: '#1f2937',
    borderRadius: 10,
    padding: 10,
    zIndex: 99,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  empty: {
    color: '#ccc',
    textAlign: 'center',
    paddingVertical: 10,
  },
  notification: {
    backgroundColor: '#374151',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  message: {
    color: '#fff',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 6,
  },
  accept: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  decline: {
    color: '#F87171',
    fontWeight: 'bold',
  },
});

export default NotificationPanel;
