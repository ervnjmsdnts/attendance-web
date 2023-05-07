import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { db, storage } from './firebase';

export const signup = async (payload = {}) => {
  let image = null;
  const userRef = collection(db, 'users');
  const filterQuery = query(userRef, where('email', '==', payload.email));
  const user = await getDocs(filterQuery);

  if (user.size) return Promise.reject('User already exists');

  if (payload.file) {
    const imageRef = ref(storage, `images/${v4()}`);
    const snapshot = await uploadBytes(imageRef, payload.file);
    const url = await getDownloadURL(snapshot.ref);
    image = url;
  }

  const res = await addDoc(userRef, {
    role: 'PRINCIPAL',
    email: payload.email,
    password: payload.password,
    schoolName: payload.schoolName,
    schoolLogo: image ?? 'https://via.placeholder.com/150',
  });

  return res;
};

export const login = async (payload = {}) => {
  const conditions = [
    where('email', '==', payload.email),
    where('password', '==', payload.password),
  ];
  const userRef = collection(db, 'users');
  const filterQuery = query(userRef, ...conditions);
  const user = await getDocs(filterQuery);
  if (!user.size) return Promise.reject('Invalid credentials');

  return { id: user.docs[0].id, ...user.docs[0].data() };
};

export const addTeacher = async (payload = {}) => {
  const userRef = collection(db, 'users');
  const filterQuery = query(userRef, where('email', '==', payload.email));
  const user = await getDocs(filterQuery);

  if (user.size) return Promise.reject('User already exists');

  const res = await addDoc(userRef, {
    role: 'TEACHER',
    email: payload.email,
    password: payload.password,
    name: `${payload.firstName} ${payload.lastName}`,
  });

  return res;
};
