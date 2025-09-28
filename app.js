/* app.js
   Uses Firebase compat (namespaced) API that matches firebase-app-compat.js + firebase-auth-compat.js
   Replace this file in your repo root exactly as-is.
*/

/* ====== FIREBASE CONFIG: keep these values if they match your project ======
   If you already had these exact values in your original app.js, no change needed.
*/
const firebaseConfig = {
  apiKey: "AIzaSyADoWYQ_aURppoItPBJlIq4l3DgWJxh0hk",
  authDomain: "teachers-quorum-site-backend.firebaseapp.com",
  projectId: "teachers-quorum-site-backend",
  storageBucket: "teachers-quorum-site-backend.firebasestorage.app",
  messagingSenderId: "952996757126",
  appId: "1:952996757126:web:xxxxxxxxxxxxxx"
};
/* ========================================================================== */

/* Initialize Firebase (compat) */
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

/* DOM references */
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const signupBtn = document.getElementById('signup-btn');
const loginBtn = document.getElementById('login-btn');
const errorMessage = document.getElementById('error-message');
const dashboard = document.getElementById('dashboard');
const authCard = document.querySelector('.card-auth');
const userEmailSpan = document.getElementById('user-email');
const userUid = document.getElementById('user-uid');
const logoutBtn = document.getElementById('logout-btn');

const tabSignup = document.getElementById('tab-signup');
const tabLogin = document.getElementById('tab-login');
const signupFormEl = document.getElementById('signup-form');
const loginFormEl = document.getElementById('login-form');

/* Small UI utilities */
function showError(text) {
  errorMessage.textContent = text || '';
  errorMessage.style.display = text ? 'block' : 'none';
}
function setLoading(isLoading, forBtn) {
  if (!forBtn) return;
  forBtn.disabled = isLoading;
  if (isLoading) {
    forBtn.dataset.orig = forBtn.textContent;
    forBtn.textContent = 'Please wait…';
  } else if (forBtn.dataset.orig) {
    forBtn.textContent = forBtn.dataset.orig;
    delete forBtn.dataset.orig;
  }
}

/* Tab switching (signup/login) */
tabSignup.addEventListener('click', () => {
  tabSignup.classList.add('active');
  tabLogin.classList.remove('active');
  signupFormEl.classList.remove('hidden');
  loginFormEl.classList.add('hidden');
  showError('');
});
tabLogin.addEventListener('click', () => {
  tabLogin.classList.add('active');
  tabSignup.classList.remove('active');
  loginFormEl.classList.remove('hidden');
  signupFormEl.classList.add('hidden');
  showError('');
});

/* Signup */
signupForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  showError('');
  const email = document.getElementById('signup-email').value.trim();
  const password = document.getElementById('signup-password').value;
  if (!email || !password) {
    showError('Provide a valid email and password.');
    return;
  }
  setLoading(true, signupBtn);
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      showError('');
      signupForm.reset();
      // user will be handled by onAuthStateChanged
    })
    .catch((err) => {
      // Friendly messages for common problems
      if (err && err.code) {
        if (err.code === 'auth/email-already-in-use') {
          showError('That email is already registered. Try logging in instead.');
        } else if (err.code === 'auth/weak-password') {
          showError('Weak password — use at least 6 characters.');
        } else if (err.code === 'auth/invalid-email') {
          showError('Invalid email address format.');
        } else {
          showError(err.message || 'Signup failed. Check console for details.');
        }
      } else {
        showError('Signup failed. Check console for details.');
      }
      console.error('Signup error:', err);
    })
    .finally(() => setLoading(false, signupBtn));
});

/* Login */
loginForm.addEventListener('submit', (ev) => {
  ev.preventDefault();
  showError('');
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) {
    showError('Provide email and password to log in.');
    return;
  }
  setLoading(true, loginBtn);
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      showError('');
      loginForm.reset();
      // onAuthStateChanged will switch UI
    })
    .catch((err) => {
      if (err && err.code) {
        if (err.code === 'auth/wrong-password') {
          showError('Wrong password. Try again.');
        } else if (err.code === 'auth/user-not-found') {
          showError('No account found with that email.');
        } else if (err.code === 'auth/invalid-email') {
          showError('Invalid email address format.');
        } else {
          showError(err.message || 'Login failed. Check console for details.');
        }
      } else {
        showError('Login failed. Check console for details.');
      }
      console.error('Login error:', err);
    })
    .finally(() => setLoading(false, loginBtn));
});

/* Logout */
logoutBtn.addEventListener('click', () => {
  firebase.auth().signOut().catch(err => {
    console.error('Sign out error:', err);
    showError('Sign out failed. Check console.');
  });
});

/* Auth state listener: show dashboard or auth forms */
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // Signed in
    authCard.classList.add('hidden');
    dashboard.classList.remove('hidden');
    userEmailSpan.textContent = user.email || '(no email)';
    userUid.textContent = 'UID: ' + (user.uid || '—');
    showError('');
  } else {
    // Signed out
    authCard.classList.remove('hidden');
    dashboard.classList.add('hidden');
    userEmailSpan.textContent = '';
    userUid.textContent = 'UID: —';
  }
});

/* Initial UI state */
showError('');

