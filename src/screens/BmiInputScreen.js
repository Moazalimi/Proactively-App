import React, { useState } from 'react'; 
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_600Regular, } from '@expo-google-fonts/inter';

import { setItem } from '../services/storageService';

export default function BmiInputScreen({ navigation }) {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  // Load Inter fonts
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    // Show a loading indicator while fonts load
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const handleSave = async () => {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!isNaN(h) && !isNaN(w) && h > 0) {
      const heightM = h / 100;
      const bmi = w / (heightM * heightM);
      await setItem('bmi', bmi);
      navigation.goBack();
    } else {
      alert('Enter valid height in cm and weight in kg');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Body Weight */}
      <Text style={styles.label}>Body weight:</Text>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.inputNumber}
          placeholder="e.g. 78"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <Text style={styles.unitText}>kgs</Text>
      </View>

      {/* Height */}
      <Text style={styles.label}>Height:</Text>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.inputNumber}
          placeholder="e.g. 154"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={height}
          onChangeText={setHeight}
        />
        <Text style={styles.unitText}>cms</Text>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSave}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
    fontFamily: 'Inter_600SemiBold',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: 250,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 24,
  },
  inputNumber: {
    flex: 1,
    fontSize: 32,
    color: '#000',
    fontFamily: 'Inter_600SemiBold',
  },
  unitText: {
    fontSize: 16,
    color: '#888',
    marginLeft: 4,
    fontFamily: 'Inter_400Regular',
  },
  submitButton: {
    backgroundColor: '#2979FF',
    paddingVertical: 14,
    borderRadius: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    fontFamily: 'Inter_600Regular',
  },
});
