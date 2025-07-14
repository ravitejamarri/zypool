import React from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Platform } from 'react-native';
import { User, Notification } from '../../types';
import { Bell, LogOut, ArrowLeft } from 'lucide-react-native';
import RNPickerSelect from 'react-native-picker-select';

type Props = {
  user: User;
  selectedCity: string | null;
  notifications: Notification[];
  onCitySelect: (city: string) => void;
  onLogout: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  onNotificationAction: (id: string, action: 'accept' | 'decline') => void;
  onMarkAsRead: (id: string) => void;
  showBack?: boolean;
  onBackPress?: () => void;
};

const cities = ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai', 'Delhi'];

const Header: React.FC<Props> = ({
  user,
  selectedCity,
  notifications,
  onCitySelect,
  onLogout,
  onSearchChange,
  searchQuery,
  showBack,
  onBackPress,
}) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {showBack && (
          <TouchableOpacity onPress={onBackPress}>
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
        )}
        <Text style={styles.welcome}>Hello, {user.name}</Text>
        <View style={styles.iconGroup}>
          <TouchableOpacity style={styles.iconWrapper}>
            <Bell size={22} color="#333" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={onLogout}>
            <LogOut size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <RNPickerSelect
        onValueChange={onCitySelect}
        value={selectedCity}
        placeholder={{ label: 'Select a city', value: null }}
        items={cities.map(city => ({ label: city, value: city }))}
        style={{
          inputIOS: styles.pickerInput,
          inputAndroid: styles.pickerInput,
        }}
      />

      <TextInput
        placeholder="Search by location or person..."
        value={searchQuery}
        onChangeText={onSearchChange}
        style={styles.searchInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  welcome: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: 8,
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 16,
  },
  iconWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 1,
    zIndex: 10,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  pickerInput: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  searchInput: {
    marginTop: 12,
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
});

export default Header;
