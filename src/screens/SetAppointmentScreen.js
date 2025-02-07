import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateToIST, formatTimeToIST } from '../utils/formatDate';
import { setItem } from '../services/storageService';
import { addNotificationToList, sendPushNotification, retrieveToken } from '../services/notificationService';
import { getCurrentUser } from '../services/authService';

import doctor1 from '../assets/doctors/doctor1.png';
import doctor2 from '../assets/doctors/doctor2.png';
import doctor3 from '../assets/doctors/doctor3.png';

const doctors = [
  {
    id: 1,
    name: 'Dr. Laurie Simons',
    degree: 'MD, DipABLM',
    photo: doctor1,
    speciality: 'Internal Medicine',
  },
  {
    id: 2,
    name: 'Dr. James Allen',
    degree: 'MBBS, PhD',
    photo: doctor2,
    speciality: 'Oncology',
  },
  {
    id: 3,
    name: 'Dr. Sarah Johnson',
    degree: 'DO, MPH',
    photo: doctor3,
    speciality: 'Medical Gastroenterology',
  },
];

export default function SetAppointmentScreen({ navigation }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [meetLink, setMeetLink] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = async () => {
    try {
      if (!selectedDoctor || !date || !time) {
        Alert.alert('Missing Information', 'Please complete all required fields.');
        return;
      }
  
      // Ensure `date` and `time` are properly parsed as Date objects
      const parsedDate = date instanceof Date ? date : new Date(date);
      const parsedTime = time instanceof Date ? time : new Date(time);
  
      if (isNaN(parsedDate) || isNaN(parsedTime)) {
        Alert.alert('Error', 'Invalid date or time. Please select again.');
        return;
      }
  
      const isoDate = parsedDate.toISOString();
      const isoTime = parsedTime.toISOString();
      const currentUser = await getCurrentUser();
  
      if (!currentUser) {
        Alert.alert('Error', 'No user is logged in.');
        return;
      }
  
      const appointment = {
        id: Date.now().toString(),
        doctorName: selectedDoctor.name,
        doctorDegree: selectedDoctor.degree,
        doctorSpeciality: selectedDoctor.speciality,
        doctorPhoto: selectedDoctor.photo,
        date: isoDate,
        time: isoTime,
        meetLink,
        status: 'UPCOMING',
      };
  
      await setItem(`appointment_${currentUser.username}`, appointment);
  
      // Add Notification
      const notification = {
        id: Date.now().toString(),
        title: 'Appointment Booked',
        message: `Your appointment with ${selectedDoctor.name} on ${formatDateToIST(parsedDate)} at ${formatTimeToIST(parsedTime)} is booked.`,
        date: isoDate,
        formattedDate: formatDateToIST(parsedDate),
        formattedTime: formatTimeToIST(parsedTime),
        seen: false,
        data: { appointment },
      };
  
      await addNotificationToList(notification);
  
      // Push Notification
      const expoPushToken = await retrieveToken();
      if (expoPushToken) {
        await sendPushNotification(
          expoPushToken,
          notification.title,
          notification.message,
          { appointment }
        );
      }
  
      Alert.alert('Success', 'Appointment has been saved successfully.');
      navigation.goBack();
    } catch (error) {
      console.error('Error saving appointment:', error);
      Alert.alert('Error', 'Failed to save appointment. Please try again.');
    }
  };
  
  

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) setTime(selectedTime);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">

        <Text style={styles.sectionTitle}>Select Doctor</Text>
        <FlatList
          data={doctors}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.doctorCard,
                selectedDoctor?.id === item.id && styles.selectedDoctorCard,
              ]}
              onPress={() => setSelectedDoctor(item)}
            >
              <Image source={item.photo} style={styles.doctorPhoto} />
              <Text style={styles.doctorName}>{item.name}</Text>
              <Text style={styles.doctorDegree}>{item.degree}</Text>
              <Text style={styles.doctorSpeciality}>{item.speciality}</Text>
            </TouchableOpacity>
          )}
        />

        <Text style={styles.inputLabel}>Select Date</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.inputText}>
            {date ? formatDateToIST(date) : 'Choose a date'}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            mode="date"
            value={date || new Date()}
            onChange={handleDateChange}
            display="calendar"
          />
        )}

        <Text style={styles.inputLabel}>Select Time</Text>
        <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
          <Text style={styles.inputText}>
            {time ? formatTimeToIST(time) : 'Choose a time'}
          </Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            mode="time"
            value={time || new Date()}
            onChange={handleTimeChange}
            is24Hour={true}
            display="clock"
          />
        )}

        <Text style={styles.inputLabel}>Google Meet Link</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Google Meet Link (optional)"
          value={meetLink}
          onChangeText={setMeetLink}
        />
      </ScrollView>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Appointment</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  content: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  doctorCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    width: 150,
  },
  selectedDoctorCard: {
    borderColor: '#4384E6',
    backgroundColor: '#4384E61A',
  },
  doctorPhoto: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  doctorDegree: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  doctorSpeciality: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 15,
    backgroundColor: '#FFF',
    fontSize: 16,
    marginBottom: 20,
  },
  inputText: {
    color: '#555',
  },
  saveButton: {
    backgroundColor: '#4384E6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
