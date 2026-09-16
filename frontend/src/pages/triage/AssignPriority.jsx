import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import { api } from '../../data/api';
import { updateQueueToken } from '../../data/queueStore';

const OPTS = [
  { id: 'P1', t: 'P1 · Emergency', c: 'Chest pain / ACS signs · severe vitals breach · needs STAT MD' },
  { id: 'P2', t: 'P2 · Urgent', c: 'Acute but stable · RLQ pain / high fever · see within 30 min' },
  { id: 'P3', t: 'P3 · Routine', c: 'Stable vitals · follow-up / minor · FIFO queue' },
];

export default function AssignPriority() {
  const { id = 'A-142' } = useParams();
  const nav = useNavigate();
  const [p, setP] = useState('P1');
  const [why, setWhy] = useState('');
  const [err, setErr] = useState('');
  const lock = async () => {
    if (why.trim().length < 10) { setErr('Rationale required (min 10 chars) — NABH audit.'); return; }
    setErr('');

    // Update local queue store immediately (syncs to doctor/admin dashboards)
    updateQueueToken(id, { priority: p, rationale: why });

    // Also try to sync to backend
    try {
      await api.patch(`/tokens/${id}`, { priority: p, rationale: why });
      if (p === 'P1') await api.post('/alerts', { tokenNo: id, level: 'P1', msg: 'STAT escalation from triage' });
    } catch {}
    nav(`/triage/summary/${id}`);
  };
  return (
    <StaffShell role="nurse" title={`Assign Priority · ${id}`} subtitle="Locked priorities are audit-trailed">
      <div className="card">
        <div style={{ display: 'grid', gap: 8 }}>
          {OPTS.map(o => (
            <label key={o.id} className="queue-item" style={{ cursor: 'pointer', border: p === o.id ? '2px solid var(--blue)' : undefined }}>
              <span><input type="radio" name="pri" checked={p === o.id} onChange={() => setP(o.id)} /> <strong>{o.t}</strong><br /><span className="small muted">{o.c}</span></span>
              <span className={`tag ${o.id === 'P1' ? 'tag-p1' : o.id === 'P2' ? 'tag-p2' : 'tag-p3'}`}>{o.id}</span>
            </label>
          ))}
        </div>
        <div className="field" style={{ marginTop: 10 }}><label>Clinical rationale *</label>
          <textarea className="input staff" rows={3} placeholder="e.g. Exertional chest heaviness + HTN 150/94 → P1 per chest-pain protocol…" value={why} onChange={e => setWhy(e.target.value)} /></div>
        {err && <div className="alert-banner alert-p2 small">{err}</div>}
        <button className="btn btn-primary" onClick={lock}>🔒 Lock Priority →</button>
      </div>
    </StaffShell>
  );
}
