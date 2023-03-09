// Import the functions you need from the SDKs you need
const app = require("firebase/app");
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyABGmpr3r4yC40HJ694ZeVBOtjZ08slqfA",
  authDomain: "sxediasiproject.firebaseapp.com",
  projectId: "sxediasiproject",
  storageBucket: "sxediasiproject.appspot.com",
  messagingSenderId: "494788802790",
  appId: "1:494788802790:web:20c1a1bdce84df775aa327",
  measurementId: "G-B9L7VM2GCV"
};

// Initialize Firebase
const project = app.initializeApp(firebaseConfig);

//end

//--------------------------------------------------------------------------

//database connection
const admin = require("firebase-admin");
//const {getAuth , signInWithEmailAndPassword} = require("firebase/auth");
const auth = require("firebase/auth");

const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

//auth.initializeAuth(serviceAccount);
//insance of the database
const db = admin.firestore();

module.exports = {project, db, auth};



