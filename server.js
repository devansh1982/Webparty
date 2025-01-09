const express = require('express');
const http = require('http');
const { v4: uuidv4 } = require('uuid');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Example party storage (use a database in production)
const parties = {};

// Serve static files
app.use(express.static('public'));

// Create a new party
app.post('/create-party', (req, res) => {
  const partyID = uuidv4();
  parties[partyID] = { createdAt: new Date(), participants: [] };
  res.json({ link: `https://your-app-url.com/party/${partyID}` });
});

// Serve the party page
app.get('/party/:partyID', (req, res) => {
  const { partyID } = req.params;
  if (!parties[partyID]) return res.status(404).send('Party not found');
  res.sendFile(path.join(__dirname, 'public', 'party.html'));
});

// WebSocket connection for video calls
io.on('connection', (socket) => {
  socket.on('join-party', (partyID) => {
    if (!parties[partyID]) return;

    socket.join(partyID);
    socket.to(partyID).emit('user-joined', socket.id);

    socket.on('disconnect', () => {
      socket.to(partyID).emit('user-left', socket.id);
    });

    socket.on('offer', ({ targetID, offer }) => {
      socket.to(targetID).emit('offer', { senderID: socket.id, offer });
    });

    socket.on('answer', ({ targetID, answer }) => {
      socket.to(targetID).emit('answer', { senderID: socket.id, answer });
    });

    socket.on('ice-candidate', ({ targetID, candidate }) => {
      socket.to(targetID).emit('ice-candidate', { senderID: socket.id, candidate });
    });
  });
});

// Start the server
server.listen(3000, () => console.log('Server running on http://localhost:3000'));