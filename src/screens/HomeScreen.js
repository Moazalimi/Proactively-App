import React, { useCallback, useState } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Image, 
  Text, 
  TouchableOpacity, 
  RefreshControl
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native'; 
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import HealthScoreBanner from '../components/HealthScoreBanner'; 

import AppointmentCard from '../components/AppointmentCard'; 

import ToDoList from '../components/ToDoList';

import { getItem } from '../services/storageService';
import { getCurrentUser } from '../services/authService';
import { hasUnseenNotifications } from '../services/notificationService'; 

export default function HomeScreen({ navigation }) {
  const [bmi, setBmi] = useState(null);
  const [steps, setSteps] = useState(null);
  const [sleep, setSleep] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [unseenNotifs, setUnseenNotifs] = useState(false);

  const loadData = useCallback(async () => {
    const user = await getCurrentUser();
  
    if (user) {
      const userAppointment = await getItem(`appointment_${user.username}`);
      console.log('Fetched appointment for user:', user.username, userAppointment);
      setAppointment(userAppointment); // Correctly set user-specific appointment
    } else {
      setAppointment(null); // Clear if no user is logged in
    }
  
    const savedBmi = await getItem('bmi');
    const savedSteps = await getItem('steps');
    const savedSleep = await getItem('sleep');
    const notifStatus = await hasUnseenNotifications();
  
    setBmi(savedBmi);
    setSteps(savedSteps);
    setSleep(savedSleep);
    setCurrentUser(user);
    setUnseenNotifs(notifStatus);
  }, []);
  


  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );


  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const healthScore = calculateHealthScore(bmi, steps, sleep);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh} 
          tintColor="#000" 
          colors={['#000']}
        />
      }
    >
      {/* Gradient Header */}
      <LinearGradient
        colors={['#3D53B6', '#3D53B6']}
        style={styles.headerContainer}
      >
        <View style={styles.topRow}>
          <View style={styles.userInfo}>
            {currentUser?.photoUri ? (
              <Image source={{ uri: currentUser.photoUri }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder} />
            )}
            <Text style={styles.userName}>{currentUser?.name || 'User'}</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={styles.bellContainer}>
            <Ionicons name="notifications-outline" size={24} color="#fff" />
            {unseenNotifs && <View style={styles.redDot} />}
          </TouchableOpacity>
        </View>

        <Text style={styles.healthScoreLabel}>Health Score</Text>
        <Text style={styles.healthScoreValue}>{healthScore}</Text>
        <Text style={styles.healthScoreNote}>This score is for information purposes only.</Text>

        <HealthScoreBanner score={healthScore} />
      </LinearGradient>

      <View 
      style={styles.contentContainer}>
        {/* Appointment Card Section */}
        {appointment ? (
    <AppointmentCard
      appointment={appointment}
      onPress={() => navigation.navigate('AppointmentDetails', { appointment })}
      style={styles.appointmentCard}
    />
  ) : (
    <TouchableOpacity 
      style={styles.setAppointmentButton} 
      onPress={() => navigation.navigate('SetAppointment')}
    >
      <Text style={styles.setAppointmentText}>Set an Appointment</Text>
    </TouchableOpacity>
  )}

        {/* Health Overview */}
        <Text style={styles.sectionTitle}>Health Overview</Text>
        <ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.horizontalOverviewContainer}
>
  {/* Steps */}
  <TouchableOpacity
    style={[styles.overviewCard, steps ? styles.stepsCardFilled : styles.cardEmpty]}
    onPress={() => navigation.navigate('StepsInput')}
  >
    <Text style={styles.cardTitle}>Steps</Text>
    <Text style={styles.cardStatus}>{steps ? 'Synced today' : 'No data'}</Text>
    <Text style={[styles.cardValue, steps ? styles.stepsValueFilled : styles.valueEmpty]}>
      {steps ? steps.toLocaleString() : '-'}
    </Text>
  </TouchableOpacity>

  {/* BMI */}
  <TouchableOpacity
    style={[styles.overviewCard, bmi ? styles.bmiCardFilled : styles.cardEmpty]}
    onPress={() => navigation.navigate('BmiInput')}
  >
    <Text style={styles.cardTitle}>BMI</Text>
    <Text style={styles.cardStatus}>{bmi ? 'Updated' : 'No data'}</Text>
    <Text style={[styles.cardValue, bmi ? styles.bmiValueFilled : styles.valueEmpty]}>
      {bmi ? `${parseFloat(bmi).toFixed(2)} kg/m²` : '-'}
    </Text>
  </TouchableOpacity>

  {/* Sleep */}
  <TouchableOpacity
    style={[styles.overviewCard, sleep ? styles.sleepCardFilled : styles.cardEmpty]}
    onPress={() => navigation.navigate('SleepInput')}
  >
    <Text style={styles.cardTitle}>Sleep</Text>
    <Text style={styles.cardStatus}>{sleep ? 'Updated' : 'No data'}</Text>
    <Text style={[styles.cardValue, sleep ? styles.sleepValueFilled : styles.valueEmpty]}>
      {sleep ? `${sleep} hrs` : '-'}
    </Text>
  </TouchableOpacity>
