import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Message } from './gemini';

const firebaseConfig = (() => {
  const raw = process.env.FIREBASE_CONFIG;
  if (!raw) {
    throw new Error('FIREBASE_CONFIG missing');
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    throw new Error('FIREBASE_CONFIG is not valid JSON');
  }
})();

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function saveConversation(
  appId: string,
  uid: string,
  messages: Message[],
) {
  const ref = collection(db, 'artifacts', appId, 'users', uid, 'conversations');
  await addDoc(ref, {
    messages,
    createdAt: serverTimestamp(),
  });
}
