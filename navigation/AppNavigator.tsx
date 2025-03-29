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
import { clearUser, setUser } from '../store/slices/authSlice';
import { FirebaseService } from '../services/FirebaseService';
import { ActivityIndicator, View } from 'react-native';
import { saveProfile } from '../store/slices/profileSlice';
import { useSettingsViewModel } from '../viewModels/useSettingsViewModel';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: '#4CAF50' },
  headerTintColor: '#fff',
  headerTitleStyle: { fontFamily: 'Poppins-Medium' },
};

const MenuButton = ({ navigation }: { navigation: any }) => {
  const { theme } = useSettingsViewModel();
  const isDark = theme === 'dark';

  return (
    <Ionicons
      name="menu"
      size={24}
      color="#fff"
      style={{ marginLeft: 15 }}
      onPress={() => navigation.openDrawer()}
    />
  );
};

const HomeStack = () => {
  const { t } = useSettingsViewModel();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        component={HomeScreen}
        name="Home"
        options={({ navigation }) => ({
          title: t('home'),
          headerLeft: () => <MenuButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};

const ProfileStack = () => {
  const { t } = useSettingsViewModel();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        component={ProfileScreen}
        name="Profile"
        options={({ navigation }) => ({
          title: t('profile'),
          headerLeft: () => <MenuButton navigation={navigation} />,
        })}
      />
    </Stack.Navigator>
  );
};

const SettingsStack = () => {
  const { t } = useSettingsViewModel();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({ navigation }) => ({
          title: t('settings'),
          headerLeft: () => <MenuButton navigation={navigation} />
        })}
      />
    </Stack.Navigator>
  );
};
const AboutStack = () => {
  const { t } = useSettingsViewModel();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={({ navigation }) => ({
          title: t('about'),
          headerLeft: () => <MenuButton navigation={navigation} />
        })}
      />
    </Stack.Navigator>
  );
};

const ImageUploadStack = () => {
  const { t } = useSettingsViewModel();

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen
        name="Image-Upload"
        component={ImageUploadScreen}
        options={({ navigation }) => ({
          title: t('upload'),
          headerLeft: () => <MenuButton navigation={navigation} />
        })}
      />
    </Stack.Navigator>
  );
};

// Add this before the AppNavigator component
// Update your theme definitions
const lightTheme = {
  dark: false,
  colors: {
    primary: '#4CAF50',
    background: '#FFFFFF',
    card: '#FFFFFF',
    text: '#333333',
    border: '#E0E0E0',
    notification: '#FF9800',
  },
  fonts: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins-Thin',
      fontWeight: 'normal',
    },
  }
};

const darkTheme = {
  dark: true,
  colors: {
    primary: '#6FCF76',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    border: '#333333',
    notification: '#FF9800',
  },
  fonts: {
    regular: {
      fontFamily: 'Poppins-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Poppins-Thin',
      fontWeight: 'normal',
    },
  }
};

const AppNavigator = () => {
  const { theme, t } = useSettingsViewModel();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth.user);
  useEffect(() => {
    const authService = FirebaseService.getInstance();
    const unsubscribe = authService.subscribeToAuthState(currentUser => {
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
    <NavigationContainer theme={isDark ? darkTheme : lightTheme}>
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
            drawerActiveTintColor: isDark ? '#6FCF76' : '#4CAF50',
            drawerInactiveTintColor: isDark ? '#e0e0e0' : '#333',
            drawerStyle: {
              backgroundColor: isDark ? '#121212' : '#fff',
            },
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
              title: t('home'),
              drawerIcon: ({ color }) => <Ionicons name="home-outline" size={22} color={color} />,
            }}
          />

          <Drawer.Screen
            name="ProfileStack"
            component={ProfileStack}
            options={{
              title: t('profile'),
              drawerIcon: ({ color }) => <Ionicons name="person-outline" size={22} color={color} />,
            }}
          />

          <Drawer.Screen
            name="SettingsStack"
            component={SettingsStack}
            options={{
              title: t('settings'),
              drawerIcon: ({ color }) => (
                <Ionicons name="settings-outline" size={22} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name="AboutStack"
            component={AboutStack}
            options={{
              title: t('about'),
              drawerIcon: ({ color }) => (
                <Ionicons name="information-circle-outline" size={22} color={color} />
              ),
            }}
          />

          <Drawer.Screen
            name="ImageUploadStack"
            component={ImageUploadStack}
            options={{
              title: t('upload'),
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
