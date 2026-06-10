const express = require("express");
const cors = require("cors");
const calculateRisk = require("./riskCalculator");

const app = express();

app.use(cors());
app.use(express.json());

// Store latest patient vitals
let patientVitals = {
  heartRate: 0,
  bloodPressure: "",
  oxygen: 0,
  temperature: 0,
  respiration: 0,
};

// Test route
app.get("/", (req, res) => {
  res.json({
    status: "Materna Backend Running",
  });
});

// Risk calculator route
app.post("/risk", (req, res) => {
  const patientData = req.body;

  const result = calculateRisk(patientData);

  res.json({
    success: true,
    risk: result,
  });
});

// Update patient vitals
app.post("/vitals", (req, res) => {
  patientVitals = req.body;

  res.json({
    success: true,
    message: "Vitals updated successfully",
  });
});

// Get latest patient vitals
app.get("/vitals", (req, res) => {
  res.json(patientVitals);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});