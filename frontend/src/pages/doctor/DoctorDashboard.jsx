import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import StaffShell from '../../components/StaffShell';
import Icon from '../../components/Icon';
import { PriorityTag } from '../../components/ui';
import { MOCK_RED_FLAGS, MOCK_OCR_STACK, AVG_CONSULT_MIN, ROOM_LABEL, priorityLabel, aiStatusLabel } from '../../data/doctorMock';
import { doctorApi } from '../../data/doctorApi';
import { subscribeQueue, subscribeCalled, dashboardCounters, waitingInfo } from '../../data/queueStore';

/* ---- Small sub-components ---- */

function AiStatusBadge({ status, confidence }) {
  if (status === 'ready') return <span className="tag tag-info">{aiStatusLabel(status, confidence)}</span>;
  if (status === 'processing') return <span className="tag tag-neutral">{aiStatusLabel(status)}</span>;
  return <span className="tag tag-neutral" style={{ opacity: 0.6 }}>{aiStatusLabel(status)}</span>;
}

function QueueItem({ t }) {
  const ageSex = `${t.age}${t.sex || ''}`;
  const isP1 = t.priority === 'P1';
  return (
    <div
      className="queue-item-modern"
      style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 16, flexWrap: 'wrap', padding: '16px 20px',
        background: isP1 ? 'var(--p1-bg)' : 'var(--card)',
        border: isP1 ? '1.5px solid var(--p1)' : '1px solid var(--line)',
        borderRadius: '14px', marginBottom: '10px',
      }}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <div style={{ background: 'var(--navy)', color: '#fff', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <Icon name="clock" size={12} color="#fff" />#{t.tokenNo}
          </div>
          <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>{t.name}</strong>
          <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{ageSex}</span>
        </div>
        <div style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: 4, display: 'flex', gap: 6, alignItems: 'center' }}>
          <span>{t.status === 'in-chamber' ? 'In chamber' : t.waitMin === 0 ? 'Now' : `${t.waitMin ?? t.wait} min`}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span>{priorityLabel(t.priority)}</span>
        </div>
        <div style={{ color: 'var(--ink-2)', fontWeight: 500, fontSize: '14px', marginBottom: 10 }}>{t.complaint || t.chiefComplaint}</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <PriorityTag level={t.priority} />
          <AiStatusBadge status={t.aiStatus} confidence={t.aiConfidence} />
          {t.status === 'in-chamber' && <span className="tag" style={{ background: 'var(--saffron)', color: '#fff', borderColor: 'var(--saffron)' }}>In Chamber</span>}
        </div>
      </div>
      <Link className="btn btn-blue btn-animate btn-sm" style={{ borderRadius: '8px', padding: '0 18px' }} to={`/doctor/case/${t.tokenNo}`}>
        <Icon name="stethoscope" size={14} color="#fff" />Review
      </Link>
    </div>
  );
}

