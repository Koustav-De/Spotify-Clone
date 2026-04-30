// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { updateProfile } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAOEGZjY-YPM0mrXiWVSdNJcqXwQkXgjiw",
    authDomain: "rhythmo-693c4.firebaseapp.com",
    projectId: "rhythmo-693c4",
    storageBucket: "rhythmo-693c4.firebasestorage.app",
    messagingSenderId: "15041414995",
    appId: "1:15041414995:web:b2f9f8821e91750a8683a6",
    measurementId: "G-5FKC04Z2N0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Make auth global
window.auth = auth;
window.createUserWithEmailAndPassword = createUserWithEmailAndPassword;
window.signInWithEmailAndPassword = signInWithEmailAndPassword;
window.signOut = signOut;
window.updateProfile = updateProfile;

// Auth state listener
onAuthStateChanged(auth, (user) => {
    const buttons = document.querySelector(".buttons")

    if (user) {
        let name = user.displayName || "User"

        // Split name into parts
        let initials = "U"

        if (user.displayName) {
            let parts = user.displayName.trim().split(" ")

            initials = parts[0]?.[0]?.toUpperCase() || "U"

            if (parts.length > 1) {
                initials += parts[1]?.[0]?.toUpperCase() || ""
            }
        }

        buttons.innerHTML = `
            <div class="user-profile">${initials}</div>
            <button class="logout">Logout</button>
        `

        document.querySelector(".logout").addEventListener("click", async () => {
            await signOut(auth);
        });

    } else {
        buttons.innerHTML = `
            <button class="sign">Sign up</button>
            <button class="login">Log in</button>
        `
    }
})