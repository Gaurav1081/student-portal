import React, { useState, useEffect } from "react";
import { Plus, X, Save, Loader, LogOut, Menu, ChevronDown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const API_URL = config.apiUrl;

const IconBatches = ({ size = 44 }) => (
  <div style={{ width: size, height: size, background: '#fff0f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }} className="stat-icon">
    <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="9" y1="7" x2="15" y2="7"/>
      <line x1="9" y1="11" x2="15" y2="11"/>
    </svg>
  </div>
);

const IconClasses = ({ size = 44 }) => (
  <div style={{ width: size, height: size, background: '#fff0f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }} className="stat-icon">
    <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/>
      <polygon points="10 8 16 11 10 14 10 8" stroke="#E8001C" strokeWidth="1.8" fill="none"/>
      <line x1="8" y1="21" x2="16" y2="21"/>
      <line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  </div>
);

const IconToday = ({ size = 44 }) => (
  <div style={{ width: size, height: size, background: '#fff0f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }} className="stat-icon">
    <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
      <circle cx="12" cy="16" r="1.5" fill="#E8001C" stroke="none"/>
    </svg>
  </div>
);

const IconUpcoming = ({ size = 44 }) => (
  <div style={{ width: size, height: size, background: '#fff0f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s' }} className="stat-icon">
    <svg width={size * 0.52} height={size * 0.52} viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" fill="none"/>
      <polyline points="12 7 12 12 15.5 15.5"/>
    </svg>
  </div>
);

const IconSettings = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const IconLink = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');

  .td-tab {
    position: relative; overflow: hidden;
    padding: 1rem 0.5rem;
    font-family: 'Poppins', sans-serif;
    font-size: 0.875rem; font-weight: 500;
    color: #555555;
    background: none; border: none; border-bottom: 2px solid transparent;
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

  .td-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center; gap: 0.4rem;
    padding: 0.6rem 1.35rem;
    font-family: 'Poppins', sans-serif; font-size: 0.875rem; font-weight: 600;
    color: #ffffff; background: #E8001C;
    border: 2px solid #E8001C; border-radius: 8px;
    cursor: pointer; text-decoration: none;
    transition: color 0.4s ease, border-color 0.4s ease;
    white-space: nowrap;
  }
  .td-btn::after {
    content: ''; position: absolute; top: 50%; left: 50%;
    width: 0; height: 0; background: #0a0a0a; border-radius: 50%;
    transform: translate(-50%,-50%);
    transition: width 0.55s cubic-bezier(0.4,0,0.2,1), height 0.55s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }
  .td-btn:hover::after { width: 340px; height: 340px; }
  .td-btn:hover { border-color: #0a0a0a; }
  .td-btn > *, .td-btn span { position: relative; z-index: 1; }

  .td-btn-ghost {
    background: #ffffff; color: #0a0a0a;
    border: 2px solid #e5e7eb;
  }
  .td-btn-ghost::after { background: #E8001C; }
  .td-btn-ghost:hover  { color: #ffffff; border-color: #E8001C; }

  .td-icon-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px;
    color: #E8001C; background: #fff0f0;
    border: 1.5px solid #ffc0c0; border-radius: 8px;
    cursor: pointer;
    transition: color 0.4s ease, border-color 0.4s ease;
    flex-shrink: 0;
  }
  .td-icon-btn::after {
    content: ''; position: absolute; top: 50%; left: 50%;
    width: 0; height: 0; background: #0a0a0a; border-radius: 50%;
    transform: translate(-50%,-50%);
    transition: width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }
  .td-icon-btn:hover::after { width: 80px; height: 80px; }
  .td-icon-btn > svg { position: relative; z-index: 1; }
  .td-icon-btn:hover { color: #ffffff; border-color: #0a0a0a; }

  .td-icon-delete {
    color: #E8001C; background: #fff0f0; border-color: #ffc0c0;
  }

  .td-settings-btn {
    position: relative; overflow: hidden;
    display: inline-flex; align-items: center; justify-content: center;
    width: 38px; height: 38px;
    color: #555555; background: #ffffff;
    border: 1.5px solid #e5e7eb; border-radius: 8px;
    cursor: pointer;
    transition: color 0.4s ease, border-color 0.4s ease;
  }
  .td-settings-btn::after {
    content: ''; position: absolute; top: 50%; left: 50%;
    width: 0; height: 0; background: #E8001C; border-radius: 50%;
    transform: translate(-50%,-50%);
    transition: width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1);
    z-index: 0;
  }
  .td-settings-btn:hover::after { width: 80px; height: 80px; }
  .td-settings-btn > svg { position: relative; z-index: 1; }
  .td-settings-btn:hover { color: #ffffff; border-color: #E8001C; }

  .stat-card:hover .stat-icon { background: #E8001C !important; }
  .stat-card:hover .stat-icon svg { stroke: #ffffff !important; }
  .stat-card:hover .stat-icon svg circle { fill: none !important; stroke: #ffffff !important; }
  .stat-card:hover .stat-num { color: #E8001C; }

  .cls-row:hover { background: #fff5f5; }
  .cls-row:hover .cls-name { color: #E8001C; }

  .td-input:focus {
    border-color: #E8001C !important;
    box-shadow: 0 0 0 3px rgba(239,68,68,0.1);
    outline: none;
  }
`;

const getAutoStatus = (cls) => {
  if (!cls.date || !cls.startTime || !cls.endTime) return cls.status || 'scheduled';
  const now = new Date();
  const classDate = new Date(cls.date);
  const [sh, sm] = cls.startTime.split(':').map(Number);
  const [eh, em] = cls.endTime.split(':').map(Number);
  const start = new Date(classDate); start.setHours(sh, sm, 0, 0);
  const end   = new Date(classDate); end.setHours(eh, em, 0, 0);
  if (now >= start && now <= end) return 'ongoing';
  if (now > end)                  return 'completed';
  return 'scheduled';
};

const Badge = ({ status }) => {
  const cfg = {
    ongoing:   { bg: '#fff0f0', color: '#E8001C', border: '#ffc0c0' },
    completed: { bg: '#f3f4f6', color: '#6b7280', border: '#e5e7eb' },
    scheduled: { bg: '#ffffff', color: '#374151', border: '#e5e7eb' },
  }[status] || { bg: '#ffffff', color: '#374151', border: '#e5e7eb' };
  return (
    <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.65rem', borderRadius: 20, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>
      {status}
    </span>
  );
};

const fmtDate  = (d) => d ? new Date(d).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' }) : 'N/A';
const fmtShort = (d) => d ? new Date(d).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }) : 'N/A';

export default function TrainerDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab,            setActiveTab]            = useState("overview");
  const [stats,                setStats]                = useState({ totalBatches:0, totalClasses:0, todayClasses:0, upcomingClasses:0 });
  const [loading,              setLoading]              = useState(false);
  const [batches,              setBatches]              = useState([]);
  const [classes,              setClasses]              = useState([]);
  const [showModal,            setShowModal]            = useState(false);
  const [selectedItem,         setSelectedItem]         = useState(null);
  const [formData,             setFormData]             = useState({});
  const [submitting,           setSubmitting]           = useState(false);
  const [error,                setError]                = useState("");
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [mobileMenuOpen,       setMobileMenuOpen]       = useState(false);

  const getAuthHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" });

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const h = getAuthHeaders();
      const [cr, br] = await Promise.all([fetch(`${API_URL}/classes/my-classes`,{headers:h}), fetch(`${API_URL}/batches`,{headers:h})]);
      if (!cr.ok || !br.ok) throw new Error('Failed to fetch data');
      const cd = await cr.json(); const ab = await br.json();
      const tb = ab.filter(b => b.trainer && b.trainer._id === user._id);
      setBatches(tb||[]); setClasses(cd||[]);
      const today = new Date(); today.setHours(0,0,0,0);
      const tc = (cd||[]).filter(c => { const d=new Date(c.date); d.setHours(0,0,0,0); return d.getTime()===today.getTime(); }).length;
      const uc = (cd||[]).filter(c => { const d=new Date(c.date); d.setHours(0,0,0,0); return d.getTime()>today.getTime(); }).length;
      setStats({ totalBatches:tb?.length||0, totalClasses:cd?.length||0, todayClasses:tc, upcomingClasses:uc });
    } catch (e) { console.error(e); setError('Failed to load dashboard data'); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate("/login",{replace:true}); };

  const openCreate = () => {
    setSelectedItem(null);
    setFormData({ className:"", batch:"", date:"", startTime:"", endTime:"", teamsLink:"", description:"", status:"scheduled" });
    setError(""); setShowModal(true);
  };
  const openEdit = (cls) => {
    setSelectedItem(cls);
    setFormData({ className:cls.className||"", batch:cls.batch?._id||"", date:cls.date?new Date(cls.date).toISOString().split('T')[0]:"", startTime:cls.startTime||"", endTime:cls.endTime||"", teamsLink:cls.teamsLink||"", description:cls.description||"", status:cls.status||"scheduled" });
    setError(""); setShowModal(true);
  };
  const handleSave = async () => {
    setSubmitting(true); setError("");
    const req = {'Class Name':formData.className,'Batch':formData.batch,'Date':formData.date,'Start Time':formData.startTime,'End Time':formData.endTime,'MS Teams Link':formData.teamsLink};
    const miss = Object.entries(req).filter(([,v])=>!v||v==='').map(([k])=>k);
    if (miss.length) { setError(`Please fill in: ${miss.join(', ')}`); setSubmitting(false); return; }
    try {
      const h = getAuthHeaders();
      const res = selectedItem
        ? await fetch(`${API_URL}/classes/${selectedItem._id}`,{method:'PUT', headers:h,body:JSON.stringify(formData)})
        : await fetch(`${API_URL}/classes`,{method:'POST',headers:h,body:JSON.stringify(formData)});
      if (!res.ok) { const e=await res.json(); throw new Error(e.message||'Failed to save'); }
      setShowModal(false); alert(selectedItem?"Class updated!":"Class created!"); fetchDashboardData();
    } catch(e) { setError(e.message||"Failed to save class"); }
    finally { setSubmitting(false); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this class?")) return;
    try {
      const res = await fetch(`${API_URL}/classes/${id}`,{method:'DELETE',headers:getAuthHeaders()});
      if (!res.ok) { const e=await res.json(); throw new Error(e.message||'Failed'); }
      alert("Class deleted!"); fetchDashboardData();
    } catch(e) { alert(e.message||"Failed to delete"); }
  };

  const tabs = ["overview","batches","classes"];
  const statsCards = [
    { label:"My Batches",       value:stats.totalBatches,    Icon:IconBatches  },
    { label:"Total Classes",    value:stats.totalClasses,    Icon:IconClasses  },
    { label:"Today's Classes",  value:stats.todayClasses,    Icon:IconToday    },
    { label:"Upcoming Classes", value:stats.upcomingClasses, Icon:IconUpcoming },
  ];

  const inputCls = "w-full px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-[#0a0a0a] bg-white td-input transition-all";

  if (loading && classes.length===0) return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
      <style>{globalStyles}</style>
      <div className="text-center">
        <Loader className="animate-spin h-12 w-12 mx-auto mb-4" style={{color:'#E8001C'}}/>
        <p style={{fontFamily:'Poppins,sans-serif'}} className="text-[#555]">Loading dashboard…</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <style>{globalStyles}</style>

      {/* HEADER */}
      <div className="bg-white border-b border-[#e5e7eb]" style={{boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
              <img src="/CCALogo.png" alt="CCA" className="h-9 sm:h-12 w-auto flex-shrink-0" />
              <div className="hidden sm:block h-8 w-px bg-[#e5e7eb]"/>
              <h1 style={{fontFamily:'Montserrat,sans-serif',fontWeight:800}} className="hidden sm:block text-lg sm:text-2xl text-[#0a0a0a] truncate">
                Trainer Dashboard
              </h1>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3">
              <div style={{fontFamily:'Poppins,sans-serif'}} className="hidden md:block text-sm text-[#555]">
                Welcome, <span style={{color:'#E8001C',fontWeight:600}}>{user?.name||"Trainer"}</span>
              </div>

              <div className="relative">
                <button className="td-settings-btn" onClick={()=>setShowSettingsDropdown(!showSettingsDropdown)}>
                  <IconSettings />
                </button>
                {showSettingsDropdown && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-[#e5e7eb] z-50 overflow-hidden" style={{boxShadow:'0 8px 24px rgba(0,0,0,0.1)'}}>
                    <div className="px-4 py-3 border-b border-[#f0f0f0] md:hidden">
                      <p style={{fontFamily:'Poppins,sans-serif'}} className="text-xs text-[#999]">Signed in as</p>
                      <p style={{fontFamily:'Poppins,sans-serif'}} className="text-sm font-semibold text-[#0a0a0a] truncate">{user?.name}</p>
                    </div>
                    <button onClick={handleLogout} style={{fontFamily:'Poppins,sans-serif'}}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#0a0a0a] hover:bg-[#fff0f0] hover:text-[#E8001C] transition-colors text-left">
                      <LogOut size={16}/><span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              <button onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 hover:bg-[#f5f5f5] rounded-lg border border-[#e5e7eb] transition-colors">
                <Menu size={20} className="text-[#0a0a0a]"/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSettingsDropdown && <div className="fixed inset-0 z-40" onClick={()=>setShowSettingsDropdown(false)}/>}

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-[#e5e7eb] z-30">
          {tabs.map(tab => (
            <button key={tab} onClick={()=>{setActiveTab(tab);setMobileMenuOpen(false);}}
              style={{fontFamily:'Poppins,sans-serif'}}
              className={`w-full flex items-center px-6 py-3 text-sm font-medium border-b border-[#f5f5f5] last:border-0 transition-colors ${activeTab===tab?'text-[#E8001C] bg-[#fff0f0]':'text-[#555] hover:text-[#E8001C] hover:bg-[#fff0f0]'}`}>
              {tab.charAt(0).toUpperCase()+tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* TAB BAR */}
      <div className="hidden sm:block bg-white border-b border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto">
            {tabs.map(tab => (
              <button key={tab} onClick={()=>setActiveTab(tab)} className={`td-tab ${activeTab===tab?'active':''}`}>
                {tab.charAt(0).toUpperCase()+tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile active tab label */}
      <div className="sm:hidden bg-white border-b border-[#e5e7eb] px-4 py-2 flex items-center justify-between">
        <span style={{fontFamily:'Poppins,sans-serif'}} className="text-sm font-semibold text-[#0a0a0a]">
          {activeTab.charAt(0).toUpperCase()+activeTab.slice(1)}
        </span>
        <button onClick={()=>setMobileMenuOpen(true)}
          style={{fontFamily:'Poppins,sans-serif', color:'#E8001C'}} className="text-xs font-medium flex items-center gap-1">
          Change <ChevronDown size={14}/>
        </button>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {/* OVERVIEW */}
        {activeTab==="overview" && (
          <div className="space-y-4 sm:space-y-6">

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
              {statsCards.map(({label,value,Icon},i) => (
                <div key={i} className="stat-card bg-white rounded-xl p-4 sm:p-5 border border-[#e5e7eb] cursor-default transition-all duration-300 hover:border-[#ffc0c0] hover:shadow-md"
                  style={{boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p style={{fontFamily:'Poppins,sans-serif'}} className="text-[#9ca3af] text-xs sm:text-sm truncate">{label}</p>
                      <p className="stat-num text-2xl sm:text-3xl text-[#0a0a0a] mt-1 transition-colors duration-300"
                        style={{fontFamily:'Montserrat,sans-serif',fontWeight:800}}>{value}</p>
                    </div>
                    <Icon size={44}/>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">

              {/* Today's Classes */}
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#e5e7eb]" style={{boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
                <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700}} className="text-base sm:text-lg text-[#0a0a0a] mb-4 flex items-center gap-2">
                  <span style={{width:3,height:20,background:'#E8001C',borderRadius:2,display:'inline-block',flexShrink:0}}/>
                  Today's Classes
                </h3>
                <div className="space-y-3">
                  {(() => {
                    const today = new Date(); today.setHours(0,0,0,0);
                    const tc = classes.filter(c=>{const d=new Date(c.date);d.setHours(0,0,0,0);return d.getTime()===today.getTime();});
                    if (!tc.length) return <p style={{fontFamily:'Poppins,sans-serif'}} className="text-sm text-[#9ca3af] text-center py-6">No classes scheduled for today</p>;
                    return tc.slice(0,3).map(cls => {
                      const auto = getAutoStatus(cls);
                      return (
                        <div key={cls._id} className="p-3 bg-[#fafafa] rounded-lg border border-[#f0f0f0] hover:border-[#ffc0c0] hover:bg-[#fff0f0] transition-all duration-200">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p style={{fontFamily:'Poppins,sans-serif'}} className="text-sm font-semibold text-[#0a0a0a] truncate">{cls.className}</p>
                              <p style={{fontFamily:'Poppins,sans-serif'}} className="text-xs text-[#9ca3af] mt-0.5 truncate">{cls.batch?.name||'N/A'} • {cls.startTime} – {cls.endTime}</p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge status={auto}/>
                              <a href={cls.teamsLink} target="_blank" rel="noopener noreferrer" className="td-btn" style={{padding:'0.28rem 0.75rem',fontSize:'0.72rem'}}>
                                <span>Join</span>
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* My Batches */}
              <div className="bg-white rounded-xl p-4 sm:p-6 border border-[#e5e7eb]" style={{boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
                <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700}} className="text-base sm:text-lg text-[#0a0a0a] mb-4 flex items-center gap-2">
                  <span style={{width:3,height:20,background:'#E8001C',borderRadius:2,display:'inline-block',flexShrink:0}}/>
                  My Batches
                </h3>
                <div className="space-y-3">
                  {batches.slice(0,3).map(b => (
                    <div key={b._id} className="p-3 bg-[#fafafa] rounded-lg border border-[#f0f0f0] hover:border-[#ffc0c0] hover:bg-[#fff0f0] transition-all duration-200">
                      <p style={{fontFamily:'Poppins,sans-serif'}} className="text-sm font-semibold text-[#0a0a0a] truncate">{b.name}</p>
                      <p style={{fontFamily:'Poppins,sans-serif'}} className="text-xs text-[#9ca3af] mt-0.5">{b.subject} • {b.students?.length||0} students</p>
                    </div>
                  ))}
                  {!batches.length && <p style={{fontFamily:'Poppins,sans-serif'}} className="text-sm text-[#9ca3af] text-center py-6">No batches assigned</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BATCHES */}
        {activeTab==="batches" && (
          <div className="space-y-4 sm:space-y-6">
            <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700}} className="text-lg sm:text-xl text-[#0a0a0a]">My Batches</h3>
            <div className="grid gap-4">
              {batches.map(b => (
                <div key={b._id} className="bg-white rounded-xl p-4 sm:p-6 border border-[#e5e7eb] hover:border-[#ffc0c0] hover:shadow-md transition-all duration-300 group"
                  style={{boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
                  <div className="flex items-start gap-3">
                    <span style={{width:3,minHeight:40,background:'#E8001C',borderRadius:2,flexShrink:0,alignSelf:'stretch'}}/>
                    <div className="flex-1 min-w-0">
                      <h4 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700}} className="text-base sm:text-lg text-[#0a0a0a] group-hover:text-[#E8001C] transition-colors">{b.name}</h4>
                      <p style={{fontFamily:'Poppins,sans-serif'}} className="text-xs sm:text-sm text-[#6b7280] mt-1">{b.subject}</p>
                      <div style={{fontFamily:'Poppins,sans-serif'}} className="flex flex-wrap items-center gap-2 mt-2 text-xs sm:text-sm text-[#9ca3af]">
                        <span>{fmtDate(b.startDate)} – {fmtDate(b.endDate)}</span>
                        <span>•</span>
                        <span>{b.students?.length||0} students</span>
                      </div>
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
                  <p style={{fontFamily:'Poppins,sans-serif'}} className="text-[#9ca3af]">No batches assigned to you</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CLASSES */}
        {activeTab==="classes" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700}} className="text-lg sm:text-xl text-[#0a0a0a]">My Classes</h3>
              <button onClick={openCreate} className="td-btn w-full sm:w-auto">
                <Plus size={18}/><span>Create Class</span>
              </button>
            </div>

            {/* Mobile cards */}
            <div className="block lg:hidden space-y-3">
              {classes.map(cls => {
                const auto = getAutoStatus(cls);
                return (
                  <div key={cls._id} className="bg-white rounded-xl p-4 border border-[#e5e7eb] hover:border-[#ffc0c0] hover:shadow-md transition-all duration-200"
                    style={{boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0 flex-1 mr-3">
                        <p style={{fontFamily:'Poppins,sans-serif'}} className="text-sm font-semibold text-[#0a0a0a]">{cls.className}</p>
                        <p style={{fontFamily:'Poppins,sans-serif'}} className="text-xs text-[#9ca3af] mt-0.5">{cls.batch?.name||'N/A'}</p>
                        <p style={{fontFamily:'Poppins,sans-serif'}} className="text-xs text-[#9ca3af]">{fmtShort(cls.date)} • {cls.startTime} – {cls.endTime}</p>
                      </div>
                      <Badge status={auto}/>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="td-icon-btn" onClick={()=>window.open(cls.teamsLink,'_blank')}><IconLink/></button>
                      <button className="td-icon-btn" onClick={()=>openEdit(cls)}><IconEdit/></button>
                      <button className="td-icon-btn td-icon-delete" onClick={()=>handleDelete(cls._id)}><IconTrash/></button>
                    </div>
                  </div>
                );
              })}
              {!classes.length && (
                <div className="bg-white rounded-xl p-12 text-center border border-[#e5e7eb]">
                  <div className="w-16 h-16 bg-[#fff0f0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><polygon points="10 8 16 11 10 14 10 8" stroke="#E8001C" fill="none" strokeWidth="1.8"/>
                      <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <p style={{fontFamily:'Poppins,sans-serif'}} className="text-[#9ca3af]">No classes created yet</p>
                </div>
              )}
            </div>

            {/* Desktop table */}
            <div className="hidden lg:block bg-white rounded-xl border border-[#e5e7eb] overflow-hidden" style={{boxShadow:'0 1px 3px rgba(0,0,0,0.04)'}}>
              <table className="w-full">
                <thead style={{background:'#0a0a0a'}}>
                  <tr>
                    {["Class Name","Batch","Date & Time","Status","Actions"].map(h => (
                      <th key={h} style={{fontFamily:'Poppins,sans-serif'}} className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5f5f5]">
                  {classes.map(cls => {
                    const auto = getAutoStatus(cls);
                    return (
                      <tr key={cls._id} className="cls-row transition-colors duration-150">
                        <td className="px-6 py-4">
                          <div className="cls-name text-sm font-semibold text-[#0a0a0a] transition-colors" style={{fontFamily:'Poppins,sans-serif'}}>{cls.className}</div>
                        </td>
                        <td style={{fontFamily:'Poppins,sans-serif'}} className="px-6 py-4 text-sm text-[#6b7280]">{cls.batch?.name||'N/A'}</td>
                        <td className="px-6 py-4">
                          <div style={{fontFamily:'Poppins,sans-serif'}} className="text-sm text-[#0a0a0a]">{fmtDate(cls.date)}</div>
                          <div style={{fontFamily:'Poppins,sans-serif'}} className="text-xs text-[#9ca3af]">{cls.startTime} – {cls.endTime}</div>
                        </td>
                        <td className="px-6 py-4"><Badge status={auto}/></td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <a href={cls.teamsLink} target="_blank" rel="noopener noreferrer" className="td-icon-btn"><IconLink/></a>
                            <button className="td-icon-btn" onClick={()=>openEdit(cls)}><IconEdit/></button>
                            <button className="td-icon-btn td-icon-delete" onClick={()=>handleDelete(cls._id)}><IconTrash/></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!classes.length && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-[#fff0f0] rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E8001C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><polygon points="10 8 16 11 10 14 10 8" stroke="#E8001C" fill="none" strokeWidth="1.8"/>
                      <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  </div>
                  <p style={{fontFamily:'Poppins,sans-serif'}} className="text-[#9ca3af]">No classes created yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4" style={{background:'rgba(10,10,10,0.45)'}}>
          <div className="bg-white rounded-t-2xl sm:rounded-xl w-full sm:max-w-2xl border border-[#e5e7eb] max-h-[92vh] overflow-y-auto"
            style={{boxShadow:'0 20px 60px rgba(0,0,0,0.15)'}}>

            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#f5f5f5]">
              <div className="flex items-center gap-2.5">
                <span style={{width:3,height:22,background:'#E8001C',borderRadius:2,display:'inline-block'}}/>
                <h3 style={{fontFamily:'Montserrat,sans-serif',fontWeight:700}} className="text-lg sm:text-xl text-[#0a0a0a]">
                  {selectedItem ? "Edit Class" : "Create New Class"}
                </h3>
              </div>
              <button className="td-icon-btn" onClick={()=>setShowModal(false)}><X size={17}/></button>
            </div>

            <div className="px-5 sm:px-6 py-5 space-y-4">
              {error && <div style={{fontFamily:'Poppins,sans-serif'}} className="p-3 bg-[#fff0f0] border border-[#ffc0c0] text-[#E8001C] rounded-lg text-sm">{error}</div>}

              <div>
                <label style={{fontFamily:'Poppins,sans-serif'}} className="block text-sm font-medium text-[#374151] mb-1.5">Class Name *</label>
                <input type="text" value={formData.className||""} onChange={e=>setFormData({...formData,className:e.target.value})}
                  style={{fontFamily:'Poppins,sans-serif'}} className={inputCls} placeholder="e.g., Introduction to VFX"/>
              </div>

              <div>
                <label style={{fontFamily:'Poppins,sans-serif'}} className="block text-sm font-medium text-[#374151] mb-1.5">Batch *</label>
                <select value={formData.batch||""} onChange={e=>setFormData({...formData,batch:e.target.value})}
                  style={{fontFamily:'Poppins,sans-serif'}} className={inputCls}>
                  <option value="">Select Batch</option>
                  {batches.map(b=><option key={b._id} value={b._id}>{b.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{fontFamily:'Poppins,sans-serif'}} className="block text-sm font-medium text-[#374151] mb-1.5">Date *</label>
                <input type="date" value={formData.date||""} onChange={e=>setFormData({...formData,date:e.target.value})}
                  style={{fontFamily:'Poppins,sans-serif'}} className={inputCls}/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{fontFamily:'Poppins,sans-serif'}} className="block text-sm font-medium text-[#374151] mb-1.5">Start Time *</label>
                  <input type="time" value={formData.startTime||""} onChange={e=>setFormData({...formData,startTime:e.target.value})}
                    style={{fontFamily:'Poppins,sans-serif'}} className={inputCls}/>
                </div>
                <div>
                  <label style={{fontFamily:'Poppins,sans-serif'}} className="block text-sm font-medium text-[#374151] mb-1.5">End Time *</label>
                  <input type="time" value={formData.endTime||""} onChange={e=>setFormData({...formData,endTime:e.target.value})}
                    style={{fontFamily:'Poppins,sans-serif'}} className={inputCls}/>
                </div>
              </div>

              <div>
                <label style={{fontFamily:'Poppins,sans-serif'}} className="block text-sm font-medium text-[#374151] mb-1.5">MS Teams Link *</label>
                <input type="url" value={formData.teamsLink||""} onChange={e=>setFormData({...formData,teamsLink:e.target.value})}
                  style={{fontFamily:'Poppins,sans-serif'}} className={inputCls} placeholder="https://teams.microsoft.com/…"/>
              </div>

              {selectedItem && (
                <div>
                  <label style={{fontFamily:'Poppins,sans-serif'}} className="block text-sm font-medium text-[#374151] mb-1.5">Status</label>
                  <select value={formData.status||""} onChange={e=>setFormData({...formData,status:e.target.value})}
                    style={{fontFamily:'Poppins,sans-serif'}} className={inputCls}>
                    <option value="scheduled">Scheduled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}

              <div>
                <label style={{fontFamily:'Poppins,sans-serif'}} className="block text-sm font-medium text-[#374151] mb-1.5">Description</label>
                <textarea value={formData.description||""} onChange={e=>setFormData({...formData,description:e.target.value})}
                  style={{fontFamily:'Poppins,sans-serif'}} className={`${inputCls} resize-none`} rows="3" placeholder="Class description…"/>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 border-t border-[#f5f5f5]">
                <button onClick={()=>setShowModal(false)} disabled={submitting} className="td-btn td-btn-ghost order-2 sm:order-1">
                  <span>Cancel</span>
                </button>
                <button onClick={handleSave} disabled={submitting} className="td-btn order-1 sm:order-2 disabled:opacity-50">
                  {submitting
                    ? <><Loader className="animate-spin" size={16}/><span>Saving…</span></>
                    : <><Save size={16}/><span>{selectedItem?"Update Class":"Create Class"}</span></>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}