function RedFlagCard({ flags }) {
  if (!flags.length) {
    return (
      <div style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 14, background: 'var(--p3-bg)', borderRadius: '14px', border: '1px solid var(--p3)' }}>
        <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'var(--p3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="check" size={20} color="#fff" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--p3-ink)' }}>All Clear</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>All OPD queue patients are triaged stable.</div>
        </div>
        <Link className="btn btn-ghost btn-sm" style={{ borderRadius: '8px', fontSize: 12 }} to="/doctor/alerts"><Icon name="alert" size={14} />View Log</Link>
      </div>
    );
  }
  const top = flags[0];
  const isStat = top.severity === 'STAT' || top.priority === 'P1';
  return (
    <div style={{
      padding: '20px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
      background: isStat ? 'var(--p1-bg)' : 'var(--p2-bg)',
      borderRadius: '14px', border: `1.5px solid ${isStat ? 'var(--p1)' : 'var(--p2)'}`,
    }}>
      <div style={{ width: 40, height: 40, borderRadius: '10px', background: isStat ? 'var(--p1)' : 'var(--p2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="alert" size={18} color="#fff" /></div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: isStat ? 'var(--p1-ink)' : 'var(--p2-ink)', marginBottom: 4 }}>
          Red Flag {flags.length > 1 ? `(${flags.length} Active)` : ''}
        </div>
        <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--ink)' }}>{top.tokenNo} · {top.patientName || top.name}</div>
        <div style={{ marginTop: 4, fontSize: 13, color: 'var(--ink-2)' }}>{top.reason || top.message || top.complaint}</div>
        <div style={{ marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
          <span className="tag" style={{ fontSize: 11, background: isStat ? 'var(--p1)' : 'var(--p2)', borderColor: isStat ? 'var(--p1)' : 'var(--p2)', color: '#fff' }}>{top.severity || (isStat ? 'STAT' : 'Urgent')}</span>
          {flags.length > 1 && <span className="muted" style={{ fontSize: 12 }}>+{flags.length - 1} more</span>}
        </div>
      </div>
      <Link className="btn btn-danger btn-animate btn-sm" style={{ borderRadius: '8px', padding: '0 18px' }} to={`/doctor/case/${top.tokenNo}`}><Icon name="stethoscope" size={14} color="#fff" />Review</Link>
    </div>
  );
}

function OcrStackCard({ docs }) {
  const pendingCount = docs.filter((d) => d.status !== 'complete').length;
  return (
    <div style={{ padding: '20px', borderRadius: '14px', background: 'var(--card)', border: '1px solid var(--line)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700 }}>
          <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'var(--blue-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="document" size={14} color="var(--blue-dark)" /></div>
          Document OCR
        </h4>
        {pendingCount > 0 && <span className="tag tag-info" style={{ borderRadius: '20px', fontSize: 11 }}>{pendingCount} pending</span>}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {docs.map((d) => (
          <Link key={d.id} to="/doctor/documents" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ background: 'var(--bg-rec)', padding: '12px 14px', borderRadius: '10px', transition: 'background 0.15s' }} onMouseEnter={(e) => e.currentTarget.style.background = 'var(--blue-soft)'} onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-rec)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--ink)' }}><Icon name="flask" size={12} color="var(--muted)" style={{ marginRight: 4 }} />{d.fileName}</span>
                <span style={{ flexShrink: 0, fontSize: 12, color: d.status === 'complete' ? 'var(--p3)' : d.status === 'processing' ? 'var(--blue)' : 'var(--muted)' }}>{d.label}</span>
              </div>
              <div className="progress-modern"><div className="fill blue" style={{ width: `${d.progress}%` }} /></div>
              {d.confidence != null && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>Confidence: {d.confidence}%</div>}
            </div>
          </Link>
        ))}
      </div>
      <Link className="btn btn-ghost btn-block btn-sm" style={{ marginTop: '12px', borderRadius: '8px' }} to="/doctor/documents"><Icon name="document" size={14} />All Documents</Link>
    </div>
  );
}

