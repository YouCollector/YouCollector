// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'youcollector.firebaseapp.com',
  projectId: 'youcollector',
  storageBucket: 'youcollector.appspot.com',
  messagingSenderId: '874242900726',
  appId: '1:874242900726:web:c49445b59edd497bca22d7',
  measurementId: 'G-94T09RZ5XL',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

export default analytics
