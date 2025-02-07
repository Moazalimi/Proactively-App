import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { login } from '../services/authService';
import adaptiveIcon from '../assets/adaptive-icon.png'; // Updated from require to import

SplashScreen.preventAutoHideAsync();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Load the Inter font
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Show nothing or a fallback UI while fonts are loading
  }

  const handleLogin = async () => {
    const success = await login(email, password);
    if (success) {
      navigation.replace('Main');
    } else {
      alert('Invalid credentials. If you haven’t signed up yet, please do so.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to</Text>
      <View style={styles.brandContainer}>
        <Text style={styles.brand}>proactively</Text>
        {/* Render SVG using react-native-svg */}
        <Svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <Path d="M6.56259 21.8151L22.826 10.8381L15.5051 5.80997L0.0650182 21.7406L6.56259 21.8151Z" fill="#7BA3E1" />
          <Path d="M7.34643 0L23 10.8134L15.9608 15.5528L0.979858 0H7.34643Z" fill="#2A6DD2" />
        </Svg>
      </View>
      <Text style={styles.subtitle}>Login as a patient using your registered email.</Text>

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
          style={[styles.input, { paddingRight: 40 }]}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          value={password}
        />
        <TouchableOpacity
          style={styles.eyeIconContainer}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Image 
            source={adaptiveIcon} // Updated to use static import
            style={styles.eyeIcon} 
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <TouchableOpacity
        style={styles.signupContainer}
        onPress={() => navigation.navigate('Signup')}
      >
        <Text style={styles.signupText}>
          Don’t have an account? <Text style={styles.signupLink}>Sign Up</Text>
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
    marginBottom: 0,
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
    position: 'relative',
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
  eyeIconContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
  },
  loginButton: {
    backgroundColor: '#4384E6',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  signupContainer: {
    marginTop: 20,
    alignSelf: 'center',
  },
  signupText: {
    fontSize: 14,
    color: '#555',
  },
  signupLink: {
    color: '#2979FF',
    fontWeight: '600',
  },
});
