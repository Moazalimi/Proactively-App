import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setItem } from '../services/storageService';

const { width: deviceWidth } = Dimensions.get('window'); // Get device width

export default function SleepInputScreen({ navigation }) {
  const [sleep, setSleep] = useState(0); // Default to 8 hours

  const incrementSleep = () => {
    setSleep((prev) => Math.min(prev + 1, 24)); // Max sleep hours
  };

  const decrementSleep = () => {
    setSleep((prev) => Math.max(prev - 1, 0)); // Min sleep hours
  };

  const handleSave = async () => {
    if (!isNaN(sleep) && sleep >= 0) {
      await setItem('sleep', sleep);
      navigation.goBack();
    } else {
      alert('Enter a valid number');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.sleepContainer}>
        <TouchableOpacity onPress={decrementSleep} style={styles.iconButton}>
          <Ionicons name="remove-circle-outline" size={40} color="#4A90E2" />
        </TouchableOpacity>
        <View style={styles.sleepTextContainer}>
          <Ionicons name="moon" size={20} color="#707070" />
          <Text style={[styles.sleepText, sleep === 0 ? styles.inactiveText : styles.activeText]}>{sleep} hours</Text>
        </View>
        <TouchableOpacity onPress={incrementSleep} style={styles.iconButton}>
          <Ionicons name="add-circle-outline" size={40} color="#4A90E2" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingTop: 50,
    padding: 20,
  },
  sleepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Space between buttons and text
    width: deviceWidth * 0.9, // 90% of device width
    height: 100,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderColor: '#DEDEDE',
    borderWidth: 1,
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  iconButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sleepTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sleepText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 5, 
  },
  activeText: {
    color: '#000',
  },
  inactiveText: {
    color: '#A9A9A9',
  },
  submitButton: {
    backgroundColor: '#4384E6',
    width: deviceWidth * 0.9, 
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#fff',
  },
});
