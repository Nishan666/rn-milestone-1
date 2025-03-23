import { initializeApp } from 'firebase/app';
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
} from 'firebase/firestore';
import { Message } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

export interface Room {
  id: string;
  name: string;
  createdAt?: string;
  createdBy?: string;
}

export class FirebaseService {
  private static instance: FirebaseService;
  private db: Firestore;

  constructor() {
    // Firebase configuration
    const firebaseConfig = {
      apiKey: 'AIzaSyB2WjnyfE7PK8ZTM4_O5ukAeinCNVozFgE',
      authDomain: 'chat-app-a56fe.firebaseapp.com',
      projectId: 'chat-app-a56fe',
      storageBucket: 'chat-app-a56fe.firebasestorage.app',
      messagingSenderId: '110606577185',
      appId: '1:110606577185:web:baddf6664e8f81a2d07d60',
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    this.db = getFirestore(app);
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
      await addDoc(collection(this.db, 'messages'), {
        id: uuidv4(),
        text: text,
        createdAt: serverTimestamp(),
        localCreatedAt: now.toISOString(),
        userId: userId,
        userName: userName,
        roomId: roomId,
      });
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
}
