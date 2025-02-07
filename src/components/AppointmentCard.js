import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatDateToIST, formatTimeToIST } from '../utils/formatDate'; // Import formatters

export default function AppointmentCard({ appointment, onPress }) {
  if (!appointment) return null;

  const formattedDate = formatDateToIST(new Date(appointment.date)); // Format date
  const formattedTime = formatTimeToIST(new Date(appointment.time)); // Format time

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress({ appointment })}
    >
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <View style={styles.upcomingBadge}>
            <Text style={styles.upcomingText}>UPCOMING</Text>
          </View>
          <Text style={styles.doctorName}>{appointment.doctorName}</Text>
          <Text style={styles.speciality}>
            {appointment.doctorSpeciality} | {appointment.doctorDegree}
          </Text>
          <Text style={styles.date}>
  {formatDateToIST(appointment.date)} | {formatTimeToIST(appointment.time)} IST
</Text>

        </View>
        <View style={styles.rightSection}>
          <Ionicons
            name="chevron-forward"
            size={20}
            color="#888"
            style={styles.chevronIcon}
          />
          {appointment.doctorPhoto && (
            <Image source={appointment.doctorPhoto} style={styles.doctorImage} />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
  },
  leftSection: {
    flex: 1,
    paddingRight: 8,
  },
  upcomingBadge: {
    backgroundColor: '#3A9B78',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  upcomingText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  doctorName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 2,
  },
  speciality: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#555',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#555',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
    marginTop: -20,
  },
  chevronIcon: {
    alignSelf: 'center',
    paddingBottom: 30,
    marginRight: -50,
  },
});
