import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import DrawerContent from '../components/DrawerContent';
import { getEnvironment } from '../utils/environment';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack navigator for each main section
const HomeStack = () => {
  const { environment } = getEnvironment();
  
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'Poppins-Medium',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation }) => ({
          title: `Home`,
          headerLeft: () => (
            <Ionicons 
              name="menu" 
              size={24} 
              color="#fff" 
              style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'Poppins-Medium',
        },
      }}
    >
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={({ navigation }) => ({
          headerLeft: () => (
            <Ionicons 
              name="menu" 
              size={24} 
              color="#fff" 
              style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'Poppins-Medium',
        },
      }}
    >
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={({ navigation }) => ({
          headerLeft: () => (
            <Ionicons 
              name="menu" 
              size={24} 
              color="#fff" 
              style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const AboutStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#4CAF50',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'Poppins-Medium',
        },
      }}
    >
      <Stack.Screen 
        name="About" 
        component={AboutScreen} 
        options={({ navigation }) => ({
          headerLeft: () => (
            <Ionicons 
              name="menu" 
              size={24} 
              color="#fff" 
              style={{ marginLeft: 15 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        })}
      />
    </Stack.Navigator>
  );
};

// Main drawer navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <DrawerContent {...props} />}
        screenOptions={{
          headerShown: false,
          drawerActiveTintColor: '#4CAF50',
          drawerInactiveTintColor: '#333',
          drawerLabelStyle: {
            fontFamily: 'Poppins-Regular',
            marginLeft: -10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 2
          },
          drawerItemStyle: {
            justifyContent: 'center', 
          },
        }}
      >
        <Drawer.Screen 
          name="HomeStack" 
          component={HomeStack} 
          options={{
            title: 'Home',
            drawerIcon: ({ color }) => (
              <Ionicons name="home-outline" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="ProfileStack" 
          component={ProfileStack} 
          options={{
            title: 'Profile',
            drawerIcon: ({ color }) => (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="SettingsStack" 
          component={SettingsStack} 
          options={{
            title: 'Settings',
            drawerIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={22} color={color} />
            ),
          }}
        />
        <Drawer.Screen 
          name="AboutStack" 
          component={AboutStack} 
          options={{
            title: 'About',
            drawerIcon: ({ color }) => (
              <Ionicons name="information-circle-outline" size={22} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;