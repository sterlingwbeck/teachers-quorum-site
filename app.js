import { auth, db, rtdb } from './index.html'; // Globals from your Firebase init
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";
import { ref, set, push, onValue, remove, onDisconnect } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-database.js";

// --------- Signup ---------
window.signup = async function() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!name || !email || !password) return alert("Fill all fields");

  try {
    const userCred = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCred.user.uid), {name, email});
    alert("Account created! You can now log in.");
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  } catch(err) {
    alert(err.message);
  }
}

// --------- Login ---------
window.login = async function() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) return alert("Enter email and password");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
    loadSchedule();
    loadChat();
    loadUserInfo();
    setOnlineStatus(true);
  } catch(err) {
    alert(err.message);
  }
}

// --------- Logout ---------
window.logout = function() {
  setOnlineStatus(false);
  signOut(auth);
  document.getElementById('app-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
}

// --------- Tab switching ---------
window.showTab = function(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display='none');
  document.getElementById(tabId).style.display='block';
}

// --------- Load Schedule from Google Sheets ---------
async function loadSchedule() {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVXc593WLsr5rbR6FTA8Gn8P5gAxSgdqizcq3EOCv2YPhai7MnCtMw8HWyl7i_PAYMRaHvgbKtGAf4/pub?output=csv';
  try {
    const res = await fetch(url);
    const csv = await res.text();
    const rows = csv.split('\n').map(r => r.split(','));
    const table = document.getElementById('schedule-table');
    table.innerHTML = '';
    rows.forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
      table.appendChild(tr);
    });
  } catch(err) {
    console.error("Error loading schedule:", err);
  }
}

// --------- Chat functionality ---------
function loadChat() {
  const chatBox = document.getElementById('chat-box');
  onValue(ref(rtdb, 'chat'), snapshot => {
    chatBox.innerHTML = '';
    const messages = snapshot.val() || {};
    Object.values(messages).forEach(msg => {
      const p = document.createElement('p');
      p.textContent = `${msg.user}: ${msg.text}`;
      chatBox.appendChild(p);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
  });
}

window.sendMessage = function() {
  const input = document.getElementById('chat-input');
  if(!input.value || !auth.currentUser) return;
  push(ref(rtdb, 'chat'), {user: auth.currentUser.email, text: input.value});
  input.value = '';
}

// --------- User Info and Online Users ---------
async function loadUserInfo() {
  const user = auth.currentUser;
  const docSnap = await getDoc(doc(db, 'users', user.uid));
  if(docSnap.exists()) {
    document.getElementById('user-info').textContent = `Name: ${docSnap.data().name}, Email: ${docSnap.data().email}`;
  }

  const onlineUsersEl = document.getElementById('online-users');
  onValue(ref(rtdb, 'online'), snapshot => {
    onlineUsersEl.innerHTML = '';
    const users = snapshot.val() || {};
    Object.values(users).forEach(u => {
      const li = document.createElement('li');
      li.textContent = u;
      onlineUsersEl.appendChild(li);
    });
  });
}

// --------- Online Status Tracking ---------
function setOnlineStatus(isOnline) {
  const user = auth.currentUser;
  if(!user) return;
  const userRef = ref(rtdb, 'online/' + user.uid);
  if(isOnline) {
    set(userRef, user.email);
    onDisconnect(userRef).remove();
  } else {
    remove(userRef);
  }
}

// --------- Automatically track auth state ---------
onAuthStateChanged(auth, user => {
  if(user) {
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
    loadSchedule();
    loadChat();
    loadUserInfo();
    setOnlineStatus(true);
  } else {
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('app-section').style.display = 'none';
  }
});
