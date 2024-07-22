import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProjectScreen from '../screens/ProjectScreen';
import TeamCollaborationScreen from '../screens/TeamCollaborationScreen';
import CRMCustomerScreen from '../screens/CRMCustomerScreen';
import SalesPerformanceScreen from '../screens/SalesPerformanceScreen';
import SalesReportScreen from '../screens/SalesReportScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgetScreen from '../screens/ForgetScreen';
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Dashboard':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Project Details':
            iconName = focused ? 'clipboard' : 'clipboard-outline';
            break;
          case 'Team Collaboration':
            iconName = focused ? 'people' : 'people-outline';
            break;
          case 'CRM':
            iconName = focused ? 'person' : 'person-outline';
            break;
          case 'Sales Performance':
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
            break;
          default:
            iconName = 'home';
        }

    
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Project Details" component={ProjectScreen} />
    <Tab.Screen name="Team Collaboration" component={TeamCollaborationScreen} />
    <Tab.Screen name="CRM" component={CRMCustomerScreen} />
    <Tab.Screen name="Sales Performance" component={SalesPerformanceScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Forget" component={ForgetScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="SalesReport" component={SalesReportScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
