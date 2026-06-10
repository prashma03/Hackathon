import { MATERNA_URL, DOCTOR_CREDENTIALS } from '../config/config';

const doctorHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${DOCTOR_CREDENTIALS}`
};

export const sendSensorData = async (patientId, patientName, weeks, sensors) => {
  try {
    const response = await fetch(`${MATERNA_URL}/ingest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        patient_id:        patientId,
        patient_name:      patientName,
        gestational_weeks: weeks,
        timestamp:         new Date().toISOString(),
        sensors: {
          heart_rate:    sensors.heartRate,
          spo2:          sensors.spO2,
          temperature:   sensors.temperature,
          hrv_rmssd:     sensors.hrv,
          gsr:           sensors.gsr,
          motion:        sensors.motion,
          ptt:           sensors.ptt   || null,
          fall_detected: sensors.fall  || false
        }
      })
    });
    return await response.json();
  } catch (error) {
    console.error('sendSensorData error:', error);
    return null;
  }
};

export const askAssistant = async (patientId, message, currentSensors, riskLevel) => {
  try {
    const response = await fetch(`${MATERNA_URL}/assist`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'

       },
      body: JSON.stringify({
        patient_id: patientId,
        message:    message,
        risk_level: riskLevel,
        sensors: currentSensors ? {
          heart_rate:  currentSensors.heartRate,
          spo2:        currentSensors.spO2,
          temperature: currentSensors.temperature,
          hrv_rmssd:   currentSensors.hrv,
          gsr:         currentSensors.gsr,
          motion:      currentSensors.motion
        } : null
      })
    });
    const result = await response.json();
    return result.response;
  } catch (error) {
    console.error('askAssistant full error:', error.message, error);
    return "Unable to reach assistant. Please contact your doctor if concerned.";
  }
};

export const getAllPatients = async () => {
  try {
    const response = await fetch(`${MATERNA_URL}/patients`, {
      method:  'GET',
      headers: doctorHeaders
    });
    const result = await response.json();
    return result.patients;
  } catch (error) {
    console.error('getAllPatients error:', error);
    return [];
  }
};

export const getPatientHistory = async (patientId, hours = 24) => {
  try {
    const response = await fetch(
      `${MATERNA_URL}/history/${patientId}?hours=${hours}`, {
      method:  'GET',
      headers: doctorHeaders
    });
    const result = await response.json();
    return result.readings;
  } catch (error) {
    console.error('getPatientHistory error:', error);
    return [];
  }
};

export const getPatientConversations = async (patientId) => {
  try {
    const response = await fetch(
      `${MATERNA_URL}/conversations/${patientId}`, {
      method:  'GET',
      headers: doctorHeaders
    });
    const result = await response.json();
    return result.conversations;
  } catch (error) {
    console.error('getPatientConversations error:', error);
    return [];
  }
};