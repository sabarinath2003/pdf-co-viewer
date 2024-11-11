// server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let currentPage = 1; // Tracks the current page displayed by the admin

// Serve static files from the public folder
app.use(express.static("public"));

// Handle socket connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Send the current page to new viewers
  socket.emit("page-change", currentPage);

  // Handle page change by admin
  socket.on("admin-change-page", (page) => {
    currentPage = page;
    io.emit("page-change", page); // Broadcast to all connected users
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
