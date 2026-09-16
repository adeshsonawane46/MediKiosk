import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import Icon from '../../components/Icon';
import { PriorityTag } from '../../components/ui';
import { MOCK_QUEUE } from '../../data/mock';
import { api } from '../../data/api';
import { getQueue, subscribeQueue } from '../../data/queueStore';

function VitalsCard({ k, v, s, warn }) {
  const isWarn = warn === 'warn';
  return (
    <div style={{
      borderRadius: '12px', padding: '14px 16px',
      background: isWarn ? 'var(--p1-bg)' : 'var(--card)',
      border: isWarn ? '1.5px solid var(--p1)' : '1px solid var(--line)',
      transition: 'all 0.15s ease',
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.06em', marginBottom: 4 }}>{k}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: isWarn ? 'var(--p1)' : 'var(--ink)' }}>{v}</div>
      <div style={{ fontSize: 12, color: isWarn ? 'var(--p1-ink)' : 'var(--muted)', marginTop: 2 }}>{s}</div>
    </div>
  );
}

export default function TriageDashboard() {
  const [queue, setQueue] = useState(() => getQueue());

  useEffect(() => {
    api.get('/tokens').then(d => {
      const list = Array.isArray(d) ? d : d.tokens || d.queue;
      if (list?.length) {
        setQueue(prev => {
          const localByToken = new Map(prev.map(t => [t.tokenNo, t]));
          const merged = list.map(t => ({ ...(localByToken.get(t.tokenNo) || {}), ...t, tokenNo: t.tokenNo || t.token, name: t.name || t.patientName || localByToken.get(t.tokenNo)?.name || 'Patient', complaint: t.complaint || t.chiefComplaint || localByToken.get(t.tokenNo)?.complaint || '' }));
          localByToken.forEach((v, k) => { if (!merged.find(m => m.tokenNo === k)) merged.push(v); });
          return merged;
        });
      }
    }).catch(() => {});
    const offQ = subscribeQueue((list) => { if (Array.isArray(list) && list.length) setQueue(list); });
    return () => offQ();
  }, []);

  return (
    <StaffShell role="nurse" title="Sr. Nurse Meena Kumari" subtitle="Triage Desk · OPD Central · Shift Live · NABH Protocol">
      {/* Session Banner */}
      <div style={{
        display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
        padding: '20px 24px', marginBottom: '24px',
        background: 'linear-gradient(135deg, var(--navy-deep), var(--navy))',
        borderRadius: '16px', color: '#fff', boxShadow: 'var(--shadow-2)',
      }}>
        <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="heartbeat" size={24} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-head)' }}>Triage Station · Live</div>
          <div style={{ fontSize: 13, marginTop: 2, opacity: 0.7 }}>Shift active · Vitals sync OK</div>
        </div>
        <Link className="btn btn-sm" style={{ background: '#fff', color: 'var(--navy)', borderRadius: '8px', fontWeight: 700 }} to="/triage/assessment/new">
          <Icon name="syringe" size={14} />Walk-in Vitals
        </Link>
      </div>

      {/* P1 Alert Banner */}
      <div style={{
        padding: '14px 18px', borderRadius: '12px', marginBottom: '24px',
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--p1-bg)', border: '1.5px solid var(--p1)',
      }}>
        <div style={{ width: 34, height: 34, borderRadius: '8px', background: 'var(--p1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="alert" size={16} color="#fff" />
        </div>
        <div style={{ flex: 1, fontSize: 14 }}>
          <strong>P1 STAT Active</strong> — A-142 Ramesh K. Sharma · chest pain + HTN · nurse escort to ECG NOW
        </div>
        <Link to="/triage/assessment/A-142" className="btn btn-sm btn-danger" style={{ borderRadius: '8px', fontSize: 13 }}>
          <Icon name="stethoscope" size={14} color="#fff" />Start Triage
        </Link>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {[
          { v: 8, l: 'Waiting', icon: 'queue', cls: 'blue', color: 'var(--blue-dark)' },
          { v: '4.2m', l: 'Avg Assess', icon: 'clock', cls: 'saffron', color: 'var(--saffron)' },
          { v: 3, l: 'Priority', icon: 'alert', cls: 'red', color: 'var(--p1)' },
          { v: 34, l: 'Done', icon: 'check', cls: 'green', color: 'var(--p3)' },
        ].map((s) => (
          <div className="kpi-card" key={s.l}>
            <div className={`kpi-icon ${s.cls}`}><Icon name={s.icon} size={20} /></div>
            <div>
              <div className="stat-value" style={{ fontSize: 26, color: s.color }}>{s.v}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginTop: 2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Vitals Summary */}
      <div style={{ padding: '22px', borderRadius: '14px', background: 'var(--card)', border: '1px solid var(--line)', marginBottom: '24px' }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'var(--p3-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="heartbeat" size={14} color="var(--p3)" /></div>
          Recent Vitals Summary
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px' }}>
          <VitalsCard k="Blood Pressure" v="150/94" s="Stage 2 HTN" warn="warn" />
          <VitalsCard k="Heart Rate" v="88 bpm" s="Regular" />
          <VitalsCard k="SpO2" v="98%" s="Normal" />
          <VitalsCard k="Temperature" v="98.4°F" s="Afebrile" />
          <VitalsCard k="Pain VAS" v="8/10" s="Severe" warn="warn" />
        </div>
      </div>

      {/* Queue Table */}
      <div style={{ padding: '22px', borderRadius: '14px', background: 'var(--card)', border: '1px solid var(--line)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(23, 37, 84, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="queue" size={14} color="var(--navy)" /></div>
            Waiting for Triage
          </h3>
          <span className="tag tag-neutral" style={{ fontSize: 11 }}>{queue.length} patients</span>
        </div>
        <div style={{ borderRadius: '12px', border: '1px solid var(--line)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--bg-rec)', textAlign: 'left' }}>
                {['Token', 'Patient', 'Complaint', 'Priority', 'Action'].map((th, i) => (
                  <th key={th} style={{ padding: '10px 14px', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', borderBottom: '1.5px solid var(--line)', fontWeight: 700, textAlign: i === 4 ? 'right' : 'left' }}>{th}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {queue.map(t => (
                <tr key={t.tokenNo} style={{ background: t.priority === 'P1' ? 'var(--p1-bg)' : 'transparent', transition: 'background 0.15s' }} onMouseEnter={(e) => { if (t.priority !== 'P1') e.currentTarget.style.background = 'var(--bg-rec)'; }} onMouseLeave={(e) => { if (t.priority !== 'P1') e.currentTarget.style.background = 'transparent'; }}>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)' }}>
                    <div style={{ background: 'var(--blue-soft)', color: 'var(--blue-dark)', padding: '4px 10px', borderRadius: '6px', display: 'inline-block', fontWeight: 800, fontSize: 13 }}>#{t.tokenNo}</div>
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)' }}>
                    <strong style={{ display: 'block', fontSize: 14 }}>{t.name}</strong>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{t.age} yrs {t.sex ? `· ${t.sex}` : ''}</span>
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)' }}>
                    <span style={{ fontWeight: 500, color: 'var(--ink-2)', fontSize: 13 }}>{t.complaint || 'Pending triage'}</span>
                  </td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)' }}><PriorityTag level={t.priority} /></td>
                  <td style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)', textAlign: 'right' }}>
                    <Link className={`btn btn-sm ${t.priority === 'P1' ? 'btn-danger' : 'btn-blue'} btn-animate`} style={{ borderRadius: '8px', fontSize: 12 }} to={`/triage/assessment/${t.tokenNo}`}>
                      <Icon name={t.priority === 'P1' ? 'stethoscope' : 'syringe'} size={13} color="#fff" />Triage
                    </Link>
                  </td>
                </tr>
              ))}
              {queue.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--muted)' }}>
                    <Icon name="check" size={28} color="var(--muted)" />
                    <div style={{ fontWeight: 600, color: 'var(--ink)', marginTop: 8 }}>Triage queue is clear</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </StaffShell>
  );
}
