// Import necessary modules
const express = require("express"); // For creating the web server
const bodyParser = require("body-parser"); // For parsing JSON request bodies
const { v4: uuidv4 } = require("uuid"); // For generating unique IDs

// Initialize the Express app and set the port
const app = express();
const port = 3000;

// Use the JSON body parser middleware
app.use(bodyParser.json());

// A simple in-memory storage for receipts and their calculated points
const receipts = {};

// Helper function to calculate points based on specific rules
function calculateReceiptPoints(receipt) {
  let points = 0;

  // Rule 1: Add 1 point for every alphanumeric character in the retailer's name
  const retailerName = receipt.retailer.replace(/[^a-zA-Z0-9]/g, ""); // Remove non-alphanumeric characters
  points += retailerName.length;

  // Rule 2: Add 50 points if the total amount is a whole dollar (e.g., $50.00)
  const totalAmount = parseFloat(receipt.total);
  if (total % 1 === 0) points += 50;

  // Rule 3: Add 25 points if the total amount is a multiple of 0.25
  if (total % 0.25 === 0) points += 25;

  // Rule 4: Add 5 points for every pair of items purchased
  const itemPurchased = receipt.items.length;
  points += Math.floor(itemPurchased / 2) * 5;

  // Rule 5: Add points if an item's description length is a multiple of 3
  receipt.items.forEach((item) => {
    const descriptionLength = item.shortDescription.trim().length; // Ignore leading/trailing spaces
    if (descriptionLength % 3 === 0) {
      const price = parseFloat(item.price);
      points += Math.ceil(price * 0.2); // Add 20% of the item's price as points
    }
  });

  // Rule 6: Add 6 points if the purchase day is an odd number
  const purchaseDay = new Date(receipt.purchaseDate).getDate();
  if (purchaseDay % 2 === 1) points += 6;

  // Rule 7: Add 10 points if the purchase time is between 2:00 PM and 4:00 PM
  const [hour, minute] = receipt.purchaseTime.split(":").map(Number);
  if (hour === 14 || (hour === 15 && minute < 60)) points += 10;

  return points; // Return the total points
}

// Endpoint to process a receipt and calculate points
app.post("/receipts/process", (req, res) => {
  const receipt = req.body; // Get the receipt data from the request body
  const id = uuidv4(); // Generate a unique ID for the receipt
  const points = calculateReceiptPoints(receipt); // Calculate the points
  receipts[id] = points; // Store the points in memory with the ID
  res.json({ id }); // Respond with the ID
});

// Endpoint to retrieve points for a specific receipt by ID
app.get("/receipts/:id/points", (req, res) => {
  const id = req.params.id; // Get the receipt ID from the URL
  if (!(id in receipts)) {
    // If the ID doesn't exist, return a 404 error
    return res.status(404).json({ error: "Receipt not found" });
  }
  res.json({ points: receipts[id] }); // Respond with the points for the receipt
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Receipt Processor running at http://localhost:${port}`);
});