function StatCard({ v, l, sub, icon, bg = '#fff', iconBg = 'var(--bg-rec)', iconColor = 'var(--navy)' }) {
  return (
    <div className="kpi-card" style={{ background: bg }}>
      <div className="kpi-icon" style={{ background: iconBg, color: iconColor }}><Icon name={icon} size={20} color={iconColor} /></div>
      <div>
        <div className="stat-value" style={{ fontSize: '26px', color: 'var(--ink)' }}>{v}</div>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--muted)', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div>
        {sub && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 1 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ---- Main Dashboard ---- */

export default function DoctorDashboard() {
  const [queue, setQueue] = useState([]);
  const [called, setCalled] = useState(null);
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');
  const [paused, setPaused] = useState(false);
  const [calling, setCalling] = useState(false);

  useEffect(() => {
    let live = true;
    doctorApi.getDashboard().then((d) => { if (!live) return; if (d?.queue?.length) setQueue(d.queue); if (d?.called) setCalled(d.called); }).catch(() => {});
    const offQ = subscribeQueue((list) => setQueue(list || []));
    const offC = subscribeCalled((c) => setCalled(c));
    return () => { live = false; offQ(); offC(); };
  }, []);

  const filtered = useMemo(() => queue.filter((t) => {
    if (filter === 'Priority' && t.priority === 'P3') return false;
    if (filter === 'Routine' && t.priority !== 'P3') return false;
    if (q) { const hay = `${t.name || ''} ${t.tokenNo || ''} ${t.complaint || t.chiefComplaint || ''}`.toLowerCase(); if (!hay.includes(q.toLowerCase())) return false; }
    return true;
  }), [queue, filter, q]);

  const counters = useMemo(() => dashboardCounters(queue), [queue]);
  const wait = useMemo(() => waitingInfo(queue, AVG_CONSULT_MIN), [queue]);
  const redFlags = useMemo(() => {
    const fromQueue = queue.filter((t) => t.priority === 'P1').map((t) => ({ id: t.tokenNo, tokenNo: t.tokenNo, patientName: t.name, reason: t.complaint || 'Emergency symptoms detected', severity: 'STAT', priority: 'P1', kind: 'Emergency' }));
    const base = MOCK_RED_FLAGS.length ? MOCK_RED_FLAGS : fromQueue;
    if (fromQueue.length) return fromQueue.map((f) => { const m = MOCK_RED_FLAGS.find((x) => x.tokenNo === f.tokenNo); return m ? { ...f, reason: m.reason } : f; });
    return base;
  }, [queue]);

  const ocrDocs = MOCK_OCR_STACK;
  const readyCount = queue.filter((t) => t.aiStatus === 'ready').length;

  const callNext = async () => {
    if (paused || calling) return;
    setCalling(true);
    try { const res = await doctorApi.callNext(ROOM_LABEL); if (res?.queue) setQueue(res.queue); if (res?.called) setCalled(res.called); } finally { setCalling(false); }
  };

  return (
    <StaffShell role="doctor" title="Dr. Rajesh Sharma" subtitle="General Medicine · Tuesday OPD · ABDM Linked">
      {/* Session Banner */}
      <div style={{
        display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
        padding: '20px 24px', marginBottom: '24px',
        background: 'linear-gradient(135deg, var(--navy-deep), var(--navy))',
        borderRadius: '16px', color: '#fff', boxShadow: 'var(--shadow-2)',
      }}>
        <div style={{ width: 48, height: 48, borderRadius: '14px', background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="stethoscope" size={24} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: '17px', fontWeight: 800, fontFamily: 'var(--font-head)' }}>{ROOM_LABEL} · Live</div>
          <div style={{ fontSize: 13, marginTop: 2, opacity: 0.7 }}>{paused ? 'Session Paused — Queue on hold' : `Avg ${AVG_CONSULT_MIN} min/patient · ${readyCount} AI summaries ready`}</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)', borderRadius: '8px' }} onClick={() => setPaused((p) => !p)}>
            <Icon name={paused ? 'activity' : 'pause'} size={14} color="#fff" />{paused ? 'Resume' : 'Pause'}
          </button>
          <button className="btn btn-sm btn-animate" style={{ background: '#fff', color: 'var(--navy)', borderRadius: '8px', fontWeight: 700 }} onClick={callNext} disabled={paused || calling}>
            <Icon name="flask" size={14} />{calling ? 'Calling…' : 'Call Next'}
          </button>
        </div>
      </div>

      {/* Active Call Alert */}
      {called && (
        <div style={{
          marginBottom: '24px', padding: '20px 24px',
          background: 'linear-gradient(135deg, var(--saffron), #f59e0b)', color: '#fff',
          borderRadius: '14px', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap',
          boxShadow: '0 6px 20px rgba(249, 115, 22, 0.2)',
        }}>
          <div style={{ width: 42, height: 42, borderRadius: '12px', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="flask" size={22} color="#fff" /></div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, opacity: 0.85 }}>Now Calling</div>
            <div style={{ fontSize: '20px', fontWeight: 900, marginTop: 2 }}>Token #{called.tokenNo} — {called.name}</div>
            <div style={{ fontSize: 14, opacity: 0.9, marginTop: 2 }}>Please proceed to {called.room || ROOM_LABEL}.</div>
          </div>
          <Link className="btn btn-sm" style={{ background: '#fff', color: 'var(--saffron)', borderRadius: '10px', fontWeight: 700 }} to={`/doctor/case/${called.tokenNo}`}><Icon name="stethoscope" size={14} />Open Case</Link>
        </div>
      )}

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
        <StatCard v={counters.scheduled} l="Scheduled" sub="Today's OPD" icon="clipboard" bg="#fff" iconBg="rgba(23, 37, 84, 0.06)" iconColor="var(--navy)" />
        <StatCard v={counters.inQueue} l="In Queue" sub="Waiting now" icon="queue" bg="var(--blue-soft)" iconBg="rgba(19,136,8,0.08)" iconColor="var(--blue-dark)" />
        <StatCard v={counters.inChamber} l="In Chamber" sub={counters.inChamberToken || 'None'} icon="flask" bg="var(--saffron-soft)" iconBg="rgba(255,153,51,0.08)" iconColor="var(--saffron)" />
        <StatCard v={counters.done} l="Completed" sub="Consulted today" icon="check" bg="#fff" iconBg="var(--p3-bg)" iconColor="var(--p3)" />
      </div>

      <div className="split-2" style={{ gap: '24px' }}>
        {/* Left — OPD Queue */}
        <div style={{ padding: '24px', borderRadius: '16px', background: 'var(--card)', border: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="queue" size={18} color="var(--navy)" />OPD Queue
            </h3>
            <div className="tabs">
              {['All', 'Priority', 'Routine'].map((f) => (
                <button key={f} className={`tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
              ))}
            </div>
          </div>
          <input className="input staff" placeholder="Search token / name…" value={q} onChange={(e) => setQ(e.target.value)} style={{ maxWidth: '100%', fontSize: '13px', minHeight: '38px', borderRadius: '8px', marginBottom: '14px', background: 'var(--bg-rec)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((t) => <QueueItem key={t.tokenNo} t={t} />)}
          </div>
          {filtered.length === 0 && (
            <div style={{ padding: '36px 20px', textAlign: 'center', background: 'var(--bg-rec)', borderRadius: '12px', border: '1.5px dashed var(--line)' }}>
              <Icon name="check" size={28} color="var(--muted)" />
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginTop: 8 }}>Queue is clear</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>No patients match the current filter.</div>
            </div>
          )}
          <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--bg-rec)', borderRadius: '10px', fontSize: 12, color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5 }}>
            <Icon name="alert" size={12} color="var(--blue)" style={{ marginRight: 4 }} />AI-generated insights — verify before clinical decisions.
          </div>
        </div>

        {/* Right — Alerts & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <RedFlagCard flags={redFlags} />

          {/* Wait Status */}
          <div style={{ padding: '20px', borderRadius: '14px', background: 'var(--card)', border: '1px solid var(--line)' }}>
            <h4 style={{ marginTop: 0, marginBottom: 14, fontSize: 15, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '8px', background: 'var(--bg-rec)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="clock" size={14} color="var(--navy)" /></div>
              Live Wait Status
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[
                { label: 'Current Token', value: wait.currentToken, icon: 'flask' },
                { label: 'Patients Waiting', value: String(wait.patientsWaiting), icon: 'queue' },
                { label: 'Avg Time/Patient', value: `${wait.avgMin} min`, icon: 'clock' },
              ].map((item, i) => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--line)' : 'none', fontSize: 14 }}>
                  <span style={{ color: 'var(--muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><Icon name={item.icon} size={14} color="var(--muted)" />{item.label}</span>
                  <strong style={{ fontSize: 14 }}>{item.value}</strong>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', background: 'var(--blue-soft)', padding: '10px 14px', borderRadius: '8px', marginTop: 6 }}>
                <span style={{ color: 'var(--blue-dark)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}><Icon name="chart" size={14} color="var(--blue-dark)" />Est. Wait</span>
                <strong style={{ fontSize: 14, color: 'var(--blue-dark)' }}>~{wait.estimatedWaitMin} min</strong>
              </div>
            </div>
          </div>

          <OcrStackCard docs={ocrDocs} />

          <div style={{ padding: '12px', background: 'var(--bg-rec)', borderRadius: '10px', fontSize: 12, lineHeight: 1.5, textAlign: 'center', color: 'var(--muted)' }}>
            <Icon name="alert" size={12} style={{ marginRight: 4 }} />AI-generated insights and OCR data for clinical assistance only.
          </div>
        </div>
      </div>
    </StaffShell>
  );
}
