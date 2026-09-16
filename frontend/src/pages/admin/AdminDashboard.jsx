import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import Icon from '../../components/Icon';
import { StatusTag } from '../../components/ui';
import { api } from '../../data/api';
import { getQueue, subscribeQueue } from '../../data/queueStore';

const FALLBACK_KIOSKS = [
  { id: 'KSK-01', loc: 'OPD Main Gate', status: 'Online', battery: 92, latency: '180ms', paper: 78, step: 'Token' },
  { id: 'KSK-02', loc: 'Casualty Entry', status: 'Online', battery: 64, latency: '240ms', paper: 41, step: 'Vitals' },
  { id: 'KSK-03', loc: 'Pharmacy Wing', status: 'Degraded', battery: 38, latency: '610ms', paper: 18, step: 'History' },
];

function KioskCard({ k }) {
  const isOnline = k.status === 'Online';
  return (
    <div style={{
      display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px',
      marginBottom: '8px', borderRadius: '12px',
      background: 'var(--bg-rec)', border: '1px solid transparent',
      transition: 'all 0.15s ease',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--blue-soft)'; e.currentTarget.style.borderColor = 'var(--line)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-rec)'; e.currentTarget.style.borderColor = 'transparent'; }}
    >
      <div style={{ width: 38, height: 38, borderRadius: '10px', background: isOnline ? 'var(--p3-bg)' : 'var(--p2-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className={`status-dot ${isOnline ? 'online' : 'warning'}`} style={{ width: 10, height: 10 }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <strong style={{ fontSize: 14 }}>{k.id}</strong>
          <StatusTag kind={isOnline ? 'info' : 'warn'} style={{ fontSize: 10 }}>{k.status}</StatusTag>
        </div>
        <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{k.loc || k.step}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 12, fontWeight: 600 }}>🔋 {k.battery}%</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{k.latency}</div>
      </div>
    </div>
  );
}

function QueueRow({ t }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '10px 14px', background: 'var(--bg-rec)', borderRadius: '10px',
      border: '1px solid transparent', marginBottom: '6px',
      transition: 'all 0.15s ease',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--blue-soft)'; e.currentTarget.style.borderColor = 'var(--line)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg-rec)'; e.currentTarget.style.borderColor = 'transparent'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ background: 'var(--navy)', color: '#fff', fontWeight: 800, padding: '3px 8px', borderRadius: '5px', fontSize: 12 }}>#{t.tokenNo}</div>
        <div>
          <strong style={{ fontSize: 13 }}>{t.name}</strong>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{t.complaint}</div>
        </div>
      </div>
      <span className={`tag ${t.priority === 'P1' ? 'tag-p1' : t.priority === 'P2' ? 'tag-p2' : 'tag-neutral'}`} style={{ fontSize: 11 }}>{t.priority}</span>
    </div>
  );
}

