import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getItem, setItem } from '../services/storageService';
import { getCurrentUser } from '../services/authService';
import { useNavigation } from '@react-navigation/native';
import { formatDateToIST, formatTimeToIST } from '../utils/formatDate';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifs = (await getItem('notifications')) || [];
  
        // Deduplicate and sort notifications
        const uniqueNotifications = Array.from(
          new Map(notifs.map((notif) => [notif.id, notif])).values()
        );
  
        const sortedNotifications = uniqueNotifications.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
  
        setNotifications(sortedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        alert('Failed to load notifications.');
      }
    };
  
    fetchNotifications();
  }, []);
  
  
  

  const handleClearNotifications = async () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              setNotifications([]);
              await setItem('notifications', []);
            } catch (error) {
              console.error('Error clearing notifications:', error);
              alert('Failed to clear notifications.');
            }
          },
        },
      ]
    );
  };

  const handleNotificationPress = async (item) => {
    try {
      const currentUser = await getCurrentUser();
      const appointmentKey = `appointment_${currentUser.username}`;
      const appointment = await getItem(appointmentKey);

      if (appointment?.id === item.data?.appointment?.id) {
        navigation.navigate('AppointmentDetails', { appointment });
      } else {
        alert('Appointment details not found.');
      }
    } catch (error) {
      console.error('Error handling notification press:', error);
      alert('An error occurred while processing the notification.');
    }
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        index === 0 && styles.mostRecentNotification,
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <Text style={styles.notificationTitle}>{item.title || 'Notification'}</Text>
      <Text style={styles.notificationMessage}>{item.message || 'No message provided.'}</Text>
      <Text style={styles.notificationDate}>
        {item.formattedDate || 'Unknown date'} • {item.formattedTime || ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {notifications.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Recent Appointments</Text>
          <TouchableOpacity style={styles.clearButton} onPress={handleClearNotifications}>
            <MaterialIcons name="delete-forever" size={24} color="red" />
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}
      {notifications.length === 0 ? (
        <Text style={styles.noNotifications}>No recent appointment notifications.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, marginBottom: 10 },
  headerTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  clearButton: { flexDirection: 'row', alignItems: 'center' },
  clearButtonText: { marginLeft: 5, color: 'red', fontSize: 14, fontWeight: '500' },
  notificationItem: { padding: 15, borderBottomWidth: 1, borderColor: '#EEE' },
  mostRecentNotification: { backgroundColor: '#e6f7ff' },
  notificationTitle: { fontWeight: '600', marginBottom: 5, fontSize: 16 },
  notificationMessage: { color: '#555', fontSize: 14 },
  notificationDate: { color: '#999', fontSize: 12, marginTop: 5 },
  noNotifications: { textAlign: 'center', marginTop: 20, color: '#999' },
});
