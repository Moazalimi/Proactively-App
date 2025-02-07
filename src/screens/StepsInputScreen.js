import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { setItem } from '../services/storageService';

export default function StepsInputScreen({ navigation }) {
  const [steps, setSteps] = useState('');

  const handleSave = async () => {
    const val = parseInt(steps, 10);
    if (!isNaN(val) && val >= 0) {
      await setItem('steps', val);
      navigation.goBack();
    } else {
      alert('Enter a valid number of steps');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Steps count:</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="e.g. 14225"
          placeholderTextColor="#999"
          keyboardType="numeric"
          value={steps}
          onChangeText={setSteps}
        />
        <Text style={styles.unit}>steps</Text>
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
    backgroundColor: '#fff',
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
    marginBottom: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 32,
    color: '#000',
    fontWeight: '600',
    marginRight: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  unit: {
    fontSize: 16,
    color: '#888',
    // fontFamily: 'Inter-Regular',
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
    // fontFamily: 'Inter-SemiBold',
  },
});
