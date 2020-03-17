import firebase from 'firebase/app';
import 'firebase/storage';

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDrRp_K3ZiD0j6SsT5W7cfIYFv_a0u-zdI",
    authDomain: "electron-mirror.firebaseapp.com",
    databaseURL: "https://electron-mirror.firebaseio.com",
    projectId: "electron-mirror",
    storageBucket: "electron-mirror.appspot.com",
    messagingSenderId: "527412466936",
    appId: "1:527412466936:web:e4549947f812f19839d70d",
    measurementId: "G-Z515FM485R"
};
firebase.initializeApp(config);

const storage = firebase.storage();

export {
    storage, firebase as default
}