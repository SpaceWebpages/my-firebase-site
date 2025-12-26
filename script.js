// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyA_JTCBKnJ7zaz8wRSiCpLRU2RcQZ2catw",
    authDomain: "my-firebase-site-a35bb.firebaseapp.com",
    projectId: "my-firebase-site-a35bb",
    storageBucket: "my-firebase-site-a35bb.firebasestorage.app",
    messagingSenderId: "943328160156",
    appId: "1:943328160156:web:9acc1c41989b21b3124059"
  };

  // Initialize Firebase
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
