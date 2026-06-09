const express = require("express");
const cors = require("cors");
const calculateRisk = require("./riskCalculator");

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.json({
    status: "Materna Backend Running"
  });
});

// Risk calculator route
app.post("/risk", (req, res) => {
  const patientData = req.body;

  const result = calculateRisk(patientData);

  res.json({
    success: true,
    risk: result
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});