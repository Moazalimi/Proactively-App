import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import AccountScreen from '../screens/AccountScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'Home') iconName = 'home';
        else if (route.name === 'Account') iconName = 'person-circle';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#6F47FF', // Active tab color (purple)
      tabBarInactiveTintColor: '#8E8E8E', // Inactive tab color (gray)
      tabBarStyle: {
        backgroundColor: '#FFFFFF', 
        height: 70, 
        paddingTop: 8, 
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
      },
      tabBarLabelStyle: {
        fontSize: 12, // Adjust label font size
        fontWeight: '600', // Label weight for better visibility
      },
      headerShown: false,
    })}
    
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Account" component={AccountScreen} />
    </Tab.Navigator>
  );
}
