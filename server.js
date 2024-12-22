const express = require("express");
const bodyParser = require("body-parser");
const seatAllocationController = require("./Controller/seatAllocationController");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.post("/allocateSeats", seatAllocationController.allocateSeats);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
