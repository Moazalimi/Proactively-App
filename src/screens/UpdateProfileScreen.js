import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getCurrentUser, updateCurrentUser } from '../services/authService';
import * as ImagePicker from 'expo-image-picker';

export default function UpdateProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [tempName, setTempName] = useState('');
  const [tempPhotoUri, setTempPhotoUri] = useState(null);

  useEffect(() => {
    (async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setTempName(currentUser?.name || '');
      setTempPhotoUri(currentUser?.photoUri || null);
    })();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission for photo access is required.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setTempPhotoUri(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    await updateCurrentUser({ name: tempName, photoUri: tempPhotoUri });
    alert('Profile updated!');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Change Profile Picture</Text>

      {/* Profile Picture */}
      <View style={styles.photoContainer}>
        <TouchableOpacity style={styles.photoUploadButton} onPress={pickImage}>
          {tempPhotoUri ? (
            <Image source={{ uri: tempPhotoUri }} style={styles.photoPreview} />
          ) : (
            <View style={styles.iconContainer}>
              <MaterialIcons name="photo-camera" size={30} color="#999" />
              <Text style={styles.photoUploadText}>Update Profile Picture</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Change Your Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your Name"
          value={tempName}
          onChangeText={setTempName}
        />
      </View>

      {/* Save Changes Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 20,
    color: '#222',
    textAlign: 'center',
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  photoUploadButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    overflow: 'hidden',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoUploadText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#4384E6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});
