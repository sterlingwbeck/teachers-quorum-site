// ✅ Use Firebase services from index.html
const auth = window.auth;
const db = window.db;
const rtdb = window.rtdb;

// ---------- Signup ----------
function signup() {
  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!name || !email || !password) return alert("Fill all fields");

  auth.createUserWithEmailAndPassword(email, password)
    .then((cred) => {
      return db.collection("users").doc(cred.user.uid).set({ name, email });
    })
    .then(() => {
      alert("Signup successful! You can now log in.");
      document.getElementById("signup-name").value = '';
      document.getElementById("signup-email").value = '';
      document.getElementById("signup-password").value = '';
    })
    .catch(err => alert(err.message));
}

// ---------- Login ----------
function login() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) return alert("Enter email and password");

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      document.getElementById("login-section").style.display = 'none';
      document.getElementById("app-section").style.display = 'block';
      loadSchedule();
      loadChat();
      loadUserInfo();
      setOnlineStatus(true);
    })
    .catch(err => alert(err.message));
}

// ---------- Logout ----------
function logout() {
  setOnlineStatus(false);
  auth.signOut();
  document.getElementById("app-section").style.display = 'none';
  document.getElementById("login-section").style.display = 'block';
}

// ---------- Tab Switching ----------
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
  document.getElementById(tabId).style.display = 'block';
}

// ---------- Schedule ----------
async function loadSchedule() {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQVXc593WLsr5rbR6FTA8Gn8P5gAxSgdqizcq3EOCv2YPhai7MnCtMw8HWyl7i_PAYMRaHvgbKtGAf4/pub?output=csv';
  try {
    const res = await fetch(url);
    const csv = await res.text();
    const rows = csv.split('\n').map(r => r.split(','));
    const table = document.getElementById("schedule-table");
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
  } catch (err) {
    console.error("Error loading schedule:", err);
  }
}

// ---------- Chat ----------
function loadChat() {
  const chatBox = document.getElementById("chat-box");
  rtdb.ref('chat').on('value', snapshot => {
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

function sendMessage() {
  const input = document.getElementById("chat-input");
  if (!input.value || !auth.currentUser) return;
  rtdb.ref('chat').push({ user: auth.currentUser.email, text: input.value });
  input.value = '';
}

// ---------- User Info & Online Users ----------
async function loadUserInfo() {
  const user = auth.currentUser;
  if (!user) return;

  const docSnap = await db.collection('users').doc(user.uid).get();
  if (docSnap.exists) {
    document.getElementById("user-info").textContent = `Name: ${docSnap.data().name}, Email: ${docSnap.data().email}`;
  }

  const onlineUsersEl = document.getElementById("online-users");
  rtdb.ref('online').on('value', snapshot => {
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
  if (!user) return;
  const userRef = rtdb.ref('online/' + user.uid);
  if (isOnline) {
    userRef.set(user.email);
    userRef.onDisconnect().remove();
  } else {
    userRef.remove();
  }
}

// ---------- Track Auth State ----------
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById("login-section").style.display = 'none';
    document.getElementById("app-section").style.display = 'block';
    loadSchedule();
    loadChat();
    loadUserInfo();
    setOnlineStatus(true);
  } else {
    document.getElementById("login-section").style.display = 'block';
    document.getElementById("app-section").style.display = 'none';
  }
});

// ---------- Attach button listeners ----------
document.getElementById("signup-btn").addEventListener("click", signup);
document.getElementById("login-btn").addEventListener("click", login);
