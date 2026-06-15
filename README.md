# Materna

**Two hearts, one wrist.**

Materna is an Expo React Native mobile prototype for improving maternal and
infant health coordination in rural Arkansas. It connects a patient-facing
pregnancy monitoring experience with a linked doctor dashboard.

The prototype demonstrates how wearable vital signs, patient-reported
symptoms, pregnancy history, emergency alerts, care navigation, and shared
reports could help identify risk earlier and connect rural mothers with care.

> Materna is a hackathon prototype. It is not a medical device, diagnostic
> system, emergency service, or substitute for professional medical care.

## Problem

Many pregnant people in rural Arkansas face:

- Long travel times to labor and delivery services
- Maternity care deserts and hospital service closures
- Transportation barriers
- Obstetric workforce shortages
- Fragmented patient, clinic, and hospital communication
- Delayed recognition of worsening symptoms

Materna explores a connected workflow in which a bracelet collects health
signals, the patient reports symptoms through the app, and the care team sees
prioritized alerts and supporting information.

## Product Overview

Materna has two experiences inside one mobile application.

### Patient Experience

- Animated Materna welcome screen
- Patient or doctor role selection
- Light and dark themes
- Green, yellow, and red risk demonstrations
- Bracelet status and vital-sign cards
- AI pregnancy symptom assistant
- Emergency activation with a cancellation countdown
- Nearby hospital and emergency-care navigation
- Searchable list of all 75 Arkansas counties
- Patient profile and pregnancy history
- Automatic weekly pregnancy-week advancement
- Patient-approved PDF health report
- Early-risk review based on profile and chat warning signals

### Doctor Experience

- Clinical overview and priority queue
- Patient search and patient detail pages
- Emergency alert popup and persistent alert banner
- Current vitals and contact information
- Profile and pregnancy-history review
- Early high-risk review flags with contributing reasons
- Shared PDF report history
- Preloaded sample reports for presentation reliability
- Editable doctor profile
- Home, Patients, Reports, and Profile navigation

## Current Prototype Status

### Implemented

- Expo SDK 54 React Native application
- Android, iOS through Expo Go, and limited web support
- Responsive mobile interface
- Device-local profile storage with AsyncStorage
- Date-of-birth month, day, and year selectors
- Required-field validation before generating a PDF
- PDF generation and native share sheet
- Materna logo, patient data, bracelet snapshot, and risk summary in PDFs
- AI API integration with a local safety-oriented fallback
- Cross-device emergency demo using the configured API
- Native map, location permission, hospital markers, and moving demo ambulances
- Doctor dashboard sample and live report merging

### Simulated or Demonstration Data

- Bracelet and sensor readings
- Bluetooth connection
- Ambulance movement and availability
- Hospital bed and department availability
- Green, yellow, and red clinical scenarios
- Some patients and doctor reports
- Travel-time estimates

### Not Yet Production Ready

- Real Bluetooth Low Energy bracelet integration
- Clinically validated alert thresholds or predictive model
- Real hospital capacity feeds
- Real ambulance dispatch
- Secure authentication and role management
- Encrypted backend database
- HIPAA compliance assessment
- Push notifications when the app is closed
- Audit logs, consent versioning, and clinical governance
- FDA or other medical-device regulatory review

## Technology

| Area | Technology |
| --- | --- |
| Mobile app | React Native 0.81 |
| Framework | Expo SDK 54 |
| Language | JavaScript and TypeScript |
| Local storage | AsyncStorage |
| Maps and location | react-native-maps, expo-location |
| PDF reports | expo-print, expo-sharing, expo-file-system |
| Icons | lucide-react-native |
| API client | Fetch API |
| Demo server | Node.js, Express, CORS |
| Remote AI service | Configured FastAPI/ngrok endpoint |

## Quick Start

### Requirements

- Node.js 18 or newer
- npm
- Expo Go with SDK 54 support
- A phone and development computer on the same Wi-Fi for LAN mode

### Install

```powershell
git clone <repository-url>
cd Hackathon-1
npm install
```

### Start Expo

```powershell
npx expo start --clear
```

Scan the QR code with Expo Go.

If QR scanning does not work, confirm that the phone and computer use the same
Wi-Fi. In Expo Go, manually enter:

```text
exp://YOUR_COMPUTER_IP:8081
```

Find the computer IP on Windows with:

```powershell
ipconfig
```

Use the IPv4 address under the active Wi-Fi adapter.

### Available Commands

```powershell
npm start
npm run android
npm run ios
npm run web
```

`npm run android` requires Android Studio, an Android SDK, and `adb`. Expo Go
does not require Android Studio.

## Running the Local Demo Server

The repository includes an Express demo server:

```powershell
node backend/server.js
```

