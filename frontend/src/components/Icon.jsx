const icons = {
  search: <><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2"/><line x1="16.5" y1="16.5" x2="21" y2="21" stroke="currentColor" strokeWidth="2"/></>,
  dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="3" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8"/><rect x="3" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8"/><rect x="14" y="14" width="7" height="7" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  queue: <><circle cx="8" cy="6" r="3" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M2 12c0-2 2-4 6-4s6 2 6 4v3H2z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M14 12c0-2-2-4-6-4s-6 2-6 4v3h12z" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  patients: <><circle cx="12" cy="7" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M3 21v-1.5a4.5 4.5 0 014.5-4.5h3A4.5 4.5 0 0121 19.5V21" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  alert: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" fill="none" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="16.5" r="0.5" fill="currentColor"/></>,
  document: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="none" stroke="currentColor" strokeWidth="1.8"/><polyline points="14,2 14,8 20,8" fill="none" stroke="currentColor" strokeWidth="1.8"/><line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="1.5"/><line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="1.5"/></>,
  timeline: <><line x1="12" y1="2" x2="12" y2="22" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="6" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="18" r="2" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  workspace: <><path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  analytics: <><line x1="18" y1="20" x2="18" y2="10" stroke="currentColor" strokeWidth="1.8"/><line x1="12" y1="20" x2="12" y2="4" stroke="currentColor" strokeWidth="1.8"/><line x1="6" y1="20" x2="6" y2="14" stroke="currentColor" strokeWidth="1.8"/></>,
  kiosk: <><rect x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><rect x="7" y="7" width="10" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.8"/><line x1="9" y1="15" x2="12" y2="15" stroke="currentColor" strokeWidth="1.8"/><line x1="15" y1="15" x2="15" y2="16" stroke="currentColor" strokeWidth="1.8"/></>,
  staff: <><circle cx="8" cy="6" r="3" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M1 22v-2a5 5 0 0110 0v2" fill="none" stroke="currentColor" strokeWidth="1.8"/><circle cx="18" cy="8" r="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M22 18h-3a3 3 0 00-3 3v1" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  settings: <><circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 008.5 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 8.5a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 008.5 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 8.5a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  audit: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="1.8"/><polyline points="9,12 11,14 15,10" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  phone: <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="none" stroke="currentColor" strokeWidth="1.8"/><polyline points="22,6 12,13 2,6" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  pause: <><polygon points="6,4 20,4 20,20 6,20" fill="currentColor"/><polygon points="12,4 12,20" fill="currentColor"/></>,
  activity: <><polyline points="22,12 18,12 15,21 9,3 6,12 2,12" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  heart: <><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  stethoscope: <><path d="M7 17h2M15 17h2M5 15h4M11 15h4M7 13h2M15 13h2M12 3v4M12 7v4" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M9 21V8a3 3 0 016 0v13" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  flask: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M9 2v6h6V2" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M9 18v2M15 18v2" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  pill: <><path d="M10.5 5.5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M10.5 12.5l7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></>,
  heartbeat: <><polyline points="1,16 5,12 9,14 13,8 17,12 21,8" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  drop: <><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  syringe: <><path d="M12 22v-8M8 14h8M12 22c-4 0-6-2-6-5s2-3 6-3 6 2 6 3-2 3-6 3" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M10 7h4" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M11 4h2M12 2v2" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  clipboard: <><rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M9 1h6M9 5h6M9 9h2M9 13h2M9 17h2" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  chart: <><path d="M18 20V10M12 20V4M6 20v-6" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  clock: <><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.8"/><polyline points="12,6 12,12 16,14" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  check: <><polyline points="20,6 9,17 4,12" fill="none" stroke="currentColor" strokeWidth="2"/></>,
  x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
  chevronDown: <><polyline points="6,9 12,15 18,9" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
  menu: <><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></>,
  logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" fill="none" stroke="currentColor" strokeWidth="1.8"/><polyline points="16,17 21,12 16,7" fill="none" stroke="currentColor" strokeWidth="1.8"/><line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8"/></>,
  home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" fill="none" stroke="currentColor" strokeWidth="1.8"/><polyline points="9,22 9,12 15,12 15,22" fill="none" stroke="currentColor" strokeWidth="1.8"/></>,
};

export default function Icon({ name, size = 18, color = 'currentColor', style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color, display: 'inline-flex', verticalAlign: 'middle', ...style }}>
      {icons[name] || icons.search}
    </svg>
  );
}

export function IconButton({ name, size, color, onClick, style, title }) {
  return (
    <button type="button" onClick={onClick} title={title} style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size + 16, height: size + 16, borderRadius: 8, border: 'none',
      background: 'transparent', color, cursor: 'pointer', ...style
    }}>
      <Icon name={name} size={size} color={color} />
    </button>
  );
}
