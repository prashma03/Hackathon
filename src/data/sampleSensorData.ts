export const sampleSensorData = {
  bracelet: {
    connected: true,
    battery: 84,
    lastSynced: "2 min ago",
  },

  mother: {
    name: "Maya",
    pregnancyWeek: 28,
  },

  vitals: {
    heartRate: {
      title: "Heart rate",
      value: "77",
      unit: "bpm",
    },
    hrv: {
      title: "HRV",
      value: "60",
      unit: "ms",
    },
    bloodPressure: {
      title: "Blood pressure",
      value: "115/74",
      unit: "mmHg",
    },
    oxygen: {
      title: "Oxygen SpO₂",
      value: "99",
      unit: "%",
    },
    skinTemp: {
      title: "Skin temp",
      value: "98.4",
      unit: "°F",
    },
    respiration: {
      title: "Respiration",
      value: "15",
      unit: "/min",
    },
  },

  risk: {
    level: "Green",
    message: "All clear",
    confidence: "97%",
    headline: "Everything\nlooks healthy.",
    description:
      "Materna sees stable vitals in your normal range. Nothing for you to do — keep living your day.",
    action: "No action needed",
  },
};