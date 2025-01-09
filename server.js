const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static("public"));

// API route to create a new party
app.get("/start-party", (req, res) => {
  const partyId = uuidv4(); // Generate a unique party ID
  res.json({ link: `/party/${partyId}` });
});

// Serve the party page
app.get("/party/:partyId", (req, res) => {
  res.sendFile(__dirname + "/public/party.html");
});

// Handle video calls with socket.io
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join the room
  socket.on("join-call", (partyId) => {
    socket.join(partyId);
    socket.to(partyId).emit("user-connected", socket.id);

    // Handle disconnection
    socket.on("disconnect", () => {
      socket.to(partyId).emit("user-disconnected", socket.id);
    });
  });

  // Relay ICE candidates and SDP offers/answers
  socket.on("signal", (data) => {
    const { to, signal } = data;
    io.to(to).emit("signal", { from: socket.id, signal });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});