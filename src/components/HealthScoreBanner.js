import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
export default function HealthScoreBanner({ score }) {
  
  const arrowPosition = Math.min((score / 3000) * 100, 100); 
  const getArrowColor = () => {
    if (score < 1500) return '#FF8090'; 
    if (score < 2500) return '#FFDA68'; 
    return '#75DE8D';
  };

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View style={styles.barContainer}>
        <View style={styles.barBackground}>
          {/* Gradient for the progress bar */}
          <LinearGradient
            colors={['#FF8090', '#FFDA68', '#75DE8D']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </View>
        {/* Arrow Indicator */}
        <Ionicons
          name="caret-down" 
          size={30}
          color={getArrowColor()} 
          style={[
            styles.arrowIndicator,
            {
              left: `${arrowPosition}%`,
              transform: [
                { translateX: -30 },  
              ],
            },
          ]}
        />
      </View>

      {/* Labels for progress and score */}
      <View style={styles.labelsContainer}>
        {[0, 600, 1200, 1800, 2400, 3000].map((value) => (
          <Text key={value} style={styles.label}>
            {value} {/* Numeric labels */}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'center', 
  },
  barContainer: {
    width: '100%', 
    position: 'relative', 
    alignItems: 'center',
  },
  barBackground: {
    width: '100%', 
    height: 20,
    borderRadius: 10, 
    backgroundColor: '#EEE', 
    overflow: 'hidden', 
  },
  gradient: {
    flex: 1,
  },
  arrowIndicator: {
    position: 'absolute',
    top: -25, 
    zIndex: 2, 
  },
  labelsContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginTop: 15, 
    marginBottom: 25,
  },
  label: {
    fontSize: 12, 
    color: '#C2D3FF', 
    fontWeight: 500,
  },
});
