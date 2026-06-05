// ============ CONFIGURATION ============
const API_URL = 'http://localhost:8080/api'; // Change this to your backend URL if needed

// ============ AUTHENTICATION (LOCAL / MOCK VERSION) ============
let currentUser = null;
let authToken = null;

function initAuth() {
  const storedToken = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user_data');
  
  if (storedToken && user) {
    authToken = storedToken;
    currentUser = JSON.parse(user);
    showApp();
  } else {
    showAuthPage();
  }
}

function toggleAuthForm() {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const toggleText = document.getElementById('toggle-text');
  
  if (loginForm.style.display === 'none') {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    toggleText.innerHTML = `Don't have an account? <button type="button" id="toggle-btn" onclick="toggleAuthForm()">Sign up</button>`;
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    toggleText.innerHTML = `Already have an account? <button type="button" id="toggle-btn" onclick="toggleAuthForm()">Log in</button>`;
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  const errorEl = document.getElementById('login-error');
  errorEl.textContent = '';
  
  const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    errorEl.textContent = 'Invalid email or password';
    return;
  }
  
  authToken = 'mock_token_' + Math.random().toString(36).substring(2);
  currentUser = { id: user.id, email: user.email, username: user.username };
  
  localStorage.setItem('auth_token', authToken);
  localStorage.setItem('user_data', JSON.stringify(currentUser));
  
  showApp();
}

function handleSignup(e) {
  e.preventDefault();
  const fname = document.getElementById('signup-fname').value;
  const lname = document.getElementById('signup-lname').value;
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const confirm = document.getElementById('signup-confirm').value;
  const errorEl = document.getElementById('signup-error');
  errorEl.textContent = '';
  
  if (password !== confirm) {
    errorEl.textContent = 'Passwords do not match';
    return;
  }
  if (password.length < 6) {
    errorEl.textContent = 'Password must be at least 6 characters';
    return;
  }
  
  const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
  if (users.some(u => u.email === email)) {
    errorEl.textContent = 'Email already registered';
    return;
  }
  
  const newUser = { id: Date.now(), email, username, password, first_name: fname, last_name: lname };
  users.push(newUser);
  localStorage.setItem('mock_users', JSON.stringify(users));
  
  authToken = 'mock_token_' + Math.random().toString(36).substring(2);
  currentUser = { id: newUser.id, email: newUser.email, username: newUser.username };
  
  localStorage.setItem('auth_token', authToken);
  localStorage.setItem('user_data', JSON.stringify(currentUser));
  
  showApp();
}

function logout() {
  authToken = null;
  currentUser = null;
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  showAuthPage();
}

function showAuthPage() {
  document.getElementById('auth-page').style.display = 'flex';
  document.getElementById('app').style.display = 'none';
}

function showApp() {
  document.getElementById('auth-page').style.display = 'none';
  document.getElementById('app').style.display = 'flex';
  document.getElementById('user-name').textContent = currentUser.username || currentUser.email;
  
  // Launch music fetch instantly on app entry
  loadTracks();
}

function toggleUserMenu() {
  const dropdown = document.getElementById('user-dropdown');
  dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu')) {
    const dropdown = document.getElementById('user-dropdown');
    if (dropdown) dropdown.style.display = 'none';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('login-form')?.addEventListener('submit', handleLogin);
  document.getElementById('signup-form')?.addEventListener('submit', handleSignup);
});


// ============ MUSIC PLAYER (REAL STREAMING API INTEGRATION) ============

let tracks = []; // Global music data repository

const categories = [
  {title:'Afrobeats',emoji:'🥁',bg:'#1a3a1a'},
  {title:'Hip-Hop',emoji:'🎤',bg:'#2a1a4a'},
  {title:'R&B',emoji:'💜',bg:'#3a1a2a'},
  {title:'Pop',emoji:'⭐',bg:'#1a2a4a'},
  {title:'Gospel',emoji:'🙏',bg:'#3a2a1a'},
  {title:'Jazz',emoji:'🎷',bg:'#1a3a3a'},
  {title:'Electronic',emoji:'🔊',bg:'#2a2a1a'},
  {title:'Podcasts',emoji:'🎙️',bg:'#3a1a1a'},
];