function QuickAction({ to, label, icon, color = 'var(--navy)' }) {
  return (
    <Link to={to} className="btn btn-ghost btn-sm" style={{
      borderRadius: '10px', display: 'flex', alignItems: 'center', gap: 6,
      padding: '8px 14px', fontSize: 13,
    }}>
      <div style={{ width: 28, height: 28, borderRadius: '7px', background: 'var(--bg-rec)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={icon} size={14} color={color} />
      </div>
      {label}
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [kiosks, setKiosks] = useState(FALLBACK_KIOSKS);
  const [queue, setQueue] = useState(() => getQueue());

  useEffect(() => {
    api.get('/analytics').then(d => setStats(d)).catch(() => {});
    api.get('/kiosks').then(d => {
      const list = Array.isArray(d) ? d : d.kiosks;
      if (list?.length) setKiosks(list);
    }).catch(() => {});

    // Subscribe to live queue updates from patient check-in, nurse triage, doctor actions
    const offQ = subscribeQueue((list) => setQueue(list || []));
    return () => offQ();
  }, []);

  return (
    <StaffShell role="admin" title="Facility Command Center" subtitle="AIIMS New Delhi · Hospital operations · ABDM Synced · NABH Audited">
      {/* Session Banner */}
      <div style={{
        display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
        padding: '20px 24px', marginBottom: '24px',
        background: 'linear-gradient(135deg, var(--navy-deep), var(--navy))',
        borderRadius: '16px', color: '#fff', boxShadow: 'var(--shadow-2)',
      }}>
        <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="shield" size={24} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 17, fontWeight: 800, fontFamily: 'var(--font-head)' }}>Admin Command Center</div>
          <div style={{ fontSize: 13, marginTop: 2, opacity: 0.7 }}>System operations normal · Sync active · NABH Protocol</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' }} to="/admin/analytics">
            <Icon name="analytics" size={14} color="#fff" />Analytics
          </Link>
          <Link className="btn btn-sm" style={{ background: '#fff', color: 'var(--navy)', borderRadius: '8px', fontWeight: 700 }} to="/admin/settings">
            <Icon name="settings" size={14} />Settings
          </Link>
        </div>
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
          <strong>P1 STAT Active</strong> — A-142 Ramesh K. Sharma · chest pain + HTN 150/94 · Room 104 · SLA 04:12
        </div>
        <Link to="/admin/alerts" className="btn btn-sm btn-danger" style={{ borderRadius: '8px', fontSize: 13 }}>
          <Icon name="alert" size={14} color="#fff" />Alert Center
        </Link>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        {[
          { v: stats?.kiosks || '8/8', l: 'Kiosks Live', icon: 'kiosk', cls: 'navy', color: 'var(--ink)' },
          { v: stats?.checkedIn || '642', l: 'Checked-in', icon: 'patients', cls: 'blue', color: 'var(--blue-dark)' },
          { v: '32/36', l: 'Physicians', icon: 'stethoscope', cls: 'saffron', color: 'var(--saffron)' },
          { v: '99.98%', l: 'ABDM Sync', icon: 'heart', cls: 'green', color: 'var(--p3)' },
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

      <div className="split-2" style={{ gap: '24px' }}>
        {/* Left — Kiosk Fleet */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '22px', borderRadius: '14px', background: 'var(--card)', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(23, 37, 84, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="kiosk" size={14} color="var(--navy)" /></div>
                Kiosk Fleet
              </h3>
              <StatusTag kind="info">{kiosks.length} units</StatusTag>
            </div>
            <div>
              {kiosks.slice(0, 4).map(k => <KioskCard key={k.id} k={k} />)}
            </div>
            <Link className="btn btn-ghost btn-block btn-sm" style={{ marginTop: 12, borderRadius: '8px' }} to="/admin/kiosks"><Icon name="kiosk" size={14} />Manage Fleet</Link>
          </div>
        </div>

        {/* Right — Queue & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ padding: '22px', borderRadius: '14px', background: 'var(--card)', border: '1px solid var(--line)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(23, 37, 84, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="queue" size={14} color="var(--navy)" /></div>
                Priority Queue
              </h3>
              <span className="tag tag-neutral" style={{ fontSize: 11 }}>{queue.length} live</span>
            </div>
            <div>
              {queue.slice(0, 4).map(t => <QueueRow key={t.tokenNo} t={t} />)}
            </div>
            <Link className="btn btn-blue btn-block btn-sm" style={{ marginTop: 12, borderRadius: '8px' }} to="/doctor/queue"><Icon name="queue" size={14} color="#fff" />Open Live OPD</Link>
          </div>

          <div style={{ padding: '22px', borderRadius: '14px', background: 'var(--card)', border: '1px solid var(--line)' }}>
            <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'rgba(23, 37, 84, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="activity" size={14} color="var(--navy)" /></div>
              Quick Actions
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <QuickAction to="/admin/opd" label="OPD Ops" icon="kiosk" />
              <QuickAction to="/admin/staff" label="Staff" icon="staff" />
              <QuickAction to="/admin/audit" label="Audit" icon="audit" />
              <QuickAction to="/admin/alerts" label="Alerts" icon="alert" color="var(--p1)" />
              <QuickAction to="/admin/settings" label="Settings" icon="settings" />
            </div>
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
