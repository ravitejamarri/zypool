import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Icon from '../ui/Icon';

interface Props {
  count: number;
  onClick: () => void;
}

const NotificationBell: React.FC<Props> = ({ count, onClick }) => {
  return (
    <TouchableOpacity onPress={onClick} style={styles.bell}>
      <Icon name="bell" size={24} color="#fff" />
      {count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{count}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bell: {
    padding: 10,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F87171',
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default NotificationBell;
