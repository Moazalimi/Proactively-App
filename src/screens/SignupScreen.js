import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { registerUser } from '../services/authService';


export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState(null);

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
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !name) {
      alert('Please fill all fields.');
      return;
    }
  
    try {
      await registerUser({
        username: email, // Using email as the username
        password,
        name,
        photoUri,
      });
      alert('Signup successful!');
      navigation.navigate('Login');
    } catch (error) {
      alert(error.message); // Show relevant error messages
    }
  };
  

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up to</Text>
      <View style={styles.brandContainer}>
        <Text style={styles.brand}>proactively</Text>
        <Svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M6.56259 21.8151L22.826 10.8381L15.5051 5.80997L0.0650182 21.7406L6.56259 21.8151Z" fill="#7BA3E1" />
          <Path d="M7.34643 0L23 10.8134L15.9608 15.5528L0.979858 0H7.34643Z" fill="#2A6DD2" />
        </Svg>
      </View>
      <Text style={styles.subtitle}>Sign up to get started with Proactively.</Text>

      {/* Full Name Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#999"
          onChangeText={setName}
          value={name}
        />
      </View>

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={setEmail}
          value={email}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          onChangeText={setPassword}
          value={password}
        />
      </View>

      {/* Profile Picture Upload */}
      <View style={styles.photoContainer}>
        <TouchableOpacity style={styles.photoUploadButton} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoPreview} />
          ) : (
            <Text style={styles.photoUploadText}>Upload Profile Photo</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
        <Text style={styles.signupButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Login Link */}
      <TouchableOpacity
        style={styles.loginContainer}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Login</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
    color: '#222222',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 33,
    color: '#2A6DD2',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    color: '#707070',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
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
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  photoUploadButton: {
    backgroundColor: '#F0F0F0',
    borderRadius: 100,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    overflow: 'hidden',
  },
  photoUploadText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
  },
  photoPreview: {
    width: '100%',
    height: '100%',
  },
  signupButton: {
    backgroundColor: '#4384E6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  loginContainer: {
    marginTop: 20,
    alignSelf: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#555',
  },
  loginLink: {
    color: '#2979FF',
    fontWeight: '600',
  },
});
