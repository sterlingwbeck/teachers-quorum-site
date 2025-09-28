// Firebase config (replace with your actual project values)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
};

// Init
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const errorBox = document.getElementById("error-message");
const dashboard = document.getElementById("dashboard");
const welcomeMsg = document.getElementById("welcome-msg");
const uidDisplay = document.getElementById("uid-display");
const logoutBtn = document.getElementById("logout-btn");

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  try {
    await auth.createUserWithEmailAndPassword(email, password);
  } catch (err) {
    errorBox.innerText = err.message;
  }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  try {
    await auth.signInWithEmailAndPassword(email, password);
  } catch (err) {
    errorBox.innerText = err.message;
  }
});

logoutBtn.addEventListener("click", () => {
  auth.signOut();
});

// Listen for auth changes
auth.onAuthStateChanged((user) => {
  if (user) {
    dashboard.style.display = "block";
    document.getElementById("auth-forms").style.display = "none";
    errorBox.innerText = "";
    welcomeMsg.innerText = `Welcome — ${user.email}`;
    uidDisplay.innerText = `UID: ${user.uid}`;
  } else {
    dashboard.style.display = "none";
    document.getElementById("auth-forms").style.display = "flex";
    welcomeMsg.innerText = "";
    uidDisplay.innerText = "";
  }
});
