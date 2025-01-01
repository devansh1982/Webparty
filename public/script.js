// Initialize WebSocket for real-time communication
const socket = new WebSocket('ws://localhost:3000'); // Backend WebSocket URL

// DOM Elements
const generateLinkBtn = document.getElementById('generate-link');
const videoPlayer = document.getElementById('video-player');
const browserFrame = document.getElementById('browser-frame');

// Generate Party Link
generateLinkBtn.addEventListener('click', () => {
  const link = `${window.location.href}?partyId=${Math.random().toString(36).substr(2, 8)}`;
  navigator.clipboard.writeText(link).then(() => alert('Link copied to clipboard!'));
  socket.send(JSON.stringify({ action: 'createParty', link }));
});

// Listen for Messages
socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  if (data.action === 'joinParty') {
    startWatchParty();
  } else if (data.action === 'syncBrowser') {
    browserFrame.src = data.url;
  }
});

// Start Watch Party
function startWatchParty() {
  alert('A new user has joined the watch party!');
  // Video call logic here (e.g., WebRTC setup)
}

// Open YouTube/Chrome Window
function openSyncedBrowser(url) {
  browserFrame.src = url;
  socket.send(JSON.stringify({ action: 'syncBrowser', url }));
}

// Example: Open YouTube when a button is clicked
document.getElementById('open-youtube').addEventListener('click', () => {
  openSyncedBrowser('https://www.youtube.com');
});
