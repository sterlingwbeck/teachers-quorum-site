// Firebase config (replace with your real values from Firebase console)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "teachers-quorum-site-backend.firebaseapp.com",
  projectId: "teachers-quorum-site-backend",
  storageBucket: "teachers-quorum-site-backend.appspot.com",
  messagingSenderId: "952996757126",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM elements
const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const successPage = document.getElementById("success-page");
const logoutBtn = document.getElementById("logout-btn");

// Handle signup
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      showSuccess();
    })
    .catch((err) => {
      displayError(err);
    });
});

// Handle login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      showSuccess();
    })
    .catch((err) => {
      displayError(err);
    });
});

// Handle logout
logoutBtn.addEventListener("click", () => {
  auth.signOut().then(() => {
    successPage.style.display = "none";
    document.getElementById("auth-forms").style.display = "flex";
    errorMessage.textContent = "";
  });
});

// Show success page
function showSuccess() {
  document.getElementById("auth-forms").style.display = "none";
  successPage.style.display = "block";
  errorMessage.textContent = "";
}

// Display readable errors
function displayError(err) {
  let msg = "";
  switch (err.code) {
    case "auth/email-already-in-use":
      msg = "That email is already registered. Try logging in instead.";
      break;
    case "auth/invalid-email":
      msg = "Please enter a valid email address.";
      break;
    case "auth/user-not-found":
      msg = "No account found with that email. Try signing up first.";
      break;
    case "auth/wrong-password":
      msg = "Incorrect password. Please try again.";
      break;
    case "auth/weak-password":
      msg = "Password should be at least 6 characters.";
      break;
    default:
      msg = "Error: " + err.message;
  }
  errorMessage.textContent = msg;
}
