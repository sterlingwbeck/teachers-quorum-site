// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyADoWYQ_aURppoItPBJlIq4l3DgWJxh0hk",
  authDomain: "teachers-quorum-site-backend.firebaseapp.com",
  projectId: "teachers-quorum-site-backend",
  storageBucket: "teachers-quorum-site-backend.firebasestorage.app",
  messagingSenderId: "952996757126",
  appId: "1:952996757126:web:xxxxxxxxxxxxxx"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const dashboard = document.getElementById("dashboard");
const authForms = document.getElementById("auth-forms");
const logoutBtn = document.getElementById("logout-btn");

// Signup
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  try {
    await auth.createUserWithEmailAndPassword(email, password);
  } catch (error) {
    errorMessage.innerText = error.message;
  }
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (error) {
    errorMessage.innerText = error.message;
  }
});

// Auth state change
auth.onAuthStateChanged(user => {
  if (user) {
    authForms.style.display = "none";
    dashboard.style.display = "block";
    errorMessage.innerText = "";
  } else {
    authForms.style.display = "block";
    dashboard.style.display = "none";
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