</ScrollView>


{/* Divider */}
<View style={styles.divider} />

        {/* ToDo List */}
<View style={{ marginTop: -10 }}>
  <ToDoList appointment={appointment} /> {/* Pass appointment prop here */}
</View>

      </View>
    </ScrollView>
  );
}

function calculateHealthScore(bmi, steps, sleep) {
  let score = 0;

  // BMI scoring
  if (bmi >= 18.5 && bmi <= 24.9) {
    score += 1000; // Healthy BMI gets full score
  } else if (bmi < 18.5 || bmi > 24.9) {
    // Underweight or Obese
    const bmiDifference = Math.abs(22 - bmi); // Distance from the center of the healthy range
    const bmiScore = Math.max(1000 - bmiDifference * 200, 200); // Decrease by 200 points for each unit difference
    score += Math.min(Math.round(bmiScore), 1000); // Cap score to a max of 1000 and round off
  }

  // Steps scoring
  const stepsScore = Math.min(Math.round(steps / 1000) * 200, 1000); // 200 points per 1000 steps, capped at 1000
  score += stepsScore;

  // Sleep scoring
  if (sleep > 7) {
    score += 1000; // Full score for sleep > 7 hours
  } else {
    const sleepScore = Math.min(Math.round(sleep * 100), 1000); // 100 points per hour, capped at 1000
    score += sleepScore;
  }

  return Math.min(Math.round(score), 3000); // Ensure total score is capped at 3000 and round off
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems:'center',
  },
  profileImage: {
    width:50,
    height:50,
    borderRadius:25,
    marginRight:8
  },
  profilePlaceholder: {
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor:'#ccc',
    marginRight:8
  },
  userName: {
    fontSize:16,
    fontFamily:'Inter-SemiBold',
    color:'#fff',
    textAlign: 'center',
    flex: 0.9,
  },

  bellContainer: {
    marginLeft:'auto',
    position:'relative'
  },
  redDot: {
    width:8,
    height:8,
    borderRadius:4,
    backgroundColor:'red',
    position:'absolute',
    top:-2,
    right:-2
  },
  healthScoreLabel: {
    color:'#fff',
    marginTop:20,
    fontSize:16,
    fontFamily:'Inter-SemiBold'
  },
  healthScoreValue: {
    fontSize:32,
    fontFamily:'Inter-Bold',
    color:'#fff',
    marginVertical:5,
  },
  healthScoreNote: {
    color:'#EEE',
    fontSize:14,
    fontFamily:'Inter-Regular',
    marginBottom:20
  },
  contentContainer: {
    marginTop: -50,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  setAppointmentButton: {
    backgroundColor: '#3D53B6',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  setAppointmentText: {
    color: '#FFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily:'Inter_600SemiBold',
    fontWeight: '600',
    color: '#555',
    marginBottom: 16,
  },

  horizontalOverviewContainer: {
    paddingHorizontal: 1, 
    flexDirection: 'row',
    alignItems: 'center',
  },

  overviewCards: {
    flexDirection:'row',
    justifyContent:'space-between'
  },
  overviewCard: {
    flex: 1,
    borderRadius: 12,
    padding: 15,
    marginRight: 10, 
    width: 150, 
    height: 150,
  },
  cardTitle: {
    fontSize:14,
    fontFamily:'Inter_600SemiBold',
    color:'#000',
    marginBottom:4
  },
  cardStatus: {
    fontSize:12,
    fontFamily:'Inter-Regular',
    color:'#888',
    marginBottom:8
  },
  cardValue: {
    fontSize:24,
    fontFamily:'Inter-SemiBold',
  },
  valueEmpty: {
    color:'#BCC1C7'
  },
  cardEmpty: {
    backgroundColor:'#F5F7FA',
  },
  stepsCardFilled: {
    backgroundColor:'#E3EDFF',
  },
  stepsValueFilled: {
    color:'#3A6CFB'
  },
  bmiCardFilled: {
    backgroundColor:'#FFF7E5',
  },
  bmiValueFilled: {
    color:'#95C93D'
  },
  sleepCardFilled: {
    backgroundColor:'#FFEAD6',
  },
  sleepValueFilled: {
    color:'#EDA66B'
  },

  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    marginVertical: 10,
    marginTop: 30,
  },
});
