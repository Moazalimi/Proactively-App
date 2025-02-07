import React from 'react';
import { View, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import splashForeground from '../assets/splash_foreground.png';

export default function CustomSplash() {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#204CBB', '#00AB9A']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        <Image
          source={splashForeground}
          style={styles.foregroundImage}
          resizeMode="contain"
        />
        <ActivityIndicator style={{ marginTop: 20 }} color="#fff" />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  foregroundImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
