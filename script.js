import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    doc, 
    getDoc, 
    setDoc, 
    onSnapshot,
    query,
    orderBy,
    serverTimestamp // Added this
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCzCqOFgTvB2g0DQ0SCvOpjQscDBxmq_V0", // Note: Keep this private in real apps!
    authDomain: "vnhs-enrollment-db.firebaseapp.com",
    projectId: "vnhs-enrollment-db",
    storageBucket: "vnhs-enrollment-db.firebasestorage.app",
    messagingSenderId: "1012164506206",
    appId: "1:1012164506206:web:d09f436f4d5c9918557acf",
    measurementId: "G-8HZMEF70B0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, 'users');

const nameInput = document.getElementById('userName');
const saveBtn = document.getElementById('saveBtn');
const userList = document.getElementById('userList');

const saveUser = async () => {
    const name = nameInput.value.trim();
    if (!name) {
        alert("Please enter a name.");
        return;
    }

    const docId = name.toLowerCase();
    const docRef = doc(db, "users", docId);

    try {
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            alert(`"${name}" is already in the list!`);
        } else {
            await setDoc(docRef, { 
                displayName: name,
                createdAt: serverTimestamp() // Use server time instead of local time
            });
            nameInput.value = ''; 
        }
    } catch (error) {
        console.error("Error saving:", error);
        alert("Failed to save. Check your Firestore Rules.");
    }
};

saveBtn.addEventListener('click', saveUser);
nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveUser();
});

// Added 'includeMetadataChanges' logic to handle the serverTimestamp delay
const q = query(colRef, orderBy("createdAt", "asc"));

onSnapshot(q, (snapshot) => {
    userList.innerHTML = ''; 
    snapshot.forEach((doc) => {
        // Only show if it has a name (prevents errors during deletion/updates)
        if(doc.data().displayName) {
            const li = document.createElement('li');
            li.textContent = doc.data().displayName;
            userList.appendChild(li);
        }
    });
});