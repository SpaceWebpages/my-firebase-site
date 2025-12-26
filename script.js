import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, setDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCzCqOFgTvB2g0DQ0SCvOpjQscDBxmq_V0",
    authDomain: "vnhs-enrollment-db.firebaseapp.com",
    projectId: "vnhs-enrollment-db",
    storageBucket: "vnhs-enrollment-db.firebasestorage.app",
    messagingSenderId: "1012164506206",
    appId: "1:1012164506206:web:d09f436f4d5c9918557acf"
};

// Initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, 'users');

// Elements
const nameInput = document.getElementById('userName');
const saveBtn = document.getElementById('saveBtn');
const userList = document.getElementById('userList');

// Save Function
saveBtn.onclick = async () => {
    const name = nameInput.value.trim();
    if (!name) return alert("Please enter a name");

    const docId = name.toLowerCase();
    const docRef = doc(db, "users", docId);

    try {
        console.log("Attempting to save...");
        await setDoc(docRef, { 
            displayName: name, 
            createdAt: serverTimestamp() 
        });
        nameInput.value = '';
        console.log("Save successful!");
    } catch (e) {
        console.error("DETAILED ERROR:", e.code, e.message);
        alert("Error: " + e.code); 
    }
};

// Listen for Data
const q = query(colRef, orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
    userList.innerHTML = '';
    snapshot.forEach(d => {
        const li = document.createElement('li');
        li.textContent = d.data().displayName;
        userList.appendChild(li);
    });
}, (err) => {
    console.error("LISTENER ERROR:", err.code);
});
