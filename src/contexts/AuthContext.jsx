import React, { useContext, useState, useEffect } from "react";
import { auth,db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(name,role,email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Store additional user data in Firestore
    // await setDoc(doc(db, "users", user.uid), {
    //   name: name,
    //   role:role,
    //   email: email,
    //   createdAt: new Date()
    // });
    const users=localStorage.getItem("users") || [];
   const userDetails={
    name,role,email,userId:user.uid
   }
   users.push(userDetails);

   localStorage.setItem("users",JSON.stringify(users))
    console.log("User signed up and data stored!");
  }

  function login(email, password) {
    let loginDetails = signInWithEmailAndPassword(auth, email, password);
    return loginDetails;
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
