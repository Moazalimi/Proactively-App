import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser, logout } from '../services/authService';
import { useIsFocused } from '@react-navigation/native';
import defaultIcon from '../assets/icon.png'; // Changed from require to import

export default function AccountScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      (async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      })();
    }
  }, [isFocused]);

  const handleLogout = async () => {
    await logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileContainer}>
        <Image
          source={user?.photoUri ? { uri: user.photoUri } : defaultIcon} // Updated fallback
          style={styles.profileImage}
        />
        <View style={styles.profileDetails}>
          <Text style={styles.profileName}>{user?.name || 'Your Name'}</Text>
          <Text style={styles.profileEmail}>{user?.username || 'YourUsername@domain.com'}</Text>
        </View>
      </View>

      {/* Account Section */}
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => navigation.navigate('UpdateProfile')}
      >
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="person-outline" size={20} color="#777" />
            <Text style={styles.optionText}>Account</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* Book Appointment Section */}
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => navigation.navigate('SetAppointment')}
      >
        <View style={styles.row}>
          <Text style={styles.appointmentText}>Book an Appointment</Text>
        </View>
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Logout Button */}
      <TouchableOpacity style={styles.optionContainer} onPress={handleLogout}>
        <View style={styles.row}>
          <Text style={[styles.appointmentText, { color: '#E53935' }]}>Log out</Text>
          <Ionicons name="chevron-forward" size={20} color="#E53935" style={{ paddingRight: 20 }} />
        </View>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Proactively version 0.0.1</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileDetails: {
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  profileEmail: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginVertical: 10,
  },
  optionContainer: {
    paddingVertical: 15,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
    marginLeft: 10,
  },
  appointmentText: {
    fontSize: 16,
    color: '#3D53B6',
    marginLeft: 10,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#AAA',
  },
});
