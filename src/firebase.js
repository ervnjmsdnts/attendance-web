import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyC6iSY1gycVCVZ2m02dv7phNhGudR3Ak2k',
  authDomain: 'attendance-1d3ec.firebaseapp.com',
  projectId: 'attendance-1d3ec',
  storageBucket: 'attendance-1d3ec.appspot.com',
  messagingSenderId: '590472731541',
  appId: '1:590472731541:web:6ab6332e1bb1f3dbb2b49c',
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
