# 🏥 Aarogyavaani Backend API

Express + Mongoose REST API for the **Aarogyavaani** hospital clinical-intake platform. Works with MongoDB when available, otherwise gracefully falls back to an in-memory demo store.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB 6+ (optional — in-memory fallback included)

### Run

```bash
npm install
npm run dev     # Starts at http://localhost:5000 with auto-reload
```

### Production
```bash
npm start
```

---

## 🔑 Demo Staff Logins

| Staff ID | Password | Role | Department |
|---|---|---|---|
| `DOC-104` | `doctor123` | Doctor | General Medicine |
| `NUR-88421` | `nurse123` | Nurse | Triage Station |
| `ADM-01` | `admin123` | Admin | Facility Operations |

---

## 📡 API Endpoints

### System & Auth
- `GET  /api/health` — Service health check
- `POST /api/login` `{ staffId, password }` — Staff authentication

### Patients & OPD Queue
- `GET  /api/patients` — List patients
- `POST /api/patients` — Register patient
- `GET  /api/tokens` — Live OPD queue
- `POST /api/tokens` — Issue token
- `PATCH /api/tokens/:id` — Update token status & priority
- `PATCH /api/tokens/:id/vitals` — Update vitals
- `PATCH /api/tokens/:id/assessment` — Update triage assessment

### Doctor & Clinical Flows
- `GET  /api/doctor/dashboard` — Doctor queue & alerts overview
- `POST /api/opd/call-next` `{ room }` — Call next eligible patient
- `GET  /api/patients/:id/case` — Full clinical case data
- `GET  /api/patients/:id/timeline` — Visit history & timeline
- `POST /api/intakes` — Save patient clinical history
- `GET  /api/documents` — List uploaded reports & documents
- `POST /api/documents` — OCR document upload
- `POST /api/consultations` — Complete consultation & prescription

### Alerts & Ops
- `GET  /api/alerts` — Active red flags & priority alerts
- `POST /api/alerts` — Trigger alert
- `PATCH /api/alerts/:id` — Acknowledge alert
- `GET  /api/kiosks` — Kiosk fleet telemetry & status
- `GET  /api/staff` — Staff directory
- `GET  /api/analytics` — OPD throughput & wait-time metrics

---

## ⚙️ Environment Variables

Create a `.env` file in the root of the backend folder:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/aarogyavaani
JWT_SECRET=your-secure-jwt-secret
```
