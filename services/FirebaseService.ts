import 'react-native-get-random-values'; 
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
  where,
  Firestore,
  DocumentData,
  QueryDocumentSnapshot,
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from 'firebase/firestore';
import messaging from "@react-native-firebase/messaging";
import { v4 as uuidv4 } from 'uuid';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCredential,
  User,
  GoogleAuthProvider,
  initializeAuth,
} from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as firebaseAuth from 'firebase/auth';
import { Message } from '../models/types';
const reactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

export interface Room {
  id: string;
  name: string;
  createdAt?: string;
  createdBy?: string;
  participants?: string[]
}

export interface RoomParticipant {
  userId: string;
  email: string;
  fcmToken: string;
  lastEnteredAt: string;
}

export class FirebaseService {
  private static instance: FirebaseService;
  private app: FirebaseApp;
  private db: Firestore;
  private auth: Auth;
  private messaging: any

  constructor() {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: 'AIzaSyBPBVAv7IUXF3SsCT45HFWpWke1DHGx6zE',
      authDomain: 'chat-app-a56fe.firebaseapp.com',
      projectId: 'chat-app-a56fe',
      storageBucket: 'chat-app-a56fe.firebasestorage.app',
      messagingSenderId: '110606577185',
      appId: '1:110606577185:android:38b1ed15025c4b94d07d60',
    };

