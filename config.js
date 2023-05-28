import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import {getDatabase} from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCiXQLlELKfXEGhkhbSoywbUblBm34mCJg",
    authDomain: "themoney-29802.firebaseapp.com",
    projectId: "themoney-29802",
    storageBucket: "themoney-29802.appspot.com",
    messagingSenderId: "908722451897",
    appId: "1:908722451897:web:7c29f08d337ccee74cb268",
    measurementId: "G-4R38FZ6YTR"
};

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}
const db = getDatabase();
export {firebase, db};