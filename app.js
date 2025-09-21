// Use Firebase objects from window (set in index.html)
const auth = window.auth;
const db = window.db;
const rtdb = window.rtdb;

// ---------- Signup ----------
window.signup = async function() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!name || !email || !password) return alert("Fill all fields");

  try {
    const userCred = await firebase.auth.createUserWithEmailAndPassword(auth, email, password);
    await firebase.firestore.setDoc(firebase.firestore.doc(db, 'users', userCred.user.uid), { name, email });
    alert("Account created! You can now log in.");
    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
  } catch (err) {
    alert(err.message);
  }
}

// ---------- Login ----------
window.login = async function() {
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  if (!email || !password) return alert("Enter email and password");

  try {
    await firebase.auth.signInWithEmailAndPassword(auth, email, password);
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('app-section').style.display = 'block';
    loadSchedule();
    loadChat();
    loadUserInfo();
    setOnlineStatus(true);
  } catch (err) {
    alert(err.message);
  }
}

// ---------- Logout ----------
window.logout = function() {
  setOnlineStatus(false);
  firebase.auth.signOut(auth);
  document.getElementById('app-section').style.display = 'none';
  document.getElementById('login-section').style.display = 'block';
}

// ---------- Tab Switching ----------
window.showTab = function(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display='none');
  document.getElementById(tabId).style.display='block';
}

// ---------- Load Schedule ----------
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

// ---------- Chat ----------
function loadChat() {
  const chatBox = document.getElementById('chat-box');
  firebase.database.onValue(firebase.database.ref(rtdb, 'chat'), snapshot => {
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
  firebase.database.push(firebase.database.ref(rtdb, 'chat'), { user: auth.currentUser.email, text: input.value });
  input.value = '';
}

// ---------- User Info & Online ----------
async function loadUserInfo() {
  const user = auth.currentUser;
  const docSnap = await firebase.firestore.getDoc(firebase.firestore.doc(db, 'users', user.uid));
  if(docSnap.exists) {
    document.getElementById('user-info').textContent = `Name: ${docSnap.data().name}, Email: ${docSnap.data().email}`;
  }

  const onlineUsersEl = document.getElementById('online-users');
  firebase.database.onValue(firebase.database.ref(rtdb, 'online'), snapshot => {
    onlineUsersEl.innerHTML = '';
    const users = snapshot.val() || {};
    Object.values(users).forEach(u => {
      const li = document.createElement('li');
      li.textContent = u;
      onlineUsersEl.appendChild(li);
    });
  });
}

// ---------- Online Status ----------
function setOnlineStatus(isOnline) {
  const user = auth.currentUser;
  if(!user) return;
  const userRef = firebase.database.ref(rtdb, 'online/' + user.uid);
  if(isOnline) {
    firebase.database.set(userRef, user.email);
    firebase.database.onDisconnect(userRef).remove();
  } else {
    firebase.database.remove(userRef);
  }
}

// ---------- Track Auth State ----------
firebase.auth.onAuthStateChanged(auth, user => {
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
