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
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { clearUser, setUser } from '../store/slices/authSlice';

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
      name="Image Upload"
      component={ImageUploadScreen}
      options={({ navigation }) => ({ headerLeft: () => <MenuButton navigation={navigation} /> })}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {

  //
  // const dispatch = useDispatch();
  // const user = useSelector((state: RootState) => state.auth.user);
  // const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       dispatch(setUser({
  //         uid: user.uid,
  //         email: user.email,
  //       }));
  //     } else {
  //       dispatch(clearUser());
  //     }
  //     setLoading(false);
  //   });

  //   return unsubscribe; // Unsubscribe on unmount
  // }, []);


  // 



  return (
    <NavigationContainer>
      {true ? (
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
