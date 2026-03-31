import React, { useState, useEffect } from "react";
import { LogOut, ExternalLink, PlayCircle, AlertCircle, ChevronDown, ChevronUp, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const API_URL = config.apiUrl;

/* ── Custom outline SVG icons — #E8001C on #fff0f0 ── */
const IconTotalClasses = ({ size = 44 }) => (
  <div style={{ width:size, height:size, background:'#fff0f0', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.3s' }} className="stat-icon">
    <svg width={size*0.52} height={size*0.52} viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <polygon points="10 8 16 11 10 14 10 8" stroke="#E8001C" strokeWidth="1.8" fill="none"/>
      <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  </div>
);
const IconUpcoming = ({ size = 44 }) => (
  <div style={{ width:size, height:size, background:'#fff0f0', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.3s' }} className="stat-icon">
    <svg width={size*0.52} height={size*0.52} viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      <line x1="8" y1="14" x2="8" y2="18" strokeWidth="1.5"/><line x1="12" y1="14" x2="12" y2="16" strokeWidth="1.5"/>
    </svg>
  </div>
);
const IconCompleted = ({ size = 44 }) => (
  <div style={{ width:size, height:size, background:'#fff0f0', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.3s' }} className="stat-icon">
    <svg width={size*0.52} height={size*0.52} viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><polyline points="9 12 11 14 15 10"/>
    </svg>
  </div>
);
const IconOngoing = ({ size = 44 }) => (
  <div style={{ width:size, height:size, background:'#fff0f0', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.3s' }} className="stat-icon">
    <svg width={size*0.52} height={size*0.52} viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 15.5"/>
    </svg>
  </div>
);

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');

  .td-tab {
    position: relative; overflow: hidden;
    padding: 1rem 0.5rem;
    font-family: 'Poppins', sans-serif; font-size: 0.875rem; font-weight: 500;
    color: #555555; background: none; border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer; white-space: nowrap; flex-shrink: 0;
    transition: color 0.2s;
  }
  .td-tab::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 2px; background: #E8001C;
    transform: scaleX(0); transform-origin: left;
    transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
    border-radius: 2px;
  }
  .td-tab:hover::after, .td-tab.active::after { transform: scaleX(1); }
  .td-tab:hover, .td-tab.active { color: #E8001C; }

  .td-watch-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; gap: 0.35rem;
    padding: 0.42rem 0.9rem;
    font-family: 'Poppins', sans-serif; font-size: 0.78rem; font-weight: 600;
    color: #ffffff; background: #E8001C;
    border: 2px solid #E8001C; border-radius: 7px;
    cursor: pointer; text-decoration: none;
    transition: color 0.4s ease, border-color 0.4s ease;
    white-space: nowrap;
  }
  .td-watch-btn::after {
    content: ''; position: absolute; top: 50%; left: 50%;
    width: 0; height: 0; background: #0a0a0a; border-radius: 50%;
    transform: translate(-50%,-50%);
    transition: width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }
  .td-watch-btn:hover::after { width: 300px; height: 300px; }
  .td-watch-btn:hover { border-color: #0a0a0a; }
  .td-watch-btn > * { position: relative; z-index: 1; }

  .td-join-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; gap: 0.3rem;
    padding: 0.35rem 0.85rem;
    font-family: 'Poppins', sans-serif; font-size: 0.75rem; font-weight: 500;
    color: #0a0a0a; background: #ffffff;
    border: 1.5px solid #e5e7eb; border-radius: 7px;
    cursor: pointer; text-decoration: none;
    transition: color 0.4s ease, border-color 0.4s ease;
    white-space: nowrap;
  }
  .td-join-btn::after {
    content: ''; position: absolute; top: 50%; left: 50%;
    width: 0; height: 0; background: #E8001C; border-radius: 50%;
    transform: translate(-50%,-50%);
    transition: width 0.5s cubic-bezier(0.4,0,0.2,1), height 0.5s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }
  .td-join-btn:hover::after { width: 240px; height: 240px; }
  .td-join-btn:hover { color: #ffffff; border-color: #E8001C; }
  .td-join-btn > * { position: relative; z-index: 1; }

  .stat-card:hover .stat-icon { background: #E8001C !important; }
  .stat-card:hover .stat-icon svg { stroke: #ffffff !important; }
  .stat-card:hover .stat-icon svg circle,
  .stat-card:hover .stat-icon svg polyline,
  .stat-card:hover .stat-icon svg polygon { stroke: #ffffff !important; }
  .stat-card:hover .stat-num { color: #E8001C; }

  .rec-day-header {
    transition: background 0.3s ease, border-color 0.3s ease;
    background: #ffffff !important;
    border-left: 4px solid #E8001C;
  }
  .rec-day-header:hover { background: #fff0f0 !important; }

  .ld-settings-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center;
    width: 38px; height: 38px;
    color: #555555; background: #ffffff;
    border: 1.5px solid #e5e7eb; border-radius: 8px;
    cursor: pointer;
    transition: color 0.4s ease, border-color 0.4s ease;
  }
  .ld-settings-btn::after {
    content: ''; position: absolute; top: 50%; left: 50%;
    width: 0; height: 0; background: #E8001C; border-radius: 50%;
    transform: translate(-50%,-50%);
    transition: width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }
  .ld-settings-btn:hover::after { width: 80px; height: 80px; }
  .ld-settings-btn > svg { position: relative; z-index: 1; }
  .ld-settings-btn:hover { color: #ffffff; border-color: #E8001C; }

  /* Date accordion for longterm recordings in schedule */
  .lt-date-block {
    border: 1.5px solid #e8e8e8;
    border-radius: 8px;
    overflow: hidden;
    margin-top: 6px;
  }
  .lt-date-block-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.4rem 0.65rem;
    background: #f9f9f9;
    cursor: pointer;
    user-select: none;
    transition: background 0.15s;
  }
  .lt-date-block-header:hover { background: #fff0f0; }
  .lt-date-block-body {
    padding: 0.5rem 0.65rem 0.6rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    background: #ffffff;
  }
`;

/* ── helpers ── */
const getAutoStatus = (cls) => {
  if (!cls.date || !cls.startTime || !cls.endTime) return cls.status || 'scheduled';
  const now = new Date(), cd = new Date(cls.date);
  const [sh,sm] = cls.startTime.split(':').map(Number), [eh,em] = cls.endTime.split(':').map(Number);
  const s = new Date(cd); s.setHours(sh,sm,0,0);
  const e = new Date(cd); e.setHours(eh,em,0,0);
  if (now>=s && now<=e) return 'ongoing';
  if (now>e)            return 'completed';
  return 'scheduled';
};

// For SINGLE classes: simple flat list of recordings
const getSingleClassRecordings = (cls) => {
  if (cls.recordings?.length > 0) {
    // Only return recordings that are NOT longterm date-prefixed
    const flat = cls.recordings.filter(r => !r.label?.includes(' | '));
    if (flat.length > 0) return flat.map((r,i) => ({ label: r.label || ("Part " + (i+1)), url: r.url }));
    // Fallback: all recordings if none are flat (legacy)
    return cls.recordings.map((r,i) => ({ label: r.label || ("Part " + (i+1)), url: r.url }));
  }
  if (cls.recordingLink?.trim()) return [{ label: 'Part 1', url: cls.recordingLink }];
  return [];
};

// For LONGTERM classes: group by date → [{ date, displayDate, parts }]
const getLongtermRecordingsByDate = (cls) => {
  const all = cls.recordings || [];
  const groups = {};
  all.forEach(r => {
    if (r.label && r.label.includes(' | ')) {
      const pipeIdx = r.label.indexOf(' | ');
      const date = r.label.substring(0, pipeIdx);        // "2026-03-30"
      const partLabel = r.label.substring(pipeIdx + 3);  // "Part 1"
      if (!groups[date]) groups[date] = [];
      groups[date].push({ label: partLabel, url: r.url });
    } else if (r.label || r.url) {
      // Legacy unlabelled — put under "Other"
      if (!groups['Other']) groups['Other'] = [];
      groups['Other'].push({ label: r.label || 'Part 1', url: r.url });
    }
  });
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a)) // newest first
    .map(([date, parts]) => ({ date, parts }));
};

// Generic hasAnyRecording check
const hasAnyRecording = (cls) => {
  if (cls.recordings?.length > 0) return true;
  if (cls.recordingLink?.trim()) return true;
  return false;
};

// Format a YYYY-MM-DD date string for display
const formatDateKey = (dateKey) => {
  if (dateKey === 'Other') return 'Other';
  try {
    return new Date(dateKey + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  } catch { return dateKey; }
};

const Badge = ({ status }) => {
  const cfg = {
    ongoing:   { bg:'#fff0f0', color:'#E8001C', border:'#ffc0c0' },
    completed: { bg:'#f3f4f6', color:'#6b7280', border:'#e5e7eb' },
    scheduled: { bg:'#ffffff', color:'#374151', border:'#e5e7eb' }
  }[status] || { bg:'#ffffff', color:'#374151', border:'#e5e7eb' };
  return (
    <span style={{ fontFamily:'Poppins,sans-serif', fontSize:'0.7rem', fontWeight:600, padding:'0.2rem 0.65rem', borderRadius:20, background:cfg.bg, color:cfg.color, border:`1px solid ${cfg.border}`, whiteSpace:'nowrap' }}>
      {status}
    </span>
  );
};

// Collapsible date group for longterm recordings in the Schedule tab
function LongtermDateBlock({ date, parts }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="lt-date-block">
      <div className="lt-date-block-header" onClick={() => setOpen(o => !o)}>
        <span style={{ fontFamily:'Poppins,sans-serif', fontSize:'0.72rem', fontWeight:600, color:'#555' }}>
          {formatDateKey(date)} · {parts.length} part{parts.length !== 1 ? 's' : ''}
        </span>
        {open
          ? <ChevronUp size={13} style={{ color:'#E8001C', flexShrink:0 }} />
          : <ChevronDown size={13} style={{ color:'#E8001C', flexShrink:0 }} />
        }
      </div>
      {open && (
        <div className="lt-date-block-body">
          {parts.map((part, i) => (
            <a key={i} href={part.url} target="_blank" rel="noopener noreferrer" className="td-watch-btn">
              <PlayCircle size={13} /><span>Watch {part.label}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════ */
export default function LearnerDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab,setActiveTab]                       = useState("overview");
  const [loading,setLoading]                           = useState(false);
  const [batches,setBatches]                           = useState([]);
  const [classes,setClasses]                           = useState([]);
  const [stats,setStats]                               = useState({ totalClasses:0, upcomingClasses:0, completedClasses:0, ongoingClasses:0 });
  const [showSettingsDropdown,setShowSettingsDropdown] = useState(false);
  const [error,setError]                               = useState("");
  const [collapsedDays,setCollapsedDays]               = useState({});
  const [mobileMenuOpen,setMobileMenuOpen]             = useState(false);

  const getAuthHeaders = () => ({ Authorization:`Bearer ${localStorage.getItem("token")}`, "Content-Type":"application/json" });

  useEffect(() => { if (!authLoading && user) fetchDashboardData(); }, [authLoading, user]);

  const fetchDashboardData = async () => {
    setLoading(true); setError("");
    try {
      const h = getAuthHeaders();
      const cr = await fetch(`${API_URL}/classes/my-classes`, { headers:h });
      if (!cr.ok) { const e = await cr.json(); throw new Error(e.message || 'Failed'); }
      const cd = await cr.json(); setClasses(cd || []);
      const br = await fetch(`${API_URL}/batches`, { headers:h });
      if (br.ok) {
        const ab = await br.json();
        setBatches(ab.filter(b => b.students && b.students.some(s => (typeof s==='object' ? s._id : s) === user._id)) || []);
      }
      setStats({
        totalClasses:    cd.length,
        upcomingClasses: cd.filter(c => getAutoStatus(c)==='scheduled').length,
        completedClasses:cd.filter(c => getAutoStatus(c)==='completed').length,
        ongoingClasses:  cd.filter(c => getAutoStatus(c)==='ongoing').length,
      });
    } catch(e) { console.error(e); setError('Failed to load dashboard data'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate("/login", { replace:true }); };

  const fmtDate  = d => d ? new Date(d).toLocaleDateString('en-US', { weekday:'short', year:'numeric', month:'short', day:'numeric' }) : 'N/A';
  const fmtShort = d => d ? new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : 'N/A';
  const fmtTime  = t => t || 'N/A';

  const fmtDayLabel = ds => {
    const date=new Date(ds), today=new Date(), yest=new Date(today);
    today.setHours(0,0,0,0); yest.setDate(today.getDate()-1);
    const dn=new Date(date); dn.setHours(0,0,0,0);
    if (dn.getTime()===today.getTime()) return "Today";
    if (dn.getTime()===yest.getTime())  return "Yesterday";
    return date.toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  };

  const toDateKey = d => {
    const dt = new Date(d);
    return `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}-${String(dt.getDate()).padStart(2,'0')}`;
  };

  const hasActiveBatch = () => {
    const t = new Date(); t.setHours(0,0,0,0);
    return batches.some(b => { if (!b.endDate) return true; const e=new Date(b.endDate); e.setHours(23,59,59,999); return e>=t; });
  };

  const isClassBatchActive = cls => {
    if (!cls.batch) return false;
    const cb = batches.find(b => b._id === cls.batch._id);
    if (!cb) return false; if (!cb.endDate) return true;
    const t=new Date(); t.setHours(0,0,0,0);
    const e=new Date(cb.endDate); e.setHours(23,59,59,999);
    return e >= t;
  };

  const isBatchActive = batch => !batch.endDate || (() => {
    const t=new Date(); t.setHours(0,0,0,0);
    const e=new Date(batch.endDate); e.setHours(23,59,59,999);
    return e >= t;
  })();

  const getTodayClasses  = () => { const t=new Date(); t.setHours(0,0,0,0); return classes.filter(c => { const d=new Date(c.date); d.setHours(0,0,0,0); return d.getTime()===t.getTime(); }); };
  const getUpcomingCls   = () => classes.filter(c => getAutoStatus(c)==='scheduled').sort((a,b) => new Date(a.date)-new Date(b.date)).slice(0,5);
  const getClassesWithR  = () => classes.filter(c => hasAnyRecording(c) && isClassBatchActive(c)).sort((a,b) => new Date(b.date)-new Date(a.date));

  // Total recording parts — for longterm, count actual recordings array items; for single, count flat
  const totalRecParts = getClassesWithR().reduce((sum, cls) => {
    if (cls.classType === 'longterm') return sum + (cls.recordings?.length || 0);
    return sum + getSingleClassRecordings(cls).length;
  }, 0);

  // Recordings tab: group by day
  // For longterm classes, each DATE within the class becomes its own "day group"
  // For single classes, the class date is the day
  const getRecByDay = () => {
    const groups = {};

    getClassesWithR().forEach(cls => {
      if (cls.classType === 'longterm') {
        // Each date within the longterm class gets its own day group
        const dateGroups = getLongtermRecordingsByDate(cls);
        dateGroups.forEach(({ date, parts }) => {
          const key = date === 'Other' ? 'other' : date;
          const dateObj = date === 'Other' ? new Date() : new Date(date + 'T00:00:00');
          if (!groups[key]) {
            groups[key] = {
              key,
              label: date === 'Other' ? 'Other Recordings' : fmtDayLabel(dateObj),
              date: dateObj,
              items: []
            };
          }
          // Push a "virtual" entry: the class with only this date's parts
          groups[key].items.push({
            ...cls,
            _displayParts: parts,       // only this date's parts
            _displayDate: date,
            _isLongtermEntry: true,
          });
        });
      } else {
        // Single class — group by its date
        const key = toDateKey(cls.date);
        if (!groups[key]) {
          groups[key] = { key, label: fmtDayLabel(cls.date), date: cls.date, items: [] };
        }
        groups[key].items.push(cls);
      }
    });

    return Object.values(groups).sort((a,b) => new Date(b.date) - new Date(a.date));
  };

  const toggleDay = key => setCollapsedDays(p => ({ ...p, [key]: !p[key] }));

  const tabs = ["overview","batches","schedule","recordings"];
  const statsCards = [
    { label:"Total Classes",  value:stats.totalClasses,     Icon:IconTotalClasses },
    { label:"Upcoming",       value:stats.upcomingClasses,  Icon:IconUpcoming },
    { label:"Completed",      value:stats.completedClasses, Icon:IconCompleted },
    { label:"Ongoing",        value:stats.ongoingClasses,   Icon:IconOngoing },
  ];
  const recDayGroups = getRecByDay();

  if (authLoading || (loading && classes.length===0)) return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <style>{globalStyles}</style>
      <div className="text-center">
        <div className="animate-spin h-12 w-12 mx-auto mb-4 rounded-full border-4 border-[#fff0f0] border-t-[#E8001C]"/>
        <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-[#0a0a0a]">Loading your dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <style>{globalStyles}</style>

      {/* HEADER */}
      <div className="bg-white border-b border-[#e5e7eb]" style={{ boxShadow:'0 1px 3px rgba(0,0,0,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
              <img src="/CCALogo.png" alt="CCA" className="h-9 sm:h-12 w-auto flex-shrink-0" />
              <div className="hidden sm:block h-8 w-px bg-[#e5e7eb]"/>
              <h1 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800 }} className="hidden sm:block text-lg sm:text-2xl text-[#0a0a0a] truncate">Student Portal</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div style={{ fontFamily:'Poppins,sans-serif' }} className="hidden md:block text-sm text-[#555]">
                Welcome, <span style={{ color:'#E8001C', fontWeight:600 }}>{user?.name || "Student"}</span>
              </div>
              <div className="relative">
                <button onClick={() => setShowSettingsDropdown(!showSettingsDropdown)} className="ld-settings-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </button>
                {showSettingsDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-[#e5e7eb] z-50 overflow-hidden" style={{ boxShadow:'0 8px 24px rgba(0,0,0,0.1)' }}>
                    <div className="px-4 py-3 border-b border-[#f0f0f0] md:hidden">
                      <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#999]">Signed in as</p>
                      <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] truncate">{user?.name}</p>
                    </div>
                    <button onClick={handleLogout} style={{ fontFamily:'Poppins,sans-serif' }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#0a0a0a] hover:bg-[#fff0f0] hover:text-[#E8001C] transition-colors text-left">
                      <LogOut size={16}/><span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 hover:bg-[#f5f5f5] rounded-lg border border-[#e5e7eb] transition-colors">
                <Menu size={20} className="text-[#0a0a0a]"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSettingsDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowSettingsDropdown(false)}/>}

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#e5e7eb] z-30">
          {tabs.map(tab => (
            <button key={tab} onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
              style={{ fontFamily:'Poppins,sans-serif' }}
              className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium border-b border-[#f5f5f5] last:border-0 transition-colors ${activeTab===tab ? 'text-[#E8001C] bg-[#fff0f0]' : 'text-[#555] hover:text-[#E8001C] hover:bg-[#fff0f0]'}`}>
              <span>{tab.charAt(0).toUpperCase()+tab.slice(1)}</span>
              {tab==="recordings" && totalRecParts>0 && <span style={{ background:'#E8001C' }} className="px-2 py-0.5 text-white text-xs rounded-full">{totalRecParts}</span>}
            </button>
          ))}
        </div>
      )}

      {/* Tab bar */}
      <div className="hidden sm:block bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`td-tab ${activeTab===tab ? 'active' : ''}`}>
                {tab.charAt(0).toUpperCase()+tab.slice(1)}
                {tab==="recordings" && totalRecParts>0 && <span className="ml-2 px-2 py-0.5 text-white text-xs rounded-full" style={{ background:'#E8001C' }}>{totalRecParts}</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile active tab label */}
      <div className="sm:hidden bg-white border-b border-[#e5e7eb] px-4 py-2 flex items-center justify-between">
        <span style={{ fontFamily:'Poppins,sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">{activeTab.charAt(0).toUpperCase()+activeTab.slice(1)}</span>
        <button onClick={() => setMobileMenuOpen(true)} style={{ fontFamily:'Poppins,sans-serif', color:'#E8001C' }} className="text-xs font-medium flex items-center gap-1">
          Change <ChevronDown size={14}/>
        </button>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {error && <div style={{ fontFamily:'Poppins,sans-serif' }} className="mb-4 p-4 bg-[#fff0f0] border border-[#ffc0c0] text-[#E8001C] rounded-lg text-sm">{error}</div>}

        {/* ── OVERVIEW ── */}
        {activeTab==="overview" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {statsCards.map(({ label, value, Icon }, i) => (
                <div key={i} className="stat-card bg-white rounded-xl p-4 sm:p-5 border border-[#e5e7eb] cursor-default transition-all duration-300 hover:border-[#ffc0c0] hover:shadow-md" style={{ boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-[#9ca3af] text-xs sm:text-sm truncate">{label}</p>
                      <p className="stat-num text-2xl sm:text-3xl text-[#0a0a0a] mt-1 transition-colors duration-300" style={{ fontFamily:'Montserrat,sans-serif', fontWeight:800 }}>{value}</p>
                    </div>
                    <Icon size={44}/>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* My Batches */}
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#e5e7eb]" style={{ boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700 }} className="text-base sm:text-lg text-[#0a0a0a] mb-4 flex items-center gap-2">
                  <span style={{ width:3, height:20, background:'#E8001C', borderRadius:2, display:'inline-block', flexShrink:0 }}/>My Batches
                </h3>
                <div className="space-y-3">
                  {batches.length>0 ? batches.slice(0,3).map(batch => (
                    <div key={batch._id} className="p-3 bg-[#fafafa] rounded-lg border border-[#f0f0f0] hover:border-[#ffc0c0] hover:bg-[#fff0f0] transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0 mr-2">
                          <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] truncate">{batch.name}</p>
                          <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#6b7280] mt-0.5">{batch.subject}</p>
                          <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af] mt-1">{fmtShort(batch.startDate)} – {fmtShort(batch.endDate)}</p>
                          {batch.trainer && <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af]">Trainer: {batch.trainer.name}</p>}
                        </div>
                        {!isBatchActive(batch) && <span style={{ fontFamily:'Poppins,sans-serif', background:'#f3f4f6', color:'#6b7280', border:'1px solid #e5e7eb' }} className="px-2 py-0.5 text-xs rounded-full flex-shrink-0">Ended</span>}
                      </div>
                    </div>
                  )) : <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-sm text-[#9ca3af] text-center py-8">No batches assigned yet</p>}
                </div>
              </div>

              {/* Today's Classes */}
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#e5e7eb]" style={{ boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700 }} className="text-base sm:text-lg text-[#0a0a0a] mb-4 flex items-center gap-2">
                  <span style={{ width:3, height:20, background:'#E8001C', borderRadius:2, display:'inline-block', flexShrink:0 }}/>Today's Classes
                </h3>
                <div className="space-y-3">
                  {getTodayClasses().length>0 ? getTodayClasses().map(cls => {
                    const auto = getAutoStatus(cls);
                    return (
                      <div key={cls._id} className="p-3 bg-[#fafafa] rounded-lg border border-[#f0f0f0] hover:border-[#ffc0c0] hover:bg-[#fff0f0] transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 mr-2">
                            <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] truncate">{cls.className}</p>
                            <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af] mt-0.5">{fmtTime(cls.startTime)} – {fmtTime(cls.endTime)}</p>
                            {cls.trainer && <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af]">Trainer: {cls.trainer.name}</p>}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge status={auto}/>
                            {cls.teamsLink && <a href={cls.teamsLink} target="_blank" rel="noopener noreferrer" className="td-join-btn"><ExternalLink size={13}/><span>Join</span></a>}
                          </div>
                        </div>
                      </div>
                    );
                  }) : <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-sm text-[#9ca3af] text-center py-8">No classes scheduled for today</p>}
                </div>
              </div>
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#e5e7eb]" style={{ boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
              <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700 }} className="text-base sm:text-lg text-[#0a0a0a] mb-4 flex items-center gap-2">
                <span style={{ width:3, height:20, background:'#E8001C', borderRadius:2, display:'inline-block', flexShrink:0 }}/>Upcoming Classes
              </h3>
              <div className="space-y-3">
                {getUpcomingCls().length>0 ? getUpcomingCls().map(cls => (
                  <div key={cls._id} className="flex items-center justify-between p-3 bg-[#fafafa] rounded-lg border border-[#f0f0f0] hover:border-[#ffc0c0] hover:bg-[#fff0f0] transition-all duration-200">
                    <div className="flex-1 min-w-0 mr-2">
                      <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] truncate">{cls.className}</p>
                      <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af] mt-0.5">{fmtShort(cls.date)} • {fmtTime(cls.startTime)} – {fmtTime(cls.endTime)}</p>
                      {cls.trainer && <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af]">Trainer: {cls.trainer.name}</p>}
                    </div>
                    {cls.teamsLink && <a href={cls.teamsLink} target="_blank" rel="noopener noreferrer" className="td-join-btn flex-shrink-0"><ExternalLink size={13}/><span>Join</span></a>}
                  </div>
                )) : <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-sm text-[#9ca3af] text-center py-8">No upcoming classes</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── BATCHES ── */}
        {activeTab==="batches" && (
          <div className="space-y-4 sm:space-y-6">
            <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700 }} className="text-lg sm:text-xl text-[#0a0a0a]">My Batches</h3>
            <div className="grid gap-4">
              {batches.map(batch => (
                <div key={batch._id} className="bg-white rounded-xl p-4 sm:p-6 border border-[#e5e7eb] hover:border-[#ffc0c0] hover:shadow-md transition-all duration-300 group" style={{ boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                  <div className="flex items-start gap-3">
                    <span style={{ width:3, minHeight:40, background:'#E8001C', borderRadius:2, flexShrink:0, alignSelf:'stretch' }}/>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700 }} className="text-base sm:text-lg text-[#0a0a0a] group-hover:text-[#E8001C] transition-colors">{batch.name}</h4>
                        {!isBatchActive(batch) && <span style={{ fontFamily:'Poppins,sans-serif', background:'#f3f4f6', color:'#6b7280', border:'1px solid #e5e7eb' }} className="px-2 py-0.5 text-xs rounded-full">Batch Ended</span>}
                      </div>
                      <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs sm:text-sm text-[#6b7280] mt-1">{batch.subject}</p>
                      <div style={{ fontFamily:'Poppins,sans-serif' }} className="flex flex-wrap gap-2 mt-2 text-xs sm:text-sm text-[#9ca3af]">
                        <span>{fmtDate(batch.startDate)} – {fmtDate(batch.endDate)}</span><span>•</span>
                        <span>{Array.isArray(batch.students) ? batch.students.length : 0} students</span>
                      </div>
                      {batch.trainer && <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs sm:text-sm text-[#9ca3af] mt-1">Trainer: {batch.trainer.name}</p>}
                    </div>
                  </div>
                </div>
              ))}
              {!batches.length && (
                <div className="bg-white rounded-xl p-12 text-center border border-[#e5e7eb]">
                  <div className="w-16 h-16 bg-[#fff0f0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                  <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-[#9ca3af]">No batches assigned to you</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SCHEDULE ── */}
        {activeTab==="schedule" && (
          <div className="space-y-4 sm:space-y-6">
            <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Class Schedule</h3>

            {/* Mobile */}
            <div className="block lg:hidden space-y-3">
              {classes.sort((a,b) => new Date(b.date)-new Date(a.date)).map(cls => {
                const auto = getAutoStatus(cls);
                const isLongterm = cls.classType === 'longterm';
                const longtermDates = isLongterm && isClassBatchActive(cls) ? getLongtermRecordingsByDate(cls) : [];
                const singleParts = !isLongterm && isClassBatchActive(cls) ? getSingleClassRecordings(cls) : [];
                return (
                  <div key={cls._id} className="bg-white rounded-xl p-4 border border-[#e5e7eb] hover:border-[#ffc0c0] hover:shadow-md transition-all" style={{ boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1 mr-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">{cls.className}</p>
                          {isLongterm && <span style={{ fontFamily:'Poppins,sans-serif' }} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Long-Term</span>}
                        </div>
                        {cls.description && <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af] mt-0.5">{cls.description}</p>}
                        {!isLongterm && <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af] mt-1">{fmtShort(cls.date)}</p>}
                        <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af]">{fmtTime(cls.startTime)} – {fmtTime(cls.endTime)}</p>
                        {cls.trainer && <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af]">Trainer: {cls.trainer?.name || 'N/A'}</p>}
                      </div>
                      <Badge status={auto}/>
                    </div>
                    <div className="mt-2 space-y-1">
                      {cls.teamsLink && auto !== 'completed' && (
                        <div><a href={cls.teamsLink} target="_blank" rel="noopener noreferrer" className="td-join-btn"><ExternalLink size={13}/><span>Join</span></a></div>
                      )}
                      {/* Longterm: date-grouped collapsible blocks */}
                      {isLongterm && longtermDates.length > 0 && longtermDates.map(({ date, parts }) => (
                        <LongtermDateBlock key={date} date={date} parts={parts} />
                      ))}
                      {/* Single: flat part buttons */}
                      {!isLongterm && singleParts.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {singleParts.map((p,i) => (
                            <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="td-watch-btn"><PlayCircle size={13}/><span>{p.label}</span></a>
                          ))}
                        </div>
                      )}
                      {!isClassBatchActive(cls) && hasAnyRecording(cls) && (
                        <span style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af] italic">Batch ended</span>
                      )}
                    </div>
                  </div>
                );
              })}
              {!classes.length && <div className="bg-white rounded-xl p-12 text-center border border-[#e5e7eb]"><p style={{ fontFamily:'Poppins,sans-serif' }} className="text-[#9ca3af]">No classes available</p></div>}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block bg-white rounded-xl border border-[#e5e7eb] overflow-hidden" style={{ boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
              <table className="w-full">
                <thead style={{ background:'#0a0a0a' }}>
                  <tr>{["Class Name","Date","Time","Trainer","Status","Actions"].map(h => (
                    <th key={h} style={{ fontFamily:'Poppins,sans-serif' }} className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f5]">
                  {classes.sort((a,b) => new Date(b.date)-new Date(a.date)).map(cls => {
                    const auto = getAutoStatus(cls);
                    const isLongterm = cls.classType === 'longterm';
                    const longtermDates = isLongterm && isClassBatchActive(cls) ? getLongtermRecordingsByDate(cls) : [];
                    const singleParts = !isLongterm && isClassBatchActive(cls) ? getSingleClassRecordings(cls) : [];
                    return (
                      <tr key={cls._id} className="hover:bg-[#fff0f0] transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            <div style={{ fontFamily:'Poppins,sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] group-hover:text-[#E8001C] transition-colors">{cls.className}</div>
                            {isLongterm && <span style={{ fontFamily:'Poppins,sans-serif' }} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Long-Term</span>}
                          </div>
                          {cls.description && <div style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af] mt-0.5">{cls.description}</div>}
                        </td>
                        <td style={{ fontFamily:'Poppins,sans-serif' }} className="px-6 py-4 text-sm text-[#6b7280]">
                          {isLongterm ? <span className="text-xs text-blue-600">Batch period</span> : fmtDate(cls.date)}
                        </td>
                        <td style={{ fontFamily:'Poppins,sans-serif' }} className="px-6 py-4 text-sm text-[#6b7280]">{fmtTime(cls.startTime)} – {fmtTime(cls.endTime)}</td>
                        <td style={{ fontFamily:'Poppins,sans-serif' }} className="px-6 py-4 text-sm text-[#6b7280]">{cls.trainer?.name || 'N/A'}</td>
                        <td className="px-6 py-4"><Badge status={auto}/></td>
                        <td className="px-6 py-4" style={{ minWidth:'200px', maxWidth:'280px' }}>
                          <div className="space-y-1">
                            {cls.teamsLink && auto !== 'completed' && (
                              <div><a href={cls.teamsLink} target="_blank" rel="noopener noreferrer" className="td-join-btn"><ExternalLink size={13}/><span>Join</span></a></div>
                            )}
                            {/* Longterm: date-grouped collapsible blocks */}
                            {isLongterm && longtermDates.map(({ date, parts }) => (
                              <LongtermDateBlock key={date} date={date} parts={parts} />
                            ))}
                            {/* Single: flat buttons */}
                            {!isLongterm && singleParts.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
                                {singleParts.map((p,i) => (
                                  <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="td-watch-btn"><PlayCircle size={13}/><span>{p.label}</span></a>
                                ))}
                              </div>
                            )}
                            {!isClassBatchActive(cls) && hasAnyRecording(cls) && (
                              <span style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af] italic">Batch ended</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!classes.length && <div className="text-center py-12"><p style={{ fontFamily:'Poppins,sans-serif' }} className="text-[#9ca3af]">No classes available</p></div>}
            </div>
          </div>
        )}

        {/* ── RECORDINGS ── */}
        {activeTab==="recordings" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div>
                <h3 style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Class Recordings</h3>
                {totalRecParts > 0 && <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs sm:text-sm text-[#9ca3af] mt-1">{totalRecParts} recording part{totalRecParts!==1?'s':''} across {recDayGroups.length} day{recDayGroups.length!==1?'s':''}</p>}
              </div>
              {!hasActiveBatch() && batches.length > 0 && (
                <div style={{ fontFamily:'Poppins,sans-serif' }} className="flex items-start sm:items-center gap-2 px-3 py-2 bg-yellow-50 border border-yellow-300 rounded-lg">
                  <AlertCircle size={15} className="text-yellow-600 flex-shrink-0 mt-0.5 sm:mt-0"/>
                  <span className="text-xs sm:text-sm text-yellow-800">All your batches have ended — recordings are no longer available</span>
                </div>
              )}
            </div>

            {recDayGroups.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {recDayGroups.map(group => {
                  const isCollapsed = !!collapsedDays[group.key];
                  // Count parts in this group
                  const partCount = group.items.reduce((s, item) => {
                    if (item._isLongtermEntry) return s + item._displayParts.length;
                    return s + getSingleClassRecordings(item).length;
                  }, 0);
                  return (
                    <div key={group.key} className="bg-white rounded-xl border border-[#e5e7eb] overflow-hidden" style={{ boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
                      <button onClick={() => toggleDay(group.key)} className="rec-day-header w-full flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}>
                            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          <div className="text-left min-w-0">
                            <p style={{ fontFamily:'Montserrat,sans-serif', fontWeight:700, color:'#0a0a0a' }} className="text-sm sm:text-base">{group.label}</p>
                            <p style={{ fontFamily:'Poppins,sans-serif', color:'#9ca3af' }} className="text-xs mt-0.5 truncate">
                              {new Date(group.date).toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 ml-2">
                          <span style={{ fontFamily:'Poppins,sans-serif', background:'#E8001C', color:'#ffffff', fontWeight:700 }} className="px-2 sm:px-3 py-1 text-xs rounded-full">{partCount} part{partCount!==1?'s':''}</span>
                          {isCollapsed ? <ChevronDown size={16} style={{ color:'#0a0a0a' }}/> : <ChevronUp size={16} style={{ color:'#0a0a0a' }}/>}
                        </div>
                      </button>
                      {!isCollapsed && (
                        <div className="divide-y divide-[#f5f5f5]">
                          {group.items.map((cls, idx) => {
                            // Longterm virtual entry — only show this date's parts
                            const parts = cls._isLongtermEntry
                              ? cls._displayParts
                              : getSingleClassRecordings(cls);
                            const auto = getAutoStatus(cls);
                            return (
                              <div key={cls._id + (cls._displayDate || '')} className="px-4 sm:px-6 py-4 sm:py-5 hover:bg-[#fff0f0] transition-colors">
                                <div className="flex items-start gap-3 sm:gap-4">
                                  <div style={{ fontFamily:'Poppins,sans-serif', background:'#E8001C' }} className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 text-xs sm:text-sm font-bold mt-0.5">{idx+1}</div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">{cls.className}</p>
                                        {cls._isLongtermEntry && <span style={{ fontFamily:'Poppins,sans-serif' }} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Long-Term</span>}
                                      </div>
                                      <Badge status={auto}/>
                                    </div>
                                    <div style={{ fontFamily:'Poppins,sans-serif' }} className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#9ca3af] mt-0.5">
                                      {cls.batch && <span>Batch: {cls.batch.name}</span>}
                                      {cls.trainer && <><span>·</span><span>Trainer: {cls.trainer.name}</span></>}
                                      <span>·</span><span>{fmtTime(cls.startTime)} – {fmtTime(cls.endTime)}</span>
                                    </div>
                                    {cls.description && <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-xs text-[#9ca3af] mt-1">{cls.description}</p>}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                      {parts.map((part, i) => (
                                        <a key={i} href={part.url} target="_blank" rel="noopener noreferrer" className="td-watch-btn">
                                          <PlayCircle size={14}/><span>Watch {part.label}</span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-[#e5e7eb]">
                <div className="w-16 h-16 bg-[#fff0f0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" stroke="#E8001C" fill="none" strokeWidth="1.8"/>
                  </svg>
                </div>
                <p style={{ fontFamily:'Poppins,sans-serif' }} className="text-[#9ca3af] font-semibold">
                  {!hasActiveBatch() && batches.length>0 ? "Recordings are no longer available as your batches have ended" : "No recordings available yet"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}