It listens on port `5000`.

For a physical phone, do not use `localhost` as the API address. Update
`src/config/config.js` to use the computer's LAN address:

```js
export const MATERNA_URL = "http://YOUR_COMPUTER_IP:5000";
```

Both phones must be able to reach that address. Windows Firewall may request
permission for Node.js; allow access on the active network.

The configured public ngrok URL is temporary and may expire or expose a
different backend version. Replace it when the tunnel changes.

## API Configuration

API settings are located in:

```text
src/config/config.js
```

The prototype defines:

- `MATERNA_URL`
- Shared JSON/ngrok headers
- Demo doctor Basic Authentication credentials

The credentials are intentionally hardcoded for the hackathon demonstration.
They must never be used in a production application.

### Remote AI API

The API client supports:

- `POST /ingest`
- `POST /assist`
- `GET /patients`
- `GET /history/:patientId`
- `GET /conversations/:patientId`

### Express Demo API

The included Node server supports:

- `GET /`
- `POST /risk`
- `POST /vitals`
- `GET /vitals`
- `POST /reports`
- `GET /reports`
- `POST /emergency-alerts`
- `GET /emergency-alerts`
- `POST /emergency-alerts/:alertId/acknowledge`

Reports and emergency alerts are stored in memory and disappear when the
server restarts.

## Emergency Alert Flow

1. The patient opens the Emergency screen.
2. The patient taps the large emergency button.
3. A three-second countdown allows cancellation.
4. Materna sends the patient ID, name, pregnancy week, location label, and
   bracelet snapshot.
5. The doctor dashboard checks for alerts every two seconds.
6. The doctor sees a popup and persistent red banner.
7. The doctor acknowledges the alert.

If the configured server does not implement `/emergency-alerts`, the prototype
uses a structured emergency event through the existing AI conversation API.
This compatibility fallback is intended only for the hackathon demo.

The emergency UI does not contact real emergency services automatically.
Users should call 911 during an actual emergency.

## Patient Profile and Reports

Profile data is stored locally with AsyncStorage.

Required before a PDF can be created:

- Full name
- Date of birth
- County
- Age
- Pregnancy week
- Emergency contact

Additional profile fields include:

- Weight and height
- Previous pregnancies
- Miscarriage history
- High blood pressure
- Diabetes
- Anemia
- Previous C-section
- Medications
- Preferred hospital or clinic
- Permission to share with the linked doctor

The pregnancy week advances by one after each complete seven-day interval. If
the patient edits the week manually, that date becomes the new tracking point.
The value is capped at week 42.

The generated PDF includes:

- Materna logo
- Report date
- Patient and pregnancy information
- Bracelet status and battery
- Current vital-sign snapshot
- Medical history
- Emergency and preferred-care contacts
- Current risk state
- Explainable early-risk review reasons
- Medical-use disclaimer

## Early-Risk Review

Materna combines demonstration signals from:

- Patient-entered profile history
- Maternal age
- High blood pressure or diabetes history
- Miscarriage, anemia, and C-section history
- Warning phrases entered in AI chat
- Current demonstration bracelet scenario

Examples of chat signals include:

- Chest, jaw, or breathing symptoms
- Bleeding or spotting
- Vision changes
- Sudden swelling
- Severe headache
- Reduced fetal movement

The doctor dashboard labels the result as an **early review flag**, not a
diagnosis, and displays the contributing reasons.

## AI Symptom Assistant

`AIChatScreen.tsx` sends messages to the configured `/assist` API. It:

- Prevents duplicate submissions
- Shows a loading indicator
- Waits up to 90 seconds for the remote API
- Uses a local keyword-based fallback when the server is unavailable
- Records important warning signals for risk review
- Can share consented warning signals with the linked doctor workflow

The assistant should not be described as diagnosing a condition. Its purpose
is symptom documentation, safety guidance, and escalation.

## Hospital and Care Navigation

The Hospitals screen includes:

- Live-location permission
- Native map on iOS and Android
- Hospital and ambulance markers
- Demo moving ambulance locations
- Search across all 75 Arkansas counties
- Labor and delivery and emergency-department availability cards
- Direct call and Google Maps directions
- Haversine distance calculation
- Estimated road mileage and travel time
- Emergency-department prioritization during a red scenario

Only a small set of hospital records currently contains demo availability and
coordinates. Selecting another county may correctly show that no listed care
is available. Production use would require verified statewide data feeds.

## Doctor Dashboard Demo Data

The doctor dashboard starts with sample reports for:

- Maya Johnson
- Maria Gonzalez
- Tanya Williams

Sample reports are marked `SAMPLE`. A newly shared report is marked `LIVE` and
replaces the sample report for the same patient.

