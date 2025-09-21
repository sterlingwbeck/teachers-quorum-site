// -------------------------
// 1. Initialize Firebase
// -------------------------
const firebaseConfig = {
  apiKey: "AIzaSyADoWYQ_aURppoItPBJlIq4l3DgWJxh0hk",
  authDomain: "teachers-quorum-site-backend.firebaseapp.com",
  projectId: "teachers-quorum-site-backend",
  storageBucket: "teachers-quorum-site-backend.firebasestorage.app",
  messagingSenderId: "952996757126",
  appId: "1:952996757126:web:YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// -------------------------
// 2. DOM Elements
// -------------------------
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const messageDiv = document.getElementById("message");

// -------------------------
// 3. Helper Function
// -------------------------
function showMessage(msg, isError = true) {
  messageDiv.textContent = msg;
  messageDiv.style.color = isError ? 'red' : 'green';
}

// -------------------------
// 4. Sign Up Handler
// -------------------------
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    await userCredential.user.updateProfile({ displayName: name });
    showMessage(`Sign Up Successful! Welcome, ${name}`, false);
    signupForm.reset();
  } catch (error) {
    showMessage(error.message);
  }
});

// -------------------------
// 5. Login Handler
// -------------------------
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    showMessage(`Login Successful! Welcome back, ${userCredential.user.displayName || 'User'}`, false);
    loginForm.reset();
  } catch (error) {
    showMessage(error.message);
  }
});

// -------------------------
// 6. Auth State Listener
// -------------------------
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User logged in:", user.email, "Display Name:", user.displayName);
  } else {
    console.log("No user logged in");
  }
});
