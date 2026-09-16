# Data Flow Verification - MediKiosk

## ✅ Real-Time Data Synchronization Verified

All dashboards now receive **live updates** when patients or staff perform actions.

---

## 📊 Data Flow Architecture

### Central Queue Store (`queueStore.js`)
- **Single source of truth** for all patient queue data
- Persists to `localStorage` for cross-tab sync
- Emits `CustomEvent` for real-time updates within same browser
- Ready for Socket.IO integration (comments indicate where to add `socket.emit()`)

---

## 🔄 Patient Activity → Staff Dashboards

### 1️⃣ Patient Check-In (`InfoConfirmation.jsx`)
**When patient confirms registration and gets token:**

```javascript
upsertQueuePatient({
  tokenNo: 'A-142',
  name: 'Patient Name',
  age: 48,
  sex: 'M',
  complaint: 'Registration complete · awaiting clinical history',
  priority: 'P3',
  status: 'waiting',
  waitMin: 42,
  aiStatus: 'processing'
})
```

**Visible immediately on:**
- ✅ Doctor Dashboard (queue list)
- ✅ Nurse/Triage Dashboard (waiting list)
- ✅ Admin Dashboard (priority queue widget)

---

### 2️⃣ Patient Completes Clinical History (`ReviewComplete.jsx`)
**When patient finishes history intake:**

```javascript
updateQueueToken(tokenNo, {
  complaint: 'Chief complaint summary',
  chiefComplaint: 'Detailed complaint',
  aiStatus: 'ready',
  aiConfidence: 94
})
```

**Updates visible on:**
- ✅ Doctor Dashboard (complaint text, AI status badge)
- ✅ Nurse Dashboard (complaint column)
- ✅ Admin Dashboard (complaint in queue row)

---

## 👩‍⚕️ Nurse Activity → Doctor & Admin Dashboards

### 3️⃣ Nurse: Rapid Assessment (`PatientAssessment.jsx`)
**When nurse saves assessment:**

```javascript
updateQueueToken(token, {
  assessment: {
    consciousness: 'Alert',
    pain: '8',
    notes: 'Assessment notes...'
  }
})
```

**Syncs to:**
- ✅ Doctor Dashboard (available in patient case data)
- ✅ Admin Dashboard (assessment metadata)

---

### 4️⃣ Nurse: Records Vitals (`Vitals.jsx`)
**When nurse saves vital signs:**

```javascript
updateQueueToken(id, {
  vitals: {
    bp: '150/94',
    hr: 88,
    spo2: 98,
    temp: 98.4,
    rr: 18,
    pain: 8
  },
  vitalsBreach: true  // if any vitals out of range
})
```

**Updates visible on:**
- ✅ Doctor Dashboard (vitals data in patient case)
- ✅ Nurse Dashboard (vitals summary widget)
- ✅ Admin Dashboard (vitals breach alerts)

---

### 5️⃣ Nurse: Assigns Priority (`AssignPriority.jsx`)
**When nurse locks priority (P1/P2/P3):**

```javascript
updateQueueToken(id, {
  priority: 'P1',
  rationale: 'Clinical rationale...'
})
```

**Immediately reflected on:**
- ✅ Doctor Dashboard (priority tag, queue reordering)
- ✅ Nurse Dashboard (priority badge)
- ✅ Admin Dashboard (priority queue sorting, P1 alerts)

**Special behavior:**
- P1 patients move to top of queue
- Red flag alerts triggered
- Notifications appear in all staff dashboards

---

## 👨‍⚕️ Doctor Activity → All Dashboards

### 6️⃣ Doctor: Calls Next Patient (`DoctorDashboard.jsx`)
**When doctor clicks "Call Next":**

```javascript
callNextInStore('Room 104')
// Updates patient status to 'in-chamber'
// Broadcasts to patient waiting screens
```

**Updates visible on:**
- ✅ Doctor Dashboard (active call banner, queue updates)
- ✅ Nurse Dashboard (patient status changes to "In chamber")
- ✅ Admin Dashboard (current token, in-chamber count)
- ✅ Patient Queue Screens (displays called token #)

---

## 🔔 Real-Time Notifications

All staff portals subscribe to queue changes and show notifications for:
- 🚨 **P1 Emergency** patients (red flag alerts)
- ⚠️ **P2 Urgent** patients with abnormal vitals
- 📢 **Called tokens** (now calling announcements)
- 📄 **OCR documents** pending review
- 👥 **Queue pressure** (4+ patients waiting)

---

## 🎯 Cross-Tab Synchronization

Using `localStorage` events and `CustomEvent`:
- Multiple browser tabs/windows stay in sync
- Nurse updates → instantly visible in doctor's tab
- Doctor calls next → nurse sees status change
- Patient checks in → appears on all staff screens

---

## 🚀 Backend Integration Ready

All updates use **graceful degradation**:

```javascript
// Update local store immediately (offline-first)
updateQueueToken(id, data);

// Try to sync to backend (fails silently if offline)
try {
  await api.patch(`/tokens/${id}`, data);
} catch {}
```

**To add real-time backend sync:**
1. Replace `// TODO(realtime)` comments in `queueStore.js`
2. Add Socket.IO client connections
3. Emit events: `socket.emit('queue:update', data)`
4. Listen: `socket.on('queue:update', handleUpdate)`

---

## ✅ Verification Checklist

### Patient → Staff Flow
- [x] Patient check-in appears on all dashboards
- [x] History completion updates complaint text
- [x] AI status changes visible to doctor

### Nurse → Doctor/Admin Flow
- [x] Assessment notes sync to doctor dashboard
- [x] Vitals data visible to doctor
- [x] Priority changes reorder queue
- [x] P1 assignments trigger alerts

### Doctor → All Flow
- [x] Call next updates all dashboards
- [x] Patient status changes visible to nurse
- [x] Token calling broadcasts to screens

### Cross-Dashboard Sync
- [x] Admin dashboard subscribes to live queue
- [x] Doctor dashboard shows nurse updates
- [x] Nurse dashboard shows doctor actions

---

## 🎨 Modern UI Enhancements Applied

All three dashboards now feature:
- ✨ Modern, clean design with refined spacing
- 🎨 Consistent color palette and shadows
- 🔄 Smooth animations and transitions
- 📱 Responsive layouts
- 🎯 Better visual hierarchy
- 💫 Glass-morphism effects on topbar
- 🎪 Polished hover states

---

**Last Updated:** 2026-09-16  
**Status:** ✅ All data flows verified and working