This design keeps the dashboard useful during a presentation even when the
network is unavailable.

## Project Structure

```text
Hackathon-1/
|-- App.js                         Main app state and role selection
|-- app.json                       Expo name, icon, and platform settings
|-- index.js                       Expo entry point
|-- assets/
|   `-- materna-app-icon.png       App and PDF logo
|-- backend/
|   |-- riskCalculator.js          Demo rule-based risk score
|   `-- server.js                  Express demo API
|-- src/
|   |-- api/
|   |   `-- maternaAPI.js          API requests and compatibility fallbacks
|   |-- components/
|   |   |-- HospitalMap.native.tsx Native map implementation
|   |   |-- HospitalMap.web.tsx    Web fallback
|   |   `-- ...                    Shared UI components
|   |-- config/
|   |   `-- config.js              API URL, headers, demo credentials
|   |-- data/
|   |   |-- sampleSensorData.ts    Green, yellow, and red scenarios
|   |   `-- ...                    Additional demo data
|   |-- screens/
|   |   |-- AIChatScreen.tsx
|   |   |-- HomeScreen.tsx
|   |   |-- HospitalsScreen.tsx
|   |   |-- VitalsScreen.tsx
|   |   |-- emergencyscreen.tsx
|   |   |-- profilescreen.tsx
|   |   `-- doctor/
|   |       `-- DoctorWorkspace.tsx
|   |-- storage/
|   |   |-- chatRiskStorage.ts
|   |   `-- profileStorage.ts
|   |-- styles/
|   `-- utils/
|       |-- maternalRiskAssessment.ts
|       `-- profileReport.ts
|-- package.json
|-- tsconfig.json
`-- README.md
```

Some earlier experimental screens and HTML design references remain in the
repository but are not part of the primary `App.js` navigation.

## Verification

Check TypeScript:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit --pretty false
```

Build an Android export:

```powershell
npx expo export --platform android --output-dir .expo-export-test --clear
```

Check backend syntax:

```powershell
node --check backend/server.js
```

Before presenting, test:

- Patient and doctor phones can reach the same API
- AI response or fallback appears
- Emergency alert reaches the doctor
- Location permission works
- PDF generation opens the share sheet
- A backup screen recording is available

## Recommended Four-Minute Demo

1. Select Patient from the role screen.
2. Introduce Maya with green, stable readings.
3. Move to yellow and red to show worsening patterns.
4. Enter chest pain or breathing trouble in Ask Materna.
5. Activate Emergency and complete the countdown.
6. Show the alert arriving on the doctor's phone.
7. Open Maya's report for care context.
8. Show emergency-care navigation.

Core message:

> Materna connects continuous monitoring, patient-reported symptoms, and
> care-team coordination so rural mothers can recognize risk and reach care
> earlier.

## Production Roadmap

### Clinical and Research

- Establish clinical advisory leadership
- Validate warning thresholds with obstetric specialists
- Conduct usability research with rural patients
- Define escalation protocols and human-review requirements
- Run an approved pilot with a healthcare partner

### Hardware

- Select and validate bracelet sensors
- Implement Bluetooth Low Energy pairing
- Handle calibration, battery, disconnection, and missing data
- Validate signal quality across skin tones and real-world conditions

### Platform

- Replace in-memory storage with a secure database
- Add real authentication and organization roles
- Encrypt data in transit and at rest
- Add push notifications
- Add audit history and clinician notes
- Integrate with EHR systems using standards such as FHIR
- Use verified hospital, service, and transportation data

### Safety, Privacy, and Regulation

- Complete HIPAA security and privacy review
- Define data retention and patient-consent policies
- Perform threat modeling and penetration testing
- Review FDA medical-device implications
- Add accessibility and language support
- Establish incident response and clinical oversight

## Team 5

Challenge 05: Improving Rural Maternal Health

- Kshitiz Khatiwada: Data ETL, research analysis, technology
- Pronita Ghimire: UI design, public speaking, creative direction
- Garay Gulmammadov: Web and graphic design, presentation
- Alyson Chapman: Engineering, neural networks
- Ivonne Barbosa-Melgarejo: Health data analysis, storytelling
- Ali Rizwan: Python development, logical problem solving
- Isidora Adeola: Health information education, application UI

Challenge author: Allan Nichols, CEO of Mainline Health Systems, Inc.

Coaches: Alese Johnston, Tim Reardon, and Allison Thompson.

## Safety Disclaimer

Materna currently uses simulated data and unvalidated rules. It must not be
used to make real clinical decisions. In an emergency, call 911 or the
appropriate local emergency number. Any production version would require
clinical validation, secure infrastructure, regulatory review, and formal
partnerships with healthcare organizations.
