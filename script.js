import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    setDoc, 
    onSnapshot,
    query,
    orderBy 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "...",
    appId: "..."
};

// 2. Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, 'users');

// 3. DOM Elements
const nameInput = document.getElementById('userName');
const saveBtn = document.getElementById('saveBtn');
const userList = document.getElementById('userList');

// 4. Function to Add User (with Duplicate Check)
const saveUser = async () => {
    const name = nameInput.value.trim();

    if (!name) {
        alert("Please enter a name.");
        return;
    }

    // Standardize ID to lowercase to prevent "John" and "john" duplicates
    const docId = name.toLowerCase();
    const docRef = doc(db, "users", docId);

    try {
        // Check if document already exists
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            alert(`"${name}" is already in the list!`);
        } else {
            // Create new document with a timestamp for sorting
            await setDoc(docRef, { 
                displayName: name,
                createdAt: new Date()
            });
            nameInput.value = ''; // Clear input on success
        }
    } catch (error) {
        console.error("Error saving to database:", error);
        alert("Failed to save. Check your Firestore Rules.");
    }
};

// 5. Event Listeners
saveBtn.addEventListener('click', saveUser);

// Allow pressing "Enter" key to submit
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveUser();
});

// 6. Real-time Listener (UI Updates automatically)
// We order by 'createdAt' so the newest names appear at the bottom
const q = query(colRef, orderBy("createdAt", "asc"));

onSnapshot(q, (snapshot) => {
    userList.innerHTML = ''; // Clear current list
    snapshot.forEach((doc) => {
        const li = document.createElement('li');
        li.textContent = doc.data().displayName;
        userList.appendChild(li);
    });
});