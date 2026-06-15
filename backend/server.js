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
app.get("/", (_req, res) => {
  res.json({
    status: "Materna Backend Running",
  });
});

// Risk calculator
app.post("/risk", (req, res) => {
  try {
    const patientData = req.body;

    const result = calculateRisk(patientData);

    res.json({
      success: true,
      risk: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Risk calculation failed.",
    });
  }
});

// Update patient vitals
app.post("/vitals", (req, res) => {
  const {
    heartRate,
    bloodPressure,
    oxygen,
    temperature,
    respiration,
  } = req.body;

  patientVitals = {
    heartRate: heartRate || 0,
    bloodPressure: bloodPressure || "",
    oxygen: oxygen || 0,
    temperature: temperature || 0,
    respiration: respiration || 0,
  };

  res.json({
    success: true,
    message: "Vitals updated successfully",
    vitals: patientVitals,
  });
});

// Doctor dashboard gets latest vitals
app.get("/vitals", (_req, res) => {
  res.json({
    success: true,
    vitals: patientVitals,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});