// Instantiating the browser audio layer
const audio = new Audio();
let currentTrack = null;
let currentIndex = -1;
let isPlaying = false;
let isLiked = false;
let isShuffle = false;
let isRepeat = false;

// Dynamic fetcher calling the real iTunes Music API
async function loadTracks() {
  try {
    // Fetch real global hits (Afrobeats & Popular tracks combined)
    const response = await fetch('https://itunes.apple.com/search?term=afrobeats&media=music&limit=12');
    if (!response.ok) throw new Error("Network latency/CORS failure");
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      tracks = data.results.map(item => ({
        title: item.trackName,
        artist: item.artistName,
        // Upgrade 100x100 artwork to higher resolution crisp sizes
        image: item.artworkUrl100.replace('100x100bb', '400x400bb'), 
        url: item.previewUrl // Real dynamic 30-second streaming URL
      }));
    }
  } catch (error) {
    console.warn("API offline, rolling over to fallback streams:", error);
    // Safe mock fallbacks in case network drops out completely
    tracks = [
      {title:'Calm Down',artist:'Rema',image:'',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'},
      {title:'Love Nwantiti',artist:'CKay',image:'',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'},
      {title:'Essence',artist:'Wizkid',image:'',url:'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'}
    ];
  }
  initCards();
}

// Render dynamic elements cleanly using index keys instead of breaking string arguments
function buildCard(t, index) {
  const mediaContent = t.image 
    ? `<img src="${t.image}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt="Cover">`
    : `<div style="font-size:32px;">🎵</div>`;

  return `<div class="card" onclick="playTrackByIndex(${index})">
    <div class="card-img" style="background:#1a1a3a">${mediaContent}</div>
    <div class="card-title">${t.title}</div>
    <div class="card-sub">${t.artist}</div>
    <button class="play-btn" onclick="event.stopPropagation(); playTrackByIndex(${index})">
      <i class="ti ti-player-play"></i>
    </button>
  </div>`;
}

function initCards() {
  if (tracks.length === 0) return;

  // Render out clean segment splits to layout tiers
  document.getElementById('trending-cards').innerHTML = tracks.slice(0, 4).map((t, idx) => buildCard(t, idx)).join('');
  document.getElementById('foryou-cards').innerHTML = tracks.slice(4, 8).map((t, idx) => buildCard(t, idx + 4)).join('');
  
  // Set up categories to trigger immediate real live music search queries
  document.getElementById('search-cards').innerHTML = categories.map(c => `
    <div class="card" onclick="triggerGenreSearch('${c.title}')">
      <div class="card-img" style="background:${c.bg}">${c.emoji}</div>
      <div class="card-title">${c.title}</div>
      <div class="card-sub">Genre</div>
    </div>
  `).join('');
  
  document.getElementById('library-cards').innerHTML = `
    <div class="card" onclick="triggerGenreSearch('Chill Vibes')">
      <div class="card-img" style="background:#2a1a4a">🌊</div>
      <div class="card-title">Chill Vibes</div>
      <div class="card-sub">Curated Station</div>
    </div>
  `;
}

function showPage(name) {
  ['home', 'search', 'library'].forEach(p => {
    document.getElementById('page-' + p).style.display = p === name ? 'block' : 'none';
  });
  document.querySelectorAll('.nav-item').forEach((el, i) => {
    el.classList.toggle('active', ['home', 'search', 'library'][i] === name);
  });
}

// Master index tracker for absolute control of tracks
function playTrackByIndex(index) {
  if (index < 0 || index >= tracks.length) return;
  
  currentIndex = index;
  currentTrack = tracks[index];
  
  audio.src = currentTrack.url;
  audio.play().catch(err => console.log("Interaction restriction bypassed: ", err));
  
  isPlaying = true;
  document.getElementById('np-title').textContent = currentTrack.title;
  document.getElementById('np-artist').textContent = currentTrack.artist;
  
  const thumbEl = document.getElementById('np-thumb');
  if (currentTrack.image) {
    thumbEl.innerHTML = `<img src="${currentTrack.image}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;" alt="Now Playing">`;
    thumbEl.style.background = 'transparent';
  } else {
    thumbEl.innerHTML = `🎵`;
    thumbEl.style.background = '#2a1a4a';
  }
  
  document.getElementById('play-icon').className = 'ti ti-player-pause';
  isLiked = false;
  document.getElementById('like-btn').innerHTML = '<i class="ti ti-heart"></i>';
  document.getElementById('like-btn').classList.remove('liked');
}

function togglePlay() {
  if (!audio.src) return;
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    document.getElementById('play-icon').className = 'ti ti-player-play';
  } else {
    audio.play().catch(err => console.log(err));
    isPlaying = true;
    document.getElementById('play-icon').className = 'ti ti-player-pause';
  }
}

