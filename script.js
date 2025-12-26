import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc, setDoc, onSnapshot, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCzCqOFgTvB2g0DQ0SCvOpjQscDBxmq_V0",
    authDomain: "vnhs-enrollment-db.firebaseapp.com",
    projectId: "vnhs-enrollment-db",
    storageBucket: "vnhs-enrollment-db.firebasestorage.app",
    messagingSenderId: "1012164506206",
    appId: "1:1012164506206:web:d09f436f4d5c9918557acf"
    // Removed measurementId to prevent potential Analytics permission conflicts
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const colRef = collection(db, 'users');

const nameInput = document.getElementById('userName');
const saveBtn = document.getElementById('saveBtn');
const userList = document.getElementById('userList');

const saveUser = async () => {
    const name = nameInput.value.trim();
    if (!name) return;

    const docId = name.toLowerCase();
    const docRef = doc(db, "users", docId);

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            alert(`"${name}" is already in the list!`);
        } else {
            await setDoc(docRef, { 
                displayName: name,
                createdAt: serverTimestamp() 
            });
            nameInput.value = ''; 
        }
    } catch (error) {
        console.error("Full Error:", error); // This will show the real reason in Console
        alert("Failed to save. Please check the Browser Console (F12) for the specific error.");
    }
};

saveBtn.addEventListener('click', saveUser);

const q = query(colRef, orderBy("createdAt", "asc"));
onSnapshot(q, (snapshot) => {
    userList.innerHTML = ''; 
    snapshot.forEach((doc) => {
        if(doc.data().displayName) {
            const li = document.createElement('li');
            li.textContent = doc.data().displayName;
            userList.appendChild(li);
        }
    });
});
