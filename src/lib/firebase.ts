import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDLxW612LdWWbojudszaX1KKUVRURzAAYU",
    authDomain: "programmebuilder-fb14c.firebaseapp.com",
    projectId: "programmebuilder-fb14c",
    storageBucket: "programmebuilder-fb14c.appspot.com",
    messagingSenderId: "977931216133",
    appId: "1:977931216133:web:465a05f4eb57025b23836c"
};

export const app = initializeApp(firebaseConfig);
export const database = getFirestore();
export const auth = getAuth();