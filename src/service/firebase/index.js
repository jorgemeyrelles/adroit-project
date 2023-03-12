import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: 'testeadroit.firebaseapp.com',
  projectId: 'testeadroit',
  storageBucket: 'testeadroit.appspot.com',
  messagingSenderId: '73287305317',
  appId: '1:73287305317:web:6136a939aafe780d089e8c',
  measurementId: process.env.REACT_APP_FIREBASE_KEY,
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const perf = getPerformance(app);

export { app, analytics, perf };
