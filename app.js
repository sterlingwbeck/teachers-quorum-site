// ----- Firebase Configuration -----
const firebaseConfig = {
  apiKey: "AIzaSyADoWYQ_aURppoItPBJlIq4l3DgWJxh0hk",
  authDomain: "teachers-quorum-site-backend.firebaseapp.com",
  projectId: "teachers-quorum-site-backend",
  storageBucket: "teachers-quorum-site-backend.appspot.com",
  messagingSenderId: "952996757126",
  appId: "1:952996757126:web:YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// ----- DOM Elements -----
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const authSection = document.getElementById('auth-section');
const userSection = document.getElementById('user-section');
const welcomeMsg = document.getElementById('welcome-msg');

// ----- Sign Up -----
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    console.log("Signup successful:", userCredential.user);
    alert("Sign up successful!");
    signupForm.reset();
  } catch (error) {
    console.error("Signup error:", error);
    alert(`Sign up failed: ${error.message}`);
  }
});

// ----- Login -----
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    console.log("Login successful:", userCredential.user);
    loginForm.reset();
  } catch (error) {
    console.error("Login error:", error);
    alert(`Login failed: ${error.message}`);
  }
});

// ----- Logout -----
logoutBtn.addEventListener('click', async () => {
  try {
    await auth.signOut();
    console.log("User logged out");
  } catch (error) {
    console.error("Logout error:", error);
    alert(`Logout failed: ${error.message}`);
  }
});

// ----- Auth State Listener -----
auth.onAuthStateChanged(user => {
  if (user) {
    authSection.style.display = 'none';
    userSection.style.display = 'block';
    welcomeMsg.textContent = `Welcome, ${user.email}`;
  } else {
    authSection.style.display = 'block';
    userSection.style.display = 'none';
    welcomeMsg.textContent = '';
  }
});

