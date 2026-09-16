import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { getQueue, updateQueueToken } from '../../data/queueStore';

export default function PatientAssessment() {
  const { token = 'A-142' } = useParams();
  const nav = useNavigate();
  const queued = getQueue().find((t) => t.tokenNo === token);
  const patientName = queued?.name || queued?.patientName || 'Ramesh Kumar Sharma';
  const ageSex = queued ? `${queued.age || ''}${queued.sex || ''}`.trim() || '48M' : '48M';
  const complaint = queued?.complaint || queued?.chiefComplaint || 'Chest heaviness + exertional dyspnea ~24h';
  const [form, setForm] = useState({ consciousness: 'Alert', pain: '8', notes: '' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const saveAndContinue = () => {
    // Sync rapid assessment to queue store so doctor/admin see it immediately
    updateQueueToken(token, {
      assessment: {
        consciousness: form.consciousness,
        pain: form.pain,
        notes: form.notes,
      },
    });

    // Try to sync to backend
    try {
      fetch(`/api/tokens/${encodeURIComponent(token)}/assessment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessment: form }),
      });
    } catch {}

    nav(`/triage/vitals/${token}`);
  };
  return (
    <StaffShell role="nurse" title={`Assessment · ${token}`} subtitle={`${patientName}, ${ageSex} · kiosk intake summary`}>
      <div className="split split-2">
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Intake Summary</h3>
          <p className="small"><strong>{complaint}</strong>{queued?.age ? ` · ${queued.age}${queued.sex || ''}` : ' · HTN history. BP 150/94.'}</p>
          <h4>Symptoms</h4>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}><span className="tag tag-p1">Chest pain</span><span className="tag tag-p2">Breathlessness</span><span className="tag tag-neutral">Diaphoresis</span></div>
          <div className="alert-banner alert-p2" style={{ marginTop: 10 }}>⚠️ Allergy: <strong>Penicillin (rash)</strong> — flag on wristband + EMR.</div>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Rapid Assessment</h3>
          <div className="field"><label>Consciousness</label><select className="input staff" value={form.consciousness} onChange={e => set('consciousness', e.target.value)}><option>Alert</option><option>Voice-responsive</option><option>Pain-responsive</option><option>Unresponsive</option></select></div>
          <div className="field"><label>Pain VAS (0–10): {form.pain}</label><input type="range" min="0" max="10" value={form.pain} onChange={e => set('pain', e.target.value)} style={{ width: '100%' }} /></div>
          <div className="field"><label>Notes</label><textarea className="input staff" rows={3} placeholder="Breathing, skin, neuro…" value={form.notes} onChange={e => set('notes', e.target.value)} /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={saveAndContinue}>Save &amp; Vitals →</button>
            <Link className="btn btn-ghost btn-sm" to="/triage/dashboard">Cancel</Link>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
