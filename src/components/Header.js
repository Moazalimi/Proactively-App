import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({ name, photoUri, onNotificationPress }) {
  return (
    <View style={styles.header}>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.profileImage} />
      ) : (
        <View style={styles.profilePlaceholder} />
      )}
      <Text style={styles.headerText}>{name}</Text>
      <TouchableOpacity onPress={onNotificationPress} style={styles.bellContainer}>
        <Ionicons name="notifications-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  profilePlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ccc',
    marginRight: 8,
  },
  headerText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  bellContainer: {
    marginLeft: 'auto',
  },
});
