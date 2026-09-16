# 🏥 Aarogyavaani — AI-Powered Hospital Clinical Intake Platform

**Aarogyavaani** (आरोग्यवाणी - "Voice of Health") is a comprehensive digital healthcare platform that modernizes hospital OPD operations through intelligent patient kiosks, real-time staff dashboards, and seamless clinical workflows.

[![React](https://img.shields.io/badge/React-18.3-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Overview

**Aarogyavaani** streamlines hospital outpatient operations with:
- **Multilingual Patient Kiosks** (English, Hindi, Punjabi) with voice guidance
- **AI-Powered Clinical History** intake with red-flag detection
- **Real-Time Staff Dashboards** for doctors, nurses, and administrators
- **Integrated Triage System** with priority-based queue management
- **ABDM Integration** ready (Ayushman Bharat Digital Mission)
- **Offline-First Architecture** with graceful backend sync

---

## 🎯 Key Features

### 👤 Patient Experience
- ✅ **Touchscreen Kiosk Interface** — Accessible, voice-guided, 64px touch targets
- 🌐 **Multilingual Support** — English, Hindi (हिन्दी), Punjabi (ਪੰਜਾਬੀ)
- 🎤 **Voice Assistant** — Speaks instructions in selected language
- 🏥 **ABHA Integration** — QR code & mobile number verification
- 📋 **AI Clinical History** — Smart symptom collection with follow-up questions
- 🚨 **Red Flag Detection** — Automatic P1 escalation for emergency symptoms
- 📄 **Document OCR** — Scan and extract medical reports
- 🎫 **Token Generation** — Queue position with estimated wait time

### 👨‍⚕️ Doctor Portal
- 📊 **Live Dashboard** — Queue overview with AI-ready summaries
- 🔔 **Red Flag Alerts** — Emergency patient notifications
- 📝 **Patient Case View** — Complete medical history, vitals, documents
- 🩺 **Consultation Workspace** — Streamlined exam, diagnosis, prescription flow
- 📈 **Clinical Timeline** — Past visits and treatment history
- 🔄 **Call Next Patient** — One-click queue management

### 👩‍⚕️ Nurse/Triage Portal
- ✅ **Rapid Assessment** — Consciousness, pain scale, quick notes
- 💓 **Vitals Recording** — BP, HR, SpO2, temp with range checking
- ⚡ **Priority Assignment** — P1 (Emergency), P2 (Urgent), P3 (Routine)
- 📊 **Live Queue Dashboard** — Waiting patients with priority indicators
- 🔔 **Vital Breach Alerts** — Automatic flagging of abnormal readings
- 🔄 **Real-Time Sync** — Updates visible to all staff immediately

### 🔐 Admin Portal
- 🖥️ **Kiosk Fleet Management** — Monitor status, battery, connectivity
- 📈 **Analytics Dashboard** — Patient flow, wait times, staff utilization
- 👥 **Staff Management** — Doctor/nurse assignments and schedules
- 🏥 **OPD Operations** — Facility-wide queue monitoring
- 🔒 **Audit & Access Control** — NABH-compliant logging
- ⚙️ **System Settings** — Configuration and compliance

---

## 🏗️ Architecture

### Tech Stack
- **Frontend:** React 18 + Vite + React Router v6
- **Backend:** Node.js + Express + Mongoose
- **Database:** MongoDB (with in-memory fallback for demos)
- **Styling:** Pure CSS (no frameworks) with CSS Variables
- **State Management:** React Context + localStorage + CustomEvents

### Project Structure
```
Aarogyavaani/
├── frontend/                    # React + Vite SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── StaffShell.jsx  # Staff portal layout
│   │   │   ├── KioskShell.jsx  # Patient kiosk layout
│   │   │   ├── Icon.jsx        # SVG icon system
│   │   │   └── ui.jsx          # UI component library
│   │   ├── pages/              # Route components
│   │   │   ├── checkin/        # Patient registration flow
│   │   │   ├── history/        # Clinical history intake
│   │   │   ├── documents/      # Document scanning & OCR
│   │   │   ├── queue/          # Patient waiting screens
│   │   │   ├── doctor/         # Doctor portal pages
│   │   │   ├── triage/         # Nurse/triage pages
│   │   │   └── admin/          # Admin portal pages
│   │   ├── css/                # Styling (CSS Variables)
│   │   │   ├── variables.css   # Design tokens
│   │   │   ├── base.css        # Reset & typography
│   │   │   ├── components.css  # Shared components
│   │   │   ├── kiosk.css       # Patient kiosk styles
│   │   │   ├── staff.css       # Staff portal styles
│   │   │   └── responsive.css  # Media queries
│   │   ├── data/               # API & state management
│   │   │   ├── queueStore.js   # Central queue store
│   │   │   ├── api.js          # Backend API client
│   │   │   ├── doctorApi.js    # Doctor workflow API
│   │   │   └── mock.js         # Mock data for demos
│   │   └── context/            # React context providers
│   │       └── AppContext.jsx  # Global app state
│   └── vite.config.js
├── backend/                     # Express + MongoDB API
│   ├── src/
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API route handlers
│   │   └── middleware/         # Auth, validation, etc.
│   ├── server.js               # Entry point
│   └── .env                    # Environment variables
└── DATA_FLOW_VERIFICATION.md   # System architecture docs
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB 6+ (optional, works with in-memory fallback)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/your-org/aarogyavaani.git
cd aarogyavaani
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file (optional)
echo "MONGO_URI=mongodb://localhost:27017/aarogyavaani" > .env
echo "JWT_SECRET=your-secret-key-here" >> .env
echo "PORT=5000" >> .env

# Start backend server
npm run dev
# Backend running at http://localhost:5000
```

#### 3. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
# Frontend running at http://localhost:5173
```

#### 4. Access the Application
- **Patient Kiosk:** http://localhost:5173/
- **Staff Login:** http://localhost:5173/staff/login

---

## 🔑 Demo Credentials

### Staff Login (http://localhost:5173/staff/login)

| Staff ID | Password | Role | Dashboard |
|----------|----------|------|-----------|
| `DOC-104` | `doctor123` | Doctor | General Medicine OPD |
| `NUR-88421` | `nurse123` | Nurse | Triage Station |
| `ADM-01` | `admin123` | Administrator | Facility Command Center |

---

## 📱 User Flows

### Patient Journey
```
Welcome Screen
    ↓
Language Selection (English/Hindi/Punjabi)
    ↓
Accessibility Settings (Voice, Large Text)
    ↓
Identification (ABHA QR/Mobile or New Registration)
    ↓
Department Selection
    ↓
Token Generation
    ↓
Clinical History Intake (AI-guided)
    ↓
Document Upload & OCR
    ↓
Vitals Recording
    ↓
Queue Waiting Screen (Live Updates)
    ↓
Doctor Consultation
    ↓
Exit Summary & Prescription
```

### Nurse/Triage Workflow
```
Triage Dashboard → Select Patient → Rapid Assessment
    ↓
Record Vitals (BP, HR, SpO2, Temp)
    ↓
Assign Priority (P1/P2/P3)
    ↓
Handoff to Doctor (Real-time queue update)
```

### Doctor Workflow
```
Doctor Dashboard → Review Queue → Call Next Patient
    ↓
Review AI Summary + Patient History
    ↓
Consultation Workspace (Exam, Diagnosis)
    ↓
Complete Consultation (Prescription, Follow-up)
    ↓
Next Patient
```

---

## 🔄 Real-Time Data Synchronization

**Aarogyavaani** uses a centralized queue store with real-time updates:

### Data Flow Architecture
```
Patient Check-in ──┐
                   ├──> queueStore (localStorage + CustomEvent)
Nurse Actions ─────┤
                   ├──> Doctor Dashboard (live updates)
Doctor Actions ────┤    Nurse Dashboard (live updates)
                   └──> Admin Dashboard (live monitoring)
```

### Key Features
- ✅ **Offline-First:** Updates happen locally first
- ✅ **Cross-Tab Sync:** Multiple browser tabs stay synchronized
- ✅ **Graceful Degradation:** Backend sync fails silently if offline
- ✅ **Event-Driven:** CustomEvents for instant UI updates
- 🔄 **Socket.IO Ready:** Comments indicate where to add real-time backend sync

See [`DATA_FLOW_VERIFICATION.md`](./DATA_FLOW_VERIFICATION.md) for detailed architecture.

---

## 🎨 Design System

### Colors
- **Navy:** `#172554` (Primary, headers)
- **Blue:** `#138808` (Trust, actions - using green for health theme)
- **Saffron:** `#FF9933` (Accent, warnings)
- **Priority System:**
  - P1 (Emergency): `#DC2626` Red
  - P2 (Urgent): `#D97706` Orange
  - P3 (Routine): `#059669` Green

### Typography
- **Headings:** Montserrat / Plus Jakarta Sans
- **Body:** Inter
- **Touch Targets:** 64px (patient kiosk), 44px (staff portals)

### Modern UI Features
- ✨ Refined shadows with multiple layers
- 🎨 Glass-morphism on topbar (backdrop blur)
- 🔄 Smooth transitions (cubic-bezier easing)
- 📱 Fully responsive (mobile → tablet → desktop)
- 🎯 Accessible color contrast ratios
- 🖨️ Print-friendly styles

---

## 🔌 API Endpoints

### Authentication
- `POST /api/login` - Staff login

### Patients & Tokens
- `GET /api/patients` - List all patients
- `POST /api/patients` - Create new patient
- `GET /api/tokens` - Get queue tokens
- `POST /api/tokens` - Issue new token
- `PATCH /api/tokens/:id` - Update token status

### Clinical Data
- `POST /api/intakes` - Save clinical history
- `GET /api/documents` - List medical documents
- `POST /api/documents` - Upload document
- `POST /api/consultations` - Complete consultation

### Staff Operations
- `GET /api/kiosks` - Kiosk fleet status
- `GET /api/staff` - Staff directory
- `GET /api/analytics` - Hospital analytics
- `GET /api/alerts` - Red flag alerts

See [`backend/README.md`](./backend/README.md) for complete API documentation.

---

## 🧪 Development

### Build for Production
```bash
# Frontend
cd frontend
npm run build
# Outputs to frontend/dist/

# Backend
cd backend
npm start
```

### Environment Variables
```env
# Backend (.env)
MONGO_URI=mongodb://localhost:27017/aarogyavaani
JWT_SECRET=your-secret-key-here
PORT=5000

# Frontend (.env)
VITE_API_URL=http://localhost:5000/api
```

---

## 📋 Roadmap

- [ ] **WebSocket Integration** - Real-time updates across devices
- [ ] **Mobile Apps** - React Native for patient & staff apps
- [ ] **ABDM Full Integration** - Complete Ayushman Bharat integration
- [ ] **Biometric Authentication** - Fingerprint/face recognition
- [ ] **Prescription Printing** - Auto-print prescriptions
- [ ] **SMS Notifications** - Queue status updates via SMS
- [ ] **Analytics Dashboard** - Advanced reporting & insights
- [ ] **Multi-Facility Support** - Hospital chain management

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before submitting PRs.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

Built for **Smart India Hackathon 2024** by Team Aarogyavaani

---

## 📞 Support

For issues and questions:
- 📧 Email: support@aarogyavaani.com
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/aarogyavaani/issues)
- 📖 Docs: [Documentation](https://docs.aarogyavaani.com)

---

## 🙏 Acknowledgments

- Indian healthcare system protocols and standards
- NABH (National Accreditation Board for Hospitals)
- ABDM (Ayushman Bharat Digital Mission)
- Open-source community

---

**Made with ❤️ for Indian Healthcare**