    // Initialize Firebase
    if (!getApps().length) {
      this.app = initializeApp(firebaseConfig);
      this.auth = initializeAuth(this.app, {
        persistence: reactNativePersistence(AsyncStorage),
      });
      this.db = getFirestore(this.app);

      GoogleSignin.configure({
        webClientId: "110606577185-erum5uskhbrf59ss72uh01tko2nliac1.apps.googleusercontent.com",
        offlineAccess: true,
      });
    } else {
      this.app = getApps()[0];
      this.auth = firebaseAuth.getAuth();
      this.db = getFirestore();
    }
  }

  // Singleton pattern to ensure only one instance of the service exists
  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  // Room-related methods
  async fetchRooms(): Promise<Room[]> {
    try {
      const roomsCollection = collection(this.db, 'rooms');
      const roomsQuery = query(roomsCollection, orderBy('createdAt', 'desc'));
      const roomsSnapshot = await getDocs(roomsQuery);

      return roomsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name || 'Unnamed Room',
        createdAt: doc.data().createdAt,
        createdBy: doc.data().createdBy,
      }));
    } catch (error) {
      console.error('Error fetching rooms:', error);
      throw error;
    }
  }

  async createRoom(roomName: string, nickname: string): Promise<Room> {
    try {
      const roomRef = await addDoc(collection(this.db, 'rooms'), {
        name: roomName,
        createdAt: new Date().toISOString(),
        createdBy: nickname,
      });

      return {
        id: roomRef.id,
        name: roomName,
        createdAt: new Date().toISOString(),
        createdBy: nickname,
      };
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  }

  // Message-related methods
  listenToMessages(
    roomId: string,
    callback: (messages: Message[]) => void,
    onError: (error: any) => void,
    includeWelcomeMessage: boolean = false,
    roomName?: string,
    userNickname?: string,
  ) {
    // Create a reference to the messages collection
    const messagesRef = collection(this.db, 'messages');

    // Create a query against the collection
    const q = query(messagesRef, where('roomId', '==', roomId), orderBy('createdAt', 'desc'));

    // Listen for real-time updates
    return onSnapshot(
      q,
      querySnapshot => {
        const messagesFirestore = querySnapshot.docs.map(doc => this.convertToMessage(doc));
        const now = new Date();
        // Add welcome message if requested and no messages exist
        if (includeWelcomeMessage && messagesFirestore.length === 0 && roomName && userNickname) {
          messagesFirestore.push({
            id: uuidv4(),
            text: `Welcome to the "${roomName}" room, ${userNickname}!`,
            createdAt: new Date(),
            localCreatedAt: now.toISOString(),
            userId: 'system',
            userName: 'System',
            roomId: roomId,
          });
        }

        callback(messagesFirestore);
      },
      onError,
    );
  }

  async sendMessage(text: string, userId: string, userName: string, roomId: string): Promise<void> {
    try {
      const now = new Date();

      // Add new message to Firestore
      // Add new message to Firestore
      const messageRef = await addDoc(collection(this.db, 'messages'), {
        id: uuidv4(),
        text: text,
        createdAt: serverTimestamp(),
        localCreatedAt: now.toISOString(),
        userId: userId,
        userName: userName,
        roomId: roomId,
      });

      // Send push notifications to room participants
      await this.sendPushNotificationToRoomParticipants(
        roomId, 
        userId, 
        userName, 
        text
      );
    } catch (error) {
      console.error('Error sending message: ', error);
      throw error;
    }
  }

  // Helper method to convert Firestore document to Message object
  private convertToMessage(doc: QueryDocumentSnapshot<DocumentData>): Message {
    const data = doc.data();

    // Handle timestamp that might be null or missing
    let createdAtDate = new Date();
    if (data.createdAt instanceof Timestamp) {
      createdAtDate = data.createdAt.toDate();
    } else if (data.createdAt) {
      createdAtDate = new Date(data.createdAt);
    }

    return {
      id: doc.id,
      text: data.text || '',
      createdAt: createdAtDate,
      userId: data.userId || 'unknown',
      userName: data.userName || 'Anonymous',
      roomId: data.roomId,
    } as Message;
  }

  // auth
  async signUp(email: string, password: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Signup Error:', error);

      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already registered');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak');
      }

      throw error;
    }
  }

  // Email/Password Login
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Login Error:', error);

      // Handle specific Firebase auth errors
      if (error.code === 'auth/user-not-found') {
        throw new Error('No user found with this email');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Incorrect password');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      }

      throw error;
    }
  }

  // Google Sign-In
  async signInWithGoogle(): Promise<User> {
    try {
      // Perform Google Sign-In
      await GoogleSignin.hasPlayServices();
      const { data } = await GoogleSignin.signIn();

      // Create a Google credential with the tokens
      const credential = GoogleAuthProvider.credential(data?.idToken);

      // Sign in with credential
      const userCredential = await signInWithCredential(this.auth, credential);

      return userCredential.user;
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);

      // Handle specific Google Sign-In errors
      if (error.code === 'auth/invalid-credential') {
        throw new Error('Invalid Google credentials');
      }

      throw error;
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      // Sign out from Firebase
      await this.auth.signOut();

      // If using Google Sign-In, also sign out from Google
      await GoogleSignin.signOut();
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  }

  // Get Current User
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  getAuthInstance(): Auth {
    return this.auth;
  }

  getFirestoreInstance(): Firestore {
    return this.db;
  }

  subscribeToAuthState(callback: (user: any) => void) {
    return firebaseAuth.onAuthStateChanged(this.auth, callback);
  }


  //notifications
  async saveUserFCMTokenForRoom(roomId: string, userId: string, email: string, fcmToken: string): Promise<void> {
    try {
      const participantRef = doc(this.db, 'rooms', roomId, 'participants', userId);
      await setDoc(participantRef, {
        userId,
        email,
        fcmToken,
        lastEnteredAt: new Date().toISOString()
      }, { merge: true });

      // Update room's participants list
      const roomRef = doc(this.db, 'rooms', roomId);
      await updateDoc(roomRef, {
        participants: Array.from(new Set([...(await this.getRoomParticipants(roomId)), email]))
      });
    } catch (error) {
      console.error('Error saving FCM token:', error);
      throw error;
    }
  }

  // Get room participants
  async getRoomParticipants(roomId: string): Promise<string[]> {
    try {
      const roomDoc = await getDoc(doc(this.db, 'rooms', roomId));
      return roomDoc.data()?.participants || [];
    } catch (error) {
      console.error('Error getting room participants:', error);
      return [];
    }
  }

  // Send push notification to room participants
  async sendPushNotificationToRoomParticipants(
    roomId: string, 
    senderId: string, 
    senderName: string, 
    messageText: string
  ): Promise<void> {
    try {
      // Get participants for this room
      const participantsCollection = collection(this.db, 'rooms', roomId, 'participants');
      const participantsSnapshot = await getDocs(participantsCollection);

      // Prepare notification payload
      const notificationPayload = {
        notification: {
          title: `New message in ${senderName}`,
          body: messageText,
        },
        data: {
          roomId,
          senderId,
          messageText
        }
      };

      // Send notifications to each participant (excluding sender)
      const notificationPromises = participantsSnapshot.docs
        .filter(doc => doc.id !== senderId)
        .map(async (participantDoc) => {
          const participantData = participantDoc.data();
          
          // Here you would typically use a server-side solution or cloud function 
          // to send FCM tokens. This is a simplified client-side approach.
          if (participantData.fcmToken) {
            try {
                await this.messaging().sendMessage({
                ...notificationPayload,
                token: participantData.fcmToken
                } as any);
            } catch (error) {
              console.error('Error sending notification to participant:', error);
            }
          }
        });

      await Promise.all(notificationPromises);
    } catch (error) {
      console.error('Error sending push notifications:', error);
    }
  }

  async requestFCMToken(): Promise<string | null> {
    try {
      // const token = await getToken(this.messaging)
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcmToken', token);
      }
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }
}
