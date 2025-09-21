// ✅ Initialize Firebase App
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", 
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", 
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com"
};

// Make sure Firebase SDK is loaded via <script> in index.html
firebase.initializeApp(firebaseConfig);

// ✅ Services
const auth = firebase.auth();
const db = firebase.firestore();

// ✅ Sign Up
function signup() {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      // Save user profile in Firestore
      return db.collection("users").doc(cred.user.uid).set({
        name: name,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .then(() => {
      alert("✅ Account created successfully!");
      document.getElementById("signup-name").value = "";
      document.getElementById("signup-email").value = "";
      document.getElementById("signup-password").value = "";
    })
    .catch((error) => {
      alert("❌ Error: " + error.message);
    });
}

// ✅ Login
function login() {
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      alert("✅ Logged in successfully!");
      document.getElementById("login-email").value = "";
      document.getElementById("login-password").value = "";
    })
    .catch((error) => {
      alert("❌ Error: " + error.message);
    });
}

// ✅ Logout
function logout() {
  auth.signOut()
    .then(() => {
      alert("👋 Logged out.");
    });
}

// ✅ Auth state listener (shows login/logout status in console)
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("✅ User logged in:", user.email);
  } else {
    console.log("❌ No user logged in");
  }
});
