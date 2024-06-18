import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDkBwBjLdHFQp7uZSqfEuGuc0G7kHlrtpI",
  authDomain: "project-management-dashb-beb35.firebaseapp.com",
  projectId: "project-management-dashb-beb35",
  storageBucket: "project-management-dashb-beb35.appspot.com",
  messagingSenderId: "947939136937",
  appId: "1:947939136937:web:6caf910aaa6076324aa0b8",
};

const app = initializeApp(firebaseConfig);
console.log(app);
export const auth = getAuth(app);
