import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

var firebaseConfig = {
    apiKey: "AIzaSyD6s1uwCuMavUzc6d3sm4gWVjHvK-yxJOQ",
    authDomain: "cryptoapp-89ab1.firebaseapp.com",
    projectId: "cryptoapp-89ab1",
    storageBucket: "cryptoapp-89ab1.appspot.com",
    messagingSenderId: "797899050234",
    appId: "1:797899050234:web:387a7899ef2da180e98d43"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}else {
    firebase.app();
}


const db = firebase.firestore();

export default {
    firebase,
    db
};
