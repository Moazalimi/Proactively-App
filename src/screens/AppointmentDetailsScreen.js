import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import { formatDateToIST, formatTimeToIST } from '../utils/formatDate';


export default function AppointmentDetailsScreen({ route }) {
  const { appointment } = route.params || {};

  if (!appointment) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>No appointment details available.</Text>
      </View>
    );
  }

  const joinMeeting = () => {
    if (appointment?.meetLink) {
      Linking.openURL(appointment.meetLink).catch(() => alert('Invalid meeting link.'));
    } else {
      alert('No meeting link available.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.status}>{appointment.status || 'UPCOMING'}</Text>
      </View>

      <View style={styles.doctorInfoContainer}>
        <Image
          source={typeof appointment.doctorPhoto === 'string' ? { uri: appointment.doctorPhoto } : appointment.doctorPhoto}
          style={styles.doctorImage}
        />
        <Text style={styles.title}>Your upcoming appointment with</Text>
        <Text style={styles.doctorName}>{appointment.doctorName}</Text>
        <Text style={styles.doctorDegree}>{appointment.doctorDegree}</Text>
        <Text style={styles.doctorSpeciality}>{appointment.doctorSpeciality}</Text>
      </View>

      <View style={styles.appointmentDetails}>
        <View style={styles.appointmentContainer}>
          <Text style={styles.Type}>Appointment</Text>
        </View>
        <Text style={styles.dateTime}>
  {formatDateToIST(appointment.date)} | {formatTimeToIST(appointment.time)}
</Text>
      </View>

      <View style={styles.meetingLinkContainer}>
        <Text style={styles.meetingLabel}>Meeting link:</Text>
        <Text style={styles.meetingLink}>
          {appointment.meetLink || 'Link will be updated shortly after your appointment is confirmed with the doctor.'}
        </Text>
      </View>

      <TouchableOpacity style={styles.joinButton} onPress={joinMeeting}>
        <Text style={styles.joinButtonText}>Join meeting</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  doctorInfoContainer: {
    alignItems: 'center',
    paddingHorizontal: 1,
  },
  statusContainer: {
    alignSelf: 'flex-start',
    maxWidth: 87,
    backgroundColor: '#3A9B78',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 20,
  },
  status: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  doctorName: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '400',
    marginTop: 5,
    marginBottom: 15,
    color: '#222',
  },
  appointmentDetails: {
    alignItems: 'center',
    marginBottom: 20,
  },
  doctorDegree: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginBottom: 5,
  },
  appointmentContainer: {
    alignSelf: 'center',
    backgroundColor: '#7A3DB61A',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 10,
  },
  Type: {
    color: '#7A3DB6',
  },
  doctorSpeciality: {
    fontSize: 14,
    color: '#52656A',
    fontWeight: '500',
    marginBottom: 10,
  },
  dateTime: {
    fontSize: 14,
    color: '#555',
  },
  meetingLinkContainer: {
    marginBottom: 20,
  },
  meetingLabel: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 5,
  },
  meetingLink: {
    fontSize: 14,
    color: '#1E88E5',
  },
  joinButton: {
    backgroundColor: '#4384E6',
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 30,
  },
  joinButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    textAlign: 'center',
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
});
