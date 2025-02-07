import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import TabNavigator from './TabNavigator';
import BmiInputScreen from '../screens/BmiInputScreen';
import StepsInputScreen from '../screens/StepsInputScreen';
import SleepInputScreen from '../screens/SleepInputScreen';
import AppointmentDetailsScreen from '../screens/AppointmentDetailsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SetAppointmentScreen from '../screens/SetAppointmentScreen';
import UpdateProfileScreen from '../screens/UpdateProfileScreen';

const Stack = createNativeStackNavigator();

export default function StackNavigator({ initialRoute }) {
  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown:false }} />
      <Stack.Screen name="Signup" component={SignupScreen} options={{ headerShown:false  }}/>
      <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown:false }} />
      <Stack.Screen name="BmiInput" component={BmiInputScreen} options={{ title:'BMI Input' }}/>
      <Stack.Screen name="StepsInput" component={StepsInputScreen} options={{ title:'Steps Entry' }}/>
      <Stack.Screen name="SleepInput" component={SleepInputScreen} options={{ title:'Sleep Entry' }}/>
      <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} options={{ title:'Appointment Details' }}/>
      <Stack.Screen name="SetAppointment" component={SetAppointmentScreen} options={{ title:'Set Appointment' }}/>
      <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ title:'Notifications' }}/>
      <Stack.Screen name="UpdateProfile" component={UpdateProfileScreen} options={{ title: 'Update Profile' }} />

      
    </Stack.Navigator>
  );
}
