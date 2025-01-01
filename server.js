const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // Use PORT environment variable or default to 3000

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Default route to serve the main HTML file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Handle all other routes with a 404 message
app.use((req, res) => {
  res.status(404).send("404: Page not found");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
