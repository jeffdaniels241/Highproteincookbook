import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDIHGmbUg2KjSA0li8XiG04ld0ZjCtTCE8',
  authDomain: 'proteincookbook.firebaseapp.com',
  projectId: 'proteincookbook',
  storageBucket: 'proteincookbook.firebasestorage.app',
  messagingSenderId: '929344584966',
  appId: '1:929344584966:web:bd5dad4ecaf588cbb4f287',
  measurementId: 'G-SLN5Z9ZR4M',
};

export const appId = 'virtual-cookbook-v1';
export let db, auth, currentUser;

export async function initFirebase(onConnected) {
  try {
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db   = getFirestore(app);

    try {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
    } catch (err) {
      console.error('Firebase auth error:', err);
      setDbStatus(false, 'Auth Blocked — check Authorized Domains');
      return;
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUser = user;
        setDbStatus(true, 'Cloud Sync Active');
        onConnected(user);
      }
    });
  } catch (e) {
    console.warn('Firebase init failed:', e);
    setDbStatus(false, 'Database Configuration Error');
  }
}

function setDbStatus(ok, msg) {
  const dot  = document.getElementById('db-indicator');
  const text = document.getElementById('db-text');
  if (!dot || !text) return;
  dot.classList.remove('bg-red-500', 'bg-green-500', 'bg-amber-500');
  dot.classList.add(ok ? 'bg-green-500' : 'bg-red-500');
  text.textContent = msg;
}