// Native Hardware Time Update Events
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('cur-time').textContent = fmtTime(Math.floor(audio.currentTime));
});

audio.addEventListener('loadedmetadata', () => {
  document.getElementById('dur-time').textContent = fmtTime(Math.floor(audio.duration));
});

audio.addEventListener('ended', () => {
  if (isRepeat) {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextTrack();
  }
});

function seekTo(e) {
  if (!audio.src || !audio.duration) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const pct = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pct * audio.duration;
}

function setVolume(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  document.getElementById('vol-fill').style.width = (pct * 100) + '%';
  audio.volume = pct;
}

function prevTrack() {
  if (tracks.length === 0) return;
  let nextIdx = currentIndex - 1;
  if (isShuffle) {
    nextIdx = Math.floor(Math.random() * tracks.length);
  } else if (nextIdx < 0) {
    nextIdx = tracks.length - 1;
  }
  playTrackByIndex(nextIdx);
}

function nextTrack() {
  if (tracks.length === 0) return;
  let nextIdx = currentIndex + 1;
  if (isShuffle) {
    nextIdx = Math.floor(Math.random() * tracks.length);
  } else if (nextIdx >= tracks.length) {
    nextIdx = 0;
  }
  playTrackByIndex(nextIdx);
}

function toggleLike() {
  isLiked = !isLiked;
  const btn = document.getElementById('like-btn');
  btn.innerHTML = isLiked ? '<i class="ti ti-heart-filled" style="color:#1db954"></i>' : '<i class="ti ti-heart"></i>';
  btn.classList.toggle('liked', isLiked);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  document.getElementById('shuffle-btn').classList.toggle('active', isShuffle);
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  document.getElementById('repeat-btn').classList.toggle('active', isRepeat);
}

// Live, real-time typing search field engine connected directly to iTunes server
async function filterSearch(val) {
  if (!val) {
    initCards(); // Revert back to the main layout categories if input cleared
    return;
  }
  
  try {
    const response = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(val)}&media=music&limit=20`);
    const data = await response.json();
    
    if (data.results) {
      // Load search results seamlessly into the universal index pool
      const searchTracks = data.results.map(item => ({
        title: item.trackName,
        artist: item.artistName,
        image: item.artworkUrl100.replace('100x100bb', '300x300bb'),
        url: item.previewUrl
      }));
      
      // Update global pool tracking array context so next/prev works perfectly during search lists
      tracks = searchTracks;
      
      document.getElementById('search-cards').innerHTML = searchTracks.map((t, idx) => `
        <div class="card" onclick="playTrackByIndex(${idx})">
          <div class="card-img"><img src="${t.image}" style="width:100%;height:100%;object-fit:cover;border-radius:8px;" alt="Cover"></div>
          <div class="card-title">${t.title}</div>
          <div class="card-sub">${t.artist}</div>
          <button class="play-btn" onclick="event.stopPropagation(); playTrackByIndex(${idx})">
            <i class="ti ti-player-play"></i>
          </button>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error("Live search request dropped:", err);
  }
}

// Shortcut routing when clicking any category block item
async function triggerGenreSearch(genreName) {
  const searchInput = document.querySelector('.search-bar input');
  if (searchInput) {
    searchInput.value = genreName;
    await filterSearch(genreName);
  }
}

function fmtTime(s) {
  return Math.floor(s/60)+':'+(s%60<10?'0':'')+s%60;
}

// Kickstart Auth Routing Rules
initAuth();