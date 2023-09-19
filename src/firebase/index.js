import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/storage";

export function useDb() {
  const firebaseConfig = {
    apiKey: "AIzaSyBLG9Sud18Fya0uOs1VvrrtqHj-6eFxJ0k",
    authDomain: "pemilihan-logo.firebaseapp.com",
    projectId: "pemilihan-logo",
    storageBucket: "pemilihan-logo.appspot.com",
    messagingSenderId: "669455493697",
    appId: "1:669455493697:web:61a9b517c3fe3461cc34c0"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Initialize Cloud Storage and get a reference to the service
  const storage = firebase.storage();
  // Create a storage reference from our storage service
  const storageRef = storage.ref();
  
  // Initialize Cloud Firestore and get a reference to the service
  const db = firebase.firestore();

  return {
    db, storage, storageRef
  }
}