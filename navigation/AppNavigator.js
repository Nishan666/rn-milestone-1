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
import ImageUploadScreen from '../screens/ImageUploadScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// Stack navigator for each main section
const HomeStack = ({ setProfileDetails, profileDetails }) => {
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
      >
        {props => <HomeScreen {...props} setProfileDetails={setProfileDetails} profileDetails={profileDetails} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const ProfileStack = ({ setProfileDetails, profileDetails }) => {
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
      >{props => <ProfileScreen {...props} setProfileDetails={setProfileDetails} profileDetails={profileDetails} />}</Stack.Screen>
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


const ImageUploadStack = () => {
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
        name="Image Upload"
        component={ImageUploadScreen}
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
const AppNavigator = ({ setProfileDetails, profileDetails }) => {
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
          options={{
            title: 'Home',
            drawerIcon: ({ color }) => (
              <Ionicons name="home-outline" size={22} color={color} />
            ),
          }}
        >
          {props => <HomeStack {...props} setProfileDetails={setProfileDetails} profileDetails={profileDetails} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="ProfileStack"
          options={{
            title: 'Profile',
            drawerIcon: ({ color }) => (
              <Ionicons name="person-outline" size={22} color={color} />
            ),
          }}
        >
          {props => <ProfileStack {...props} setProfileDetails={setProfileDetails} profileDetails={profileDetails} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="SettingsStack"
          options={{
            title: 'Settings',
            drawerIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={22} color={color} />
            ),
          }}
        >
          {props => <SettingsStack {...props} />}
        </Drawer.Screen>

        <Drawer.Screen
          name="AboutStack"
          options={{
            title: 'About',
            drawerIcon: ({ color }) => (
              <Ionicons name="information-circle-outline" size={22} color={color} />
            ),
          }}
        >
          {props => <AboutStack {...props} />}
        </Drawer.Screen>
        <Drawer.Screen
          name="ImageUploadStack"
          options={{
            title: 'Upload',
            drawerIcon: ({ color }) => (
              <Ionicons name="information-circle-outline" size={22} color={color} />
            ),
          }}
        >
          {props => <ImageUploadStack {...props} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;