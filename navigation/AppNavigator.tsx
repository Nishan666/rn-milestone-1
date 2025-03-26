import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import DrawerContent from '../components/DrawerContent';
import ImageUploadScreen from '../screens/ImageUploadScreen';
import GetStartedScreen from '../screens/GetStartedScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { clearUser, setUser } from '../store/slices/authSlice';
import { FirebaseService } from '../services/FirebaseService';
import { ActivityIndicator, View } from 'react-native';
import { saveProfile } from '../store/slices/profileSlice';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#4CAF50' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontFamily: 'Poppins-Medium' },
};

const MenuButton = ({ navigation }: { navigation: any }) => (
  <Ionicons
    name="menu"
    size={24}
    color="#fff"
    style={{ marginLeft: 15 }}
    onPress={() => navigation.openDrawer()}
  />
);

const HomeStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen
      component={HomeScreen}
      name="Home"
      options={({ navigation }) => ({
        headerLeft: () => <MenuButton navigation={navigation} />,
      })}></Stack.Screen>
  </Stack.Navigator>
);

const ProfileStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen
      component={ProfileScreen}
      name="Profile"
      options={({ navigation }) => ({
        headerLeft: () => <MenuButton navigation={navigation} />,
      })}></Stack.Screen>
  </Stack.Navigator>
);

const SettingsStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={({ navigation }) => ({ headerLeft: () => <MenuButton navigation={navigation} /> })}
    />
  </Stack.Navigator>
);

const AboutStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen
      name="About"
      component={AboutScreen}
      options={({ navigation }) => ({ headerLeft: () => <MenuButton navigation={navigation} /> })}
    />
  </Stack.Navigator>
);

const ImageUploadStack = () => (
  <Stack.Navigator screenOptions={screenOptions}>
    <Stack.Screen
      name="Image-Upload"
      component={ImageUploadScreen}
      options={({ navigation }) => ({ headerLeft: () => <MenuButton navigation={navigation} /> })}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    const auth = FirebaseService.getInstance().getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      console.log('User:', currentUser);
      if (currentUser) {
        const userData = {
          uid: currentUser.uid,
          email: currentUser.email,
        };
        dispatch(setUser(userData));
        if (currentUser.email) {
            dispatch(saveProfile({ email: currentUser.email, nickname: '' }) as any);
        }
      } else {
        dispatch(clearUser());
      }
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!authUser ? (
        <Stack.Navigator
          initialRouteName="GetStarted"
          screenOptions={{
            ...screenOptions,
            headerShown: false,
          }}>
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      ) : (
        <Drawer.Navigator
          drawerContent={props => <DrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerActiveTintColor: '#4CAF50',
            drawerInactiveTintColor: '#333',
            drawerLabelStyle: {
              fontFamily: 'Poppins-Regular',
              marginLeft: -10,
              paddingTop: 2,
            },
            drawerItemStyle: { justifyContent: 'center' },
          }}>
          <Drawer.Screen
            name="HomeStack"
            component={HomeStack}
            options={{
              title: 'Home',
              drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
            }}
          />

          <Drawer.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={{
              title: 'Profile',
              drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
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

          <Drawer.Screen
            name="ImageUploadStack"
            component={ImageUploadStack}
            options={{
              title: 'Upload',
              drawerIcon: ({ color }) => (
                <Ionicons name="cloud-upload-outline" size={22} color={color} />
              ),
            }}
          />
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
