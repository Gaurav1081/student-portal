import React, { useState, useEffect } from "react";
import { Users, BookOpen, Video, Calendar, Plus, Edit2, Trash2, Settings, UserCheck, ExternalLink, X, Save, Loader, LogOut, Search, UserPlus, Eye, EyeOff, GraduationCap, PlayCircle, Link, Menu, ChevronDown, ChevronUp, KeyRound, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import config from "../../config";

const API_URL = config.apiUrl;

const globalStyles = `
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Poppins:wght@400;500;600;700;800;900&display=swap');

.ad-tab {
  position:relative; overflow:hidden;
  padding:1rem 0.5rem;
  font-family:'Poppins',sans-serif; font-size:0.875rem; font-weight:500;
  color:#555555; background:none; border:none; border-bottom:2px solid transparent;
  cursor:pointer; white-space:nowrap; flex-shrink:0;
  transition:color 0.2s;
}
.ad-tab::after {
  content:''; position:absolute; bottom:0; left:0; right:0;
  height:2px; background:#E8001C;
  transform:scaleX(0); transform-origin:left;
  transition:transform 0.25s cubic-bezier(0.4,0,0.2,1);
  border-radius:2px;
}
.ad-tab:hover::after, .ad-tab.active::after { transform:scaleX(1); }
.ad-tab:hover, .ad-tab.active { color:#E8001C; }

.ad-btn {
  position:relative; overflow:hidden;
  display:inline-flex; align-items:center; justify-content:center; gap:0.4rem;
  padding:0.6rem 1.35rem;
  font-family:'Poppins',sans-serif; font-size:0.875rem; font-weight:600;
  color:#ffffff; background:#E8001C;
  border:2px solid #E8001C; border-radius:8px;
  cursor:pointer; text-decoration:none;
  transition:color 0.4s ease, border-color 0.4s ease;
  white-space:nowrap;
}
.ad-btn::after {
  content:''; position:absolute; top:50%; left:50%;
  width:0; height:0; background:#0a0a0a; border-radius:50%;
  transform:translate(-50%,-50%);
  transition:width 0.55s cubic-bezier(0.4,0,0.2,1), height 0.55s cubic-bezier(0.4,0,0.2,1);
  z-index:0;
}
.ad-btn:hover::after { width:400px; height:400px; }
.ad-btn:hover { border-color:#0a0a0a; }
.ad-btn > *, .ad-btn span { position:relative; z-index:1; }

.ad-btn-ghost {
  background:#ffffff; color:#0a0a0a; border:2px solid #e5e7eb;
}
.ad-btn-ghost::after { background:#E8001C; }
.ad-btn-ghost:hover { color:#ffffff; border-color:#E8001C; }

.ad-icon-btn {
  position:relative; overflow:hidden;
  display:inline-flex; align-items:center; justify-content:center;
  width:34px; height:34px;
  color:#E8001C; background:#fff0f0;
  border:1.5px solid #ffc0c0; border-radius:8px;
  cursor:pointer;
  transition:color 0.4s ease, border-color 0.4s ease;
  flex-shrink:0;
}
.ad-icon-btn::after {
  content:''; position:absolute; top:50%; left:50%;
  width:0; height:0; background:#0a0a0a; border-radius:50%;
  transform:translate(-50%,-50%);
  transition:width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1);
  z-index:0;
}
.ad-icon-btn:hover::after { width:80px; height:80px; }
.ad-icon-btn > svg, .ad-icon-btn > * { position:relative; z-index:1; }
.ad-icon-btn:hover { color:#ffffff; border-color:#0a0a0a; }

.ad-icon-delete { color:#E8001C; background:#fff0f0; border-color:#ffc0c0; }

.ad-icon-key { color:#7c3aed; background:#f5f3ff; border-color:#c4b5fd; }
.ad-icon-key:hover { border-color:#0a0a0a; }

.ad-icon-whatsapp { color:#25D366; background:#e9fbf0; border-color:#b7f5cd; }
.ad-icon-whatsapp:hover { border-color:#0a0a0a; }

.ad-settings-btn {
  position:relative; overflow:hidden;
  display:inline-flex; align-items:center; justify-content:center;
  width:38px; height:38px;
  color:#555555; background:#ffffff;
  border:1.5px solid #e5e7eb; border-radius:8px;
  cursor:pointer;
  transition:color 0.4s ease, border-color 0.4s ease;
}
.ad-settings-btn::after {
  content:''; position:absolute; top:50%; left:50%;
  width:0; height:0; background:#E8001C; border-radius:50%;
  transform:translate(-50%,-50%);
  transition:width 0.45s cubic-bezier(0.4,0,0.2,1), height 0.45s cubic-bezier(0.4,0,0.2,1);
  z-index:0;
}
.ad-settings-btn:hover::after { width:80px; height:80px; }
.ad-settings-btn > svg { position:relative; z-index:1; }
.ad-settings-btn:hover { color:#ffffff; border-color:#E8001C; }

.stat-card:hover .stat-icon { background:#E8001C !important; }
.stat-card:hover .stat-icon svg { stroke:#ffffff !important; }
.stat-card:hover .stat-num { color:#E8001C; }

.ad-row:hover { background:#fff0f0; }
.ad-row:hover .ad-row-name { color:#E8001C; }

.ad-input:focus { border-color:#E8001C !important; box-shadow:0 0 0 3px rgba(232,0,28,0.08); outline:none; }

.class-type-card {
  border:2px solid #e5e7eb; border-radius:12px; padding:1rem;
  cursor:pointer; transition:all 0.2s;
}
.class-type-card:hover { border-color:#E8001C; background:#fff8f8; }
.class-type-card.selected { border-color:#E8001C; background:#fff0f0; }

.rec-accordion {
  border: 1.5px solid #e8e8e8;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s;
}
.rec-accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  background: #f5f5f5;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
  gap: 0.5rem;
}
.rec-accordion-header:hover { background: #ffe8e8; }
.rec-accordion-body {
  padding: 0.5rem 0.75rem 0.6rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  background: #ffffff;
}
.rec-date-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.4rem 0.5rem;
  border: 1px solid #f0f0f0;
  border-radius: 7px;
  background: #fafafa;
}
`;

const getAutoStatus = (cls) => {
  if (!cls.date || !cls.startTime || !cls.endTime) return cls.status || 'scheduled';
  const now = new Date();
  const classDate = new Date(cls.date);
  const [startH, startM] = cls.startTime.split(':').map(Number);
  const [endH, endM] = cls.endTime.split(':').map(Number);
  const start = new Date(classDate); start.setHours(startH, startM, 0, 0);
  const end = new Date(classDate); end.setHours(endH, endM, 0, 0);
  if (now >= start && now <= end) return 'ongoing';
  if (now > end) return 'completed';
  return 'scheduled';
};

const statusColor = (status) => {
  switch (status) {
    case 'ongoing': return 'bg-[#E8001C] text-white';
    case 'completed': return 'bg-[#e8e8e8] text-[#0a0a0a]';
    default: return 'bg-white text-[#0a0a0a] border border-[#e8e8e8]';
  }
};

const getClassRecordings = (cls) => {
  if (cls.recordings && cls.recordings.length > 0) {
    return cls.recordings.map((r, i) => ({ label: r.label || ("Part " + (i + 1)), url: r.url }));
  }
  if (cls.recordingLink && cls.recordingLink.trim() !== '') {
    return [{ label: 'Part 1', url: cls.recordingLink }];
  }
  return [];
};

const getLongtermRecordingsByDate = (cls) => {
  const all = cls.recordings || [];
  const groups = {};
  all.forEach(r => {
    if (r.label && r.label.includes(" | ")) {
      const [date, partLabel] = r.label.split(" | ");
      if (!groups[date]) groups[date] = [];
      groups[date].push({ label: partLabel, url: r.url });
    } else {
      if (!groups["Other"]) groups["Other"] = [];
      groups["Other"].push({ label: r.label || "Part 1", url: r.url });
    }
  });
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, parts]) => ({ date, parts }));
};

const hasAnyRecording = (cls) => getClassRecordings(cls).length > 0;

// Collapsible long-term recordings accordion component
function LongtermRecordingsAccordion({ dateGroups, formatDate }) {
  const [open, setOpen] = useState(false);
  const totalParts = dateGroups.reduce((sum, g) => sum + g.parts.length, 0);

  return (
    <div className="rec-accordion">
      <div className="rec-accordion-header" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-2 min-w-0">
          <PlayCircle size={13} style={{ color: '#E8001C', flexShrink: 0 }} />
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#0a0a0a' }}>
            {dateGroups.length} date{dateGroups.length !== 1 ? 's' : ''} · {totalParts} part{totalParts !== 1 ? 's' : ''}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.7rem', color: '#E8001C', fontWeight: 600 }}>
            {open ? 'Hide' : 'Show'}
          </span>
          {open
            ? <ChevronUp size={14} style={{ color: '#E8001C' }} />
            : <ChevronDown size={14} style={{ color: '#E8001C' }} />
          }
        </div>
      </div>
      {open && (
        <div className="rec-accordion-body">
          {dateGroups.map(({ date, parts }) => (
            <div key={date} className="rec-date-row">
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.7rem', fontWeight: 600, color: '#555555' }}>
                {date === 'Other' ? 'Other' : formatDate(date + 'T00:00:00')}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                {parts.map((part, i) => (
                  <a
                    key={i}
                    href={part.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="flex items-center space-x-1 px-2 py-1 bg-[#0a0a0a] text-white rounded text-xs hover:bg-[#E8001C] transition-colors"
                  >
                    <PlayCircle size={11} /><span>{part.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ totalUsers: 0, totalBatches: 0, totalClasses: 0, activeClasses: 0, totalTrainers: 0 });
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [batchSearchQuery, setBatchSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [classCreationType, setClassCreationType] = useState("single");

  const [editRecordings, setEditRecordings] = useState([]);
  const [editRecError, setEditRecError] = useState("");

  const [addRecDate, setAddRecDate] = useState("");
  const [addRecBatchId, setAddRecBatchId] = useState("");
  const [addRecClassId, setAddRecClassId] = useState("");
  const [addRecLink, setAddRecLink] = useState("");
  const [addRecError, setAddRecError] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [changePassError, setChangePassError] = useState("");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  });

  useEffect(() => {
    if (!authLoading && user) fetchDashboardData();
  }, [authLoading, user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [batchesRes, classesRes, trainersRes, learnersRes] = await Promise.all([
        fetch(`${API_URL}/batches`, { headers }),
        fetch(`${API_URL}/classes`, { headers }),
        fetch(`${API_URL}/users/trainers`, { headers }),
        fetch(`${API_URL}/users/learners`, { headers })
      ]);
      if (!batchesRes.ok || !classesRes.ok || !trainersRes.ok || !learnersRes.ok) throw new Error('Failed to fetch data');
      const batchesData = await batchesRes.json();
      const classesData = await classesRes.json();
      const trainersData = await trainersRes.json();
      const learnersData = await learnersRes.json();
      setBatches(batchesData || []);
      setClasses(classesData || []);
      setTrainers(trainersData || []);
      setStudents(learnersData || []);
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const activeClasses = (classesData || []).filter(cls => {
        const classDate = new Date(cls.date); classDate.setHours(0, 0, 0, 0);
        return classDate.getTime() === today.getTime() || cls.status === 'ongoing';
      }).length;
      setStats({
        totalUsers: learnersData?.length || 0,
        totalBatches: batchesData?.length || 0,
        totalClasses: classesData?.length || 0,
        activeClasses,
        totalTrainers: trainersData?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  // ── Batch handlers ─────────────────────────────────────────────────────────
  const handleCreateBatch = () => {
    setModalType("batch"); setSelectedItem(null);
    setFormData({ name: "", subject: "", trainer: "", startDate: "", endDate: "" });
    setError(""); setSearchQuery(""); setShowModal(true);
  };
  const handleEditBatch = (batch) => {
    setModalType("batch"); setSelectedItem(batch);
    setFormData({
      name: batch.name || "", subject: batch.subject || "",
      trainer: batch.trainer?._id || "",
      startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : "",
      endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : ""
    });
    setError(""); setSearchQuery(""); setShowModal(true);
  };
  const handleSaveBatch = async () => {
    setSubmitting(true); setError("");
    if (!formData.name || !formData.subject) { setError("Please fill in all required fields"); setSubmitting(false); return; }
    try {
      const headers = getAuthHeaders();
      const response = selectedItem
        ? await fetch(`${API_URL}/batches/${selectedItem._id}`, { method: 'PUT', headers, body: JSON.stringify(formData) })
        : await fetch(`${API_URL}/batches`, { method: 'POST', headers, body: JSON.stringify(formData) });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to save batch'); }
      setShowModal(false); setError("");
      alert(selectedItem ? "Batch updated successfully!" : "Batch created successfully!");
      fetchDashboardData();
    } catch (error) { setError(error.message || "Failed to save batch"); } finally { setSubmitting(false); }
  };
  const handleDeleteBatch = async (batchId) => {
    if (!window.confirm("Are you sure you want to delete this batch?")) return;
    try {
      const response = await fetch(`${API_URL}/batches/${batchId}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to delete batch'); }
      alert("Batch deleted successfully!"); fetchDashboardData();
    } catch (error) { alert(error.message || "Failed to delete batch"); }
  };

  // ── Class handlers ──────────────────────────────────────────────────────────
  const handleCreateClass = () => {
    setModalType("classTypeSelect");
    setClassCreationType("single");
    setSelectedItem(null);
    setFormData({ className: "", batch: "", trainer: "", date: "", startTime: "", endTime: "", teamsLink: "", description: "", status: "scheduled" });
    setError(""); setSearchQuery(""); setShowModal(true);
  };

  const handleProceedClassCreation = () => {
    setModalType("class");
    setError("");
  };

  const handleEditClass = (classItem) => {
    setModalType("class"); setSelectedItem(classItem);
    setClassCreationType(classItem.classType || "single");
    setFormData({
      className: classItem.className || "",
      batch: classItem.batch?._id || "",
      trainer: classItem.trainer?._id || "",
      date: classItem.date ? new Date(classItem.date).toISOString().split('T')[0] : "",
      startTime: classItem.startTime || "", endTime: classItem.endTime || "",
      teamsLink: classItem.teamsLink || "", description: classItem.description || "",
      status: classItem.status || "scheduled"
    });
    setError(""); setSearchQuery(""); setShowModal(true);
  };

  const handleBatchChange = (batchId) => {
    const selectedBatch = batches.find(b => b._id === batchId);
    setFormData(prev => ({
      ...prev, batch: batchId,
      date: classCreationType === "longterm"
        ? (selectedBatch?.startDate ? new Date(selectedBatch.startDate).toISOString().split('T')[0] : "")
        : prev.date,
      startDate: selectedBatch?.startDate ? new Date(selectedBatch.startDate).toISOString().split('T')[0] : "",
      endDate: selectedBatch?.endDate ? new Date(selectedBatch.endDate).toISOString().split('T')[0] : ""
    }));
  };

  const handleSaveClass = async () => {
    setSubmitting(true); setError("");

    const requiredFields = {
      'Class Name': formData.className,
      'Batch': formData.batch,
      'Trainer': formData.trainer,
      'Start Time': formData.startTime,
      'End Time': formData.endTime,
      'MS Teams Link': formData.teamsLink
    };

    if (classCreationType === "single") {
      requiredFields['Date'] = formData.date;
    }

    const missingFields = Object.entries(requiredFields).filter(([_, v]) => !v || v === '').map(([f]) => f);
    if (missingFields.length > 0) { setError(`Please fill in: ${missingFields.join(', ')}`); setSubmitting(false); return; }

    const selectedBatch = batches.find(b => b._id === formData.batch);

    const classDate = classCreationType === "longterm"
      ? selectedBatch?.startDate
      : formData.date;

    if (!classDate) { setError("Could not determine class date. Check batch dates."); setSubmitting(false); return; }

    try {
      const headers = getAuthHeaders();
      const classPayload = {
        ...formData,
        date: classDate,
        classType: classCreationType,
      };
      const response = selectedItem
        ? await fetch(`${API_URL}/classes/${selectedItem._id}`, { method: 'PUT', headers, body: JSON.stringify(classPayload) })
        : await fetch(`${API_URL}/classes`, { method: 'POST', headers, body: JSON.stringify(classPayload) });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to save class'); }
      setShowModal(false); setError("");
      alert(selectedItem ? "Class updated!" : "Class created!"); fetchDashboardData();
    } catch (error) { setError(error.message || "Failed to save class"); } finally { setSubmitting(false); }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      const response = await fetch(`${API_URL}/classes/${classId}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to delete class'); }
      alert("Class deleted successfully!"); fetchDashboardData();
    } catch (error) { alert(error.message || "Failed to delete class"); }
  };

  // ── Edit Recordings modal ──────────────────────────────────────────────────
  const handleOpenEditRecordings = (classItem) => {
    setSelectedItem(classItem);
    const existing = getClassRecordings(classItem);
    setEditRecordings(existing.length > 0 ? existing.map(r => ({ ...r })) : [{ label: 'Part 1', url: '' }]);
    setEditRecError("");
    setModalType("editRecordings");
    setShowModal(true);
  };
  const handleAddRecordingPart = () => {
    setEditRecordings(prev => [...prev, { label: `Part ${prev.length + 1}`, url: '' }]);
  };
  const handleRemoveRecordingPart = (idx) => {
    setEditRecordings(prev => {
      const updated = prev.filter((_, i) => i !== idx).map((r, i) => ({ ...r, label: `Part ${i + 1}` }));
      return updated;
    });
  };
  const handleEditRecordingUrl = (idx, url) => {
    setEditRecordings(prev => prev.map((r, i) => i === idx ? { ...r, url } : r));
  };
  const handleSaveEditRecordings = async () => {
    setSubmitting(true); setEditRecError("");
    if (editRecordings.length > 0 && editRecordings.some(r => r.url.trim() === '')) {
      setEditRecError("Please fill in all recording links or remove empty ones");
      setSubmitting(false); return;
    }
    try {
      const validParts = editRecordings.filter(r => r.url.trim() !== '');
      const payload = {
        className: selectedItem.className,
        batch: selectedItem.batch?._id || selectedItem.batch,
        trainer: selectedItem.trainer?._id || selectedItem.trainer,
        date: selectedItem.date, startTime: selectedItem.startTime,
        endTime: selectedItem.endTime, teamsLink: selectedItem.teamsLink,
        description: selectedItem.description, status: selectedItem.status,
        classType: selectedItem.classType,
        recordings: validParts.map((r, i) => ({ label: `Part ${i + 1}`, url: r.url.trim() })),
        recordingLink: validParts[0]?.url.trim() || '',
      };
      const response = await fetch(`${API_URL}/classes/${selectedItem._id}`, {
        method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(payload),
      });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to save'); }
      setShowModal(false); fetchDashboardData();
    } catch (err) { setEditRecError(err.message || "Failed to save recordings"); } finally { setSubmitting(false); }
  };

  // ── Add Recording by date ──────────────────────────────────────────────────
  const handleOpenAddRecording = () => {
    setAddRecDate(""); setAddRecBatchId(""); setAddRecClassId("");
    setAddRecLink(""); setAddRecError("");
    setModalType("addRecording"); setShowModal(true);
  };
  const addRecFilteredClasses = classes.filter(cls => {
    if (!addRecDate || !addRecBatchId) return false;
    const batchMatches = (cls.batch?._id || cls.batch) === addRecBatchId;
    if (!batchMatches) return false;

    if (cls.classType === "longterm") {
      const batch = batches.find(b => b._id === addRecBatchId);
      if (!batch?.startDate || !batch?.endDate) return true;
      const selected = new Date(addRecDate + 'T00:00:00');
      const batchStart = new Date(batch.startDate); batchStart.setHours(0,0,0,0);
      const batchEnd = new Date(batch.endDate); batchEnd.setHours(23,59,59,999);
      return selected >= batchStart && selected <= batchEnd;
    }

    const clsDate = new Date(cls.date);
    const clsDateStr = `${clsDate.getFullYear()}-${String(clsDate.getMonth() + 1).padStart(2, '0')}-${String(clsDate.getDate()).padStart(2, '0')}`;
    return clsDateStr === addRecDate;
  });
  const handleSaveAddRecording = async () => {
    setSubmitting(true); setAddRecError("");
    if (!addRecDate) { setAddRecError("Please select a date"); setSubmitting(false); return; }
    if (!addRecBatchId) { setAddRecError("Please select a batch"); setSubmitting(false); return; }
    if (!addRecClassId) { setAddRecError("Please select a class"); setSubmitting(false); return; }
    if (!addRecLink.trim()) { setAddRecError("Please paste the Google Drive recording link"); setSubmitting(false); return; }
    const targetClass = classes.find(c => c._id === addRecClassId);
    if (!targetClass) { setAddRecError("Class not found"); setSubmitting(false); return; }

    let updatedRecordings;
    let newPartLabel;
    let dateToUse;

    if (targetClass.classType === "longterm") {
      dateToUse = addRecDate;
      const allExisting = targetClass.recordings || [];
      const datePrefix = addRecDate + " |";
      const sameDayParts = allExisting.filter(r => r.label && r.label.startsWith(datePrefix));
      const nextPartNum = sameDayParts.length + 1;
      newPartLabel = addRecDate + " | Part " + nextPartNum;
      updatedRecordings = [...allExisting, { label: newPartLabel, url: addRecLink.trim() }];
    } else {
      dateToUse = targetClass.date;
      const existingRecordings = getClassRecordings(targetClass);
      newPartLabel = "Part " + (existingRecordings.length + 1);
      updatedRecordings = [
        ...existingRecordings.map((r, i) => ({ label: "Part " + (i + 1), url: r.url })),
        { label: newPartLabel, url: addRecLink.trim() },
      ];
    }

    try {
      const payload = {
        className: targetClass.className,
        batch: targetClass.batch?._id || targetClass.batch,
        trainer: targetClass.trainer?._id || targetClass.trainer,
        date: dateToUse,
        startTime: targetClass.startTime,
        endTime: targetClass.endTime,
        teamsLink: targetClass.teamsLink,
        description: targetClass.description,
        status: targetClass.status,
        classType: targetClass.classType,
        recordings: updatedRecordings,
        recordingLink: updatedRecordings[0]?.url || '',
      };
      const response = await fetch(API_URL + "/classes/" + targetClass._id, {
        method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify(payload),
      });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to save recording'); }
      setShowModal(false);
      alert("Recording added as " + newPartLabel + "!");
      fetchDashboardData();
    } catch (err) { setAddRecError(err.message || "Failed to save recording link"); } finally { setSubmitting(false); }
  };

  // ── Student / assign handlers ───────────────────────────────────────────────
  const handleAssignStudents = (batch) => {
    setModalType("assign"); setSelectedItem(batch);
    setSelectedStudents((batch.students || []).map(s => s._id));
    setError(""); setSearchQuery(""); setShowModal(true);
  };
  const handleAddStudent = (batch) => {
    setModalType("addStudent"); setSelectedItem(batch);
    setFormData({ name: "", email: "", password: "", parentPhone: "" });
    setError(""); setSearchQuery(""); setShowModal(true);
  };
  const handleSaveNewStudent = async () => {
    setSubmitting(true); setError("");
    if (!formData.name || !formData.email || !formData.password) { setError("Please fill in all required fields"); setSubmitting(false); return; }
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST', headers: getAuthHeaders(),
        body: JSON.stringify({ ...formData, role: "learner", batch: selectedItem._id })
      });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to create student'); }
      setShowModal(false); alert("Student created and assigned successfully!"); fetchDashboardData();
    } catch (error) { setError(error.message || "Failed to create student"); } finally { setSubmitting(false); }
  };
  const handleSaveStudentAssignment = async () => {
    setSubmitting(true); setError("");
    try {
      const response = await fetch(`${API_URL}/batches/${selectedItem._id}/sync-students`, {
        method: 'PUT', headers: getAuthHeaders(), body: JSON.stringify({ studentIds: selectedStudents })
      });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to assign students'); }
      setShowModal(false); alert("Students assigned successfully!"); fetchDashboardData();
    } catch (error) { setError(error.message || "Failed to assign students"); } finally { setSubmitting(false); }
  };
  const toggleStudentSelection = (studentId) => {
    setSelectedStudents(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
  };

  // ── Delete student ──────────────────────────────────────────────────────────
  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to delete student "${studentName}"? This action cannot be undone.`)) return;
    try {
      const response = await fetch(`${API_URL}/users/${studentId}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to delete student'); }
      alert("Student deleted successfully!"); fetchDashboardData();
    } catch (error) { alert(error.message || "Failed to delete student"); }
  };

  // ── Change student password ─────────────────────────────────────────────────
  const handleOpenChangePassword = (student) => {
    setSelectedItem(student);
    setNewPassword("");
    setShowNewPassword(false);
    setChangePassError("");
    setModalType("changePassword");
    setShowModal(true);
  };
  const handleSaveChangePassword = async () => {
    setSubmitting(true); setChangePassError("");
    if (!newPassword || newPassword.length < 6) {
      setChangePassError("Password must be at least 6 characters"); setSubmitting(false); return;
    }
    try {
      const response = await fetch(`${API_URL}/users/${selectedItem._id}/change-password`, {
        method: 'PUT', headers: getAuthHeaders(),
        body: JSON.stringify({ newPassword })
      });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to update password'); }
      setShowModal(false);
      alert(`Password updated for ${selectedItem.name}!`);
    } catch (error) { setChangePassError(error.message || "Failed to update password"); } finally { setSubmitting(false); }
  };

  // ── Send absent alert via WhatsApp ──────────────────────────────────────────
  const handleSendAbsentMessage = (student, batch) => {
  if (!student.parentPhone) {
    alert(`No parent phone number saved for ${student.name}. Add one by editing this student.`);
    return;
  }
  let phone = student.parentPhone.replace(/\D/g, '');
  if (phone.length === 10) phone = '91' + phone; // default India country code

  const today = new Date().toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  const message =
`Dear Parent,

This is to inform you that *${student.name}* was absent from the *${batch?.name || 'class'}* class today (${today}).

Please ensure regular attendance.

Regards,
Cinematics Creative Academy`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

  // ── Trainer handlers ────────────────────────────────────────────────────────
  const handleCreateTrainer = () => {
    setModalType("trainer"); setSelectedItem(null);
    setFormData({ name: "", email: "", password: "", subject: "", phone: "" });
    setError(""); setShowPassword(false); setShowModal(true);
  };
  const handleEditTrainer = (trainer) => {
    setModalType("editTrainer"); setSelectedItem(trainer);
    setFormData({ name: trainer.name || "", email: trainer.email || "", subject: trainer.subject || "", phone: trainer.phone || "" });
    setError(""); setShowModal(true);
  };
  const handleSaveTrainer = async () => {
    setSubmitting(true); setError("");
    if (!formData.name || !formData.email) { setError("Name and email are required"); setSubmitting(false); return; }
    if (!formData.password) { setError("Password is required for new trainers"); setSubmitting(false); return; }
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST', headers: getAuthHeaders(),
        body: JSON.stringify({ ...formData, role: "trainer" })
      });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to create trainer'); }
      setShowModal(false); alert("Trainer created successfully!"); fetchDashboardData();
    } catch (error) { setError(error.message || "Failed to create trainer"); } finally { setSubmitting(false); }
  };
  const handleUpdateTrainer = async () => {
    setSubmitting(true); setError("");
    if (!formData.name || !formData.email) { setError("Name and email are required"); setSubmitting(false); return; }
    try {
      const response = await fetch(`${API_URL}/users/${selectedItem._id}`, {
        method: 'PUT', headers: getAuthHeaders(),
        body: JSON.stringify({ name: formData.name, email: formData.email, subject: formData.subject, phone: formData.phone })
      });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to update trainer'); }
      setShowModal(false); alert("Trainer updated successfully!"); fetchDashboardData();
    } catch (error) { setError(error.message || "Failed to update trainer"); } finally { setSubmitting(false); }
  };
  const handleDeleteTrainer = async (trainerId) => {
    if (!window.confirm("Are you sure you want to delete this trainer?")) return;
    try {
      const response = await fetch(`${API_URL}/users/${trainerId}`, { method: 'DELETE', headers: getAuthHeaders() });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || 'Failed to delete trainer'); }
      alert("Trainer deleted successfully!"); fetchDashboardData();
    } catch (error) { alert(error.message || "Failed to delete trainer"); }
  };

  const filteredStudents = students.filter(s => {
    const q = searchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q);
  });
  const filteredTrainers = trainers.filter(t => {
    const q = searchQuery.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || (t.subject && t.subject.toLowerCase().includes(q));
  });
  const filteredBatchesForStudents = batches.filter(b => {
  const q = batchSearchQuery.toLowerCase();
  return b.name.toLowerCase().includes(q) || (b.subject || "").toLowerCase().includes(q);
});

  const allRecordingClasses = classes.filter(cls => hasAnyRecording(cls)).sort((a, b) => new Date(b.date) - new Date(a.date));
  const totalRecordingParts = allRecordingClasses.reduce((sum, cls) => sum + getClassRecordings(cls).length, 0);
  const recordingsByTrainer = trainers.map(trainer => ({
    trainer,
    recordings: allRecordingClasses.filter(cls => cls.trainer && cls.trainer._id === trainer._id)
  })).filter(group => group.recordings.length > 0);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const tabs = ["overview", "batches", "classes", "trainers", "students", "recordings"];

  const statsCards = [
    { label: "Total Students", value: stats.totalUsers, icon: Users },
    { label: "Total Trainers", value: stats.totalTrainers, icon: GraduationCap },
    { label: "Total Batches", value: stats.totalBatches, icon: BookOpen },
    { label: "Total Classes", value: stats.totalClasses, icon: Video },
  ];

  if (loading && batches.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center">
        <style>{globalStyles}</style>
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-[#E8001C] mx-auto mb-4" />
          <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-[#0a0a0a]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <style>{globalStyles}</style>

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div className="bg-white shadow-sm border-b-2 border-[#e5e7eb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6 min-w-0">
              <img src="/CCALogo.png" alt="Logo" className="h-9 sm:h-12 w-auto flex-shrink-0" />
              <div className="hidden sm:block h-8 w-px bg-[#e5e7eb]"></div>
              <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }} className="hidden sm:block text-lg sm:text-2xl text-[#0a0a0a] truncate">Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div style={{ fontFamily: 'Poppins, sans-serif' }} className="hidden md:block text-sm text-[#555555]">
                Welcome, <span className="font-semibold" style={{color:'#E8001C'}}>{user?.name || "Admin"}</span>
              </div>
              <div className="relative">
                <button onClick={() => setShowSettingsDropdown(!showSettingsDropdown)} className="ad-settings-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                </button>
                {showSettingsDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border-2 border-[#e8e8e8] z-50">
                    <div className="px-4 py-2 border-b border-[#e8e8e8] md:hidden">
                      <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555]">Signed in as</p>
                      <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] truncate">{user?.name || "Admin"}</p>
                    </div>
                    <button onClick={handleLogout} style={{ fontFamily: 'Poppins, sans-serif' }} className="w-full flex items-center space-x-2 px-4 py-3 text-left text-[#0a0a0a] hover:bg-[#fff0f0] hover:text-[#E8001C] rounded-lg transition-colors">
                      <LogOut size={18} /><span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="sm:hidden p-2 hover:bg-[#f5f5f5] border border-[#e5e7eb] rounded-lg transition-colors">
                <Menu size={20} className="text-[#0a0a0a]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSettingsDropdown && <div className="fixed inset-0 z-40" onClick={() => setShowSettingsDropdown(false)} />}

      {/* ── Mobile Tab Drawer ─────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b-2 border-[#e8e8e8] shadow-md z-30">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => { setActiveTab(tab); setMobileMenuOpen(false); }}
              style={{ fontFamily: 'Poppins, sans-serif' }}
              className={`w-full flex items-center justify-between px-6 py-3 text-sm font-medium border-b border-[#f0f0f0] last:border-0 ${activeTab === tab ? "text-[#E8001C] bg-[#fff0f0]" : "text-[#555555]"}`}>
              <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
              {tab === "recordings" && totalRecordingParts > 0 && (
                <span className="px-2 py-0.5 bg-[#E8001C] text-white text-xs rounded-full">{totalRecordingParts}</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── Desktop Tab Bar ───────────────────────────────────────────────────── */}
      <div className="hidden sm:block bg-white border-b-2 border-[#e8e8e8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`ad-tab${activeTab === tab ? " active" : ""}`}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === "recordings" && totalRecordingParts > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-[#E8001C] text-white text-xs rounded-full">{totalRecordingParts}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Active tab label on mobile ─────────────────────────────────────────── */}
      <div className="sm:hidden bg-white border-b border-[#e8e8e8] px-4 py-2 flex items-center justify-between">
        <span style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
        <button onClick={() => setMobileMenuOpen(true)} style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#E8001C] font-medium flex items-center space-x-1">
          <span>Change</span><ChevronDown size={14} />
        </button>
      </div>

      {/* ── Main Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {statsCards.map((stat, idx) => (
                <div key={idx} className="stat-card bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-[#e8e8e8]">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-[#555555] text-xs sm:text-sm truncate">{stat.label}</p>
                      <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }} className="stat-num text-2xl sm:text-3xl text-[#0a0a0a] mt-1 sm:mt-2">{stat.value}</p>
                    </div>
                    <div className="stat-icon bg-[#fff0f0] w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                      <stat.icon style={{stroke:'#E8001C'}} size={20} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-[#e8e8e8]">
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-base sm:text-lg text-[#0a0a0a] mb-4">Today's Classes</h3>
                <div className="space-y-3">
                  {(() => {
                    const today = new Date(); today.setHours(0, 0, 0, 0);
                    const todayClasses = classes.filter(cls => { const d = new Date(cls.date); d.setHours(0, 0, 0, 0); return d.getTime() === today.getTime(); });
                    if (todayClasses.length === 0) return <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] text-center py-4">No classes scheduled for today</p>;
                    return todayClasses.slice(0, 3).map((cls) => {
                      const auto = getAutoStatus(cls);
                      return (
                        <div key={cls._id} className="flex items-center justify-between p-3 bg-[#f5f5f5] rounded-lg border border-[#e8e8e8]">
                          <div className="min-w-0 flex-1 mr-2">
                            <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] truncate">{cls.className}</p>
                            <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] truncate">{cls.batch?.name || 'N/A'} • {cls.startTime} - {cls.endTime}</p>
                          </div>
                          <span style={{ fontFamily: 'Poppins, sans-serif' }} className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusColor(auto)}`}>{auto}</span>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-[#e8e8e8]">
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-base sm:text-lg text-[#0a0a0a] mb-4">Active Batches</h3>
                <div className="space-y-3">
                  {batches.slice(0, 3).map((batch) => (
                    <div key={batch._id} className="flex items-center justify-between p-3 bg-[#f5f5f5] rounded-lg border border-[#e8e8e8]">
                      <div className="min-w-0 flex-1 mr-2">
                        <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] truncate">{batch.name}</p>
                        <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] truncate">{batch.subject} • {batch.students?.length || 0} students</p>
                      </div>
                      <button onClick={() => handleAssignStudents(batch)} style={{ fontFamily: 'Poppins, sans-serif' }} className="text-[#E8001C] hover:underline text-sm font-medium flex-shrink-0">Manage</button>
                    </div>
                  ))}
                  {batches.length === 0 && <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] text-center py-4">No batches created</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Batches Tab */}
        {activeTab === "batches" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Manage Batches</h3>
              <button onClick={handleCreateBatch} style={{ fontFamily: 'Poppins, sans-serif' }} className="ad-btn w-full sm:w-auto">
                <Plus size={20} /><span>Create Batch</span>
              </button>
            </div>
            <div className="grid gap-4">
              {batches.map((batch) => (
                <div key={batch._id} className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-[#e8e8e8]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-base sm:text-lg text-[#0a0a0a]">{batch.name}</h4>
                      <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] mt-1">{batch.subject}</p>
                      <div style={{ fontFamily: 'Poppins, sans-serif' }} className="flex flex-wrap items-center gap-2 mt-3 text-xs sm:text-sm text-[#555555]">
                        <span>{formatDate(batch.startDate)} – {formatDate(batch.endDate)}</span>
                        <span>•</span>
                        <span>{batch.students?.length || 0} students</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button onClick={() => handleAssignStudents(batch)} className="ad-icon-btn" title="Assign Students"><UserCheck size={18} /></button>
                      <button onClick={() => handleEditBatch(batch)} className="ad-icon-btn" title="Edit Batch"><Edit2 size={18} /></button>
                      <button onClick={() => handleDeleteBatch(batch._id)} className="ad-icon-btn ad-icon-delete" title="Delete Batch"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              ))}
              {batches.length === 0 && (
                <div className="bg-white rounded-xl p-12 text-center border-2 border-[#e8e8e8]">
                  <BookOpen className="mx-auto h-12 w-12 text-[#555555] mb-4" />
                  <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-[#555555]">No batches created yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Classes Tab */}
        {activeTab === "classes" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Manage Classes</h3>
              <button onClick={handleCreateClass} style={{ fontFamily: 'Poppins, sans-serif' }} className="ad-btn w-full sm:w-auto">
                <Plus size={20} /><span>Create Class</span>
              </button>
            </div>

            {/* Mobile: Card View */}
            <div className="block lg:hidden space-y-3">
              {classes.map((cls) => {
                const auto = getAutoStatus(cls);
                return (
                  <div key={cls._id} className="bg-white rounded-xl p-4 shadow-md border-2 border-[#e8e8e8]">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1 mr-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">{cls.className}</p>
                          {cls.classType === "longterm" && (
                            <span style={{ fontFamily: 'Poppins, sans-serif' }} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">Long-Term</span>
                          )}
                        </div>
                        <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] mt-0.5">{cls.batch?.name || 'N/A'} • {cls.trainer?.name || 'N/A'}</p>
                      </div>
                      <span style={{ fontFamily: 'Poppins, sans-serif' }} className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusColor(auto)}`}>{auto}</span>
                    </div>
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555]">
                      {cls.classType === "longterm" ? `Batch period • ` : `${new Date(cls.date).toLocaleDateString()} • `}
                      {cls.startTime} – {cls.endTime}
                    </p>
                    <div className="flex items-center space-x-2 mt-3">
                      <a href={cls.teamsLink} target="_blank" rel="noopener noreferrer" className="ad-icon-btn"><ExternalLink size={16} /></a>
                      <button onClick={() => handleEditClass(cls)} className="ad-icon-btn"><Edit2 size={16} /></button>
                      <button onClick={() => handleDeleteClass(cls._id)} className="ad-icon-btn ad-icon-delete"><Trash2 size={16} /></button>
                    </div>
                  </div>
                );
              })}
              {classes.length === 0 && (
                <div className="bg-white rounded-xl p-12 text-center border-2 border-[#e8e8e8]">
                  <Video className="mx-auto h-12 w-12 text-[#555555] mb-4" />
                  <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-[#555555]">No classes scheduled</p>
                </div>
              )}
            </div>

            {/* Desktop: Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-md border-2 border-[#e8e8e8] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0a0a0a]">
                    <tr>
                      {["Class Name", "Type", "Batch", "Trainer", "Date & Time", "Status", "Actions"].map(h => (
                        <th key={h} style={{ fontFamily: 'Poppins, sans-serif' }} className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[#e8e8e8]">
                    {classes.map((cls) => {
                      const auto = getAutoStatus(cls);
                      return (
                        <tr key={cls._id} className="hover:bg-[#f5f5f5]">
                          <td className="px-6 py-4"><div style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">{cls.className}</div></td>
                          <td className="px-6 py-4">
                            <span style={{ fontFamily: 'Poppins, sans-serif' }} className={`px-2 py-1 rounded-full text-xs font-medium ${cls.classType === 'longterm' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                              {cls.classType === 'longterm' ? 'Long-Term' : 'Single'}
                            </span>
                          </td>
                          <td style={{ fontFamily: 'Poppins, sans-serif' }} className="px-6 py-4 text-sm text-[#555555]">{cls.batch?.name || 'N/A'}</td>
                          <td style={{ fontFamily: 'Poppins, sans-serif' }} className="px-6 py-4 text-sm text-[#555555]">{cls.trainer?.name || 'N/A'}</td>
                          <td className="px-6 py-4">
                            {cls.classType === "longterm" ? (
                              <div style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#0a0a0a]">Batch period</div>
                            ) : (
                              <div style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#0a0a0a]">{new Date(cls.date).toLocaleDateString()}</div>
                            )}
                            <div style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555]">{cls.startTime} - {cls.endTime}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span style={{ fontFamily: 'Poppins, sans-serif' }} className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(auto)}`}>{auto}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <a href={cls.teamsLink} target="_blank" rel="noopener noreferrer" className="ad-icon-btn"><ExternalLink size={18} /></a>
                              <button onClick={() => handleEditClass(cls)} className="ad-icon-btn"><Edit2 size={18} /></button>
                              <button onClick={() => handleDeleteClass(cls._id)} className="ad-icon-btn ad-icon-delete"><Trash2 size={18} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {classes.length === 0 && (
                  <div className="text-center py-12"><Video className="mx-auto h-12 w-12 text-[#555555] mb-4" /><p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-[#555555]">No classes scheduled</p></div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Trainers Tab */}
        {activeTab === "trainers" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Manage Trainers</h3>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555555]" size={18} />
                  <input type="text" placeholder="Search trainers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full sm:w-auto pl-10 pr-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white text-sm focus:border-[#E8001C] focus:outline-none" />
                </div>
                <button onClick={handleCreateTrainer} style={{ fontFamily: 'Poppins, sans-serif' }} className="ad-btn">
                  <Plus size={20} /><span>Add Trainer</span>
                </button>
              </div>
            </div>
            <div className="grid gap-4">
              {filteredTrainers.length > 0 ? filteredTrainers.map((trainer) => (
                <div key={trainer._id} className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-[#e8e8e8]">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-[#0a0a0a] to-[#2a2a2a] flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="text-white" size={20} />
                      </div>
                      <div className="min-w-0">
                        <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-base sm:text-lg text-[#0a0a0a] truncate">{trainer.name}</h4>
                        <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] truncate">{trainer.email}</p>
                        <div style={{ fontFamily: 'Poppins, sans-serif' }} className="flex flex-wrap gap-2 mt-1 text-xs sm:text-sm text-[#555555]">
                          {trainer.subject && <span>Subject: {trainer.subject}</span>}
                          {trainer.phone && <span>Phone: {trainer.phone}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <button onClick={() => handleEditTrainer(trainer)} className="ad-icon-btn"><Edit2 size={18} /></button>
                      <button onClick={() => handleDeleteTrainer(trainer._id)} className="ad-icon-btn ad-icon-delete"><Trash2 size={18} /></button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="bg-white rounded-xl p-12 text-center border-2 border-[#e8e8e8]">
                  <GraduationCap className="mx-auto h-12 w-12 text-[#555555] mb-4" />
                  <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-[#555555]">{searchQuery ? "No trainers match your search" : "No trainers added yet"}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Students Tab */}
              {activeTab === "students" && (
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Student Management</h3>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555555]" size={18} />
              <input
                type="text"
                placeholder="Search batches..."
                value={batchSearchQuery}
                onChange={(e) => setBatchSearchQuery(e.target.value)}
                style={{ fontFamily: 'Poppins, sans-serif' }}
                className="ad-input w-full pl-10 pr-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white text-sm"
              />
            </div>
          </div>
          {filteredBatchesForStudents.map((batch) => (
              <div key={batch._id} className="bg-white rounded-xl p-4 sm:p-6 shadow-md border-2 border-[#e8e8e8]">
                <div className="flex flex-col gap-3 mb-4">
                  <div>
                    <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-base sm:text-lg text-[#0a0a0a]">{batch.name}</h4>
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs sm:text-sm text-[#555555]">{batch.subject} • {formatDate(batch.startDate)} – {formatDate(batch.endDate)}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555555]" size={16} />
                      <input type="text" placeholder="Search students..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        className="w-full pl-9 pr-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white text-sm focus:border-[#E8001C] focus:outline-none" />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAddStudent(batch)} style={{ fontFamily: 'Poppins, sans-serif' }} className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-3 py-2 bg-white text-[#0a0a0a] rounded-lg hover:bg-[#f5f5f5] border-2 border-[#e8e8e8] text-sm">
                        <UserPlus size={16} /><span>Add</span>
                      </button>
                      <button onClick={() => handleAssignStudents(batch)} style={{ fontFamily: 'Poppins, sans-serif' }} className="ad-btn flex-1 sm:flex-none text-sm">
                        <UserCheck size={16} /><span>Assign</span>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">Enrolled Students ({batch.students?.length || 0})</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {batch.students?.length > 0 ?
                      (searchQuery ? batch.students.filter(s => { const q = searchQuery.toLowerCase(); return s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q); }) : batch.students)
                        .map((student) => (
                          <div key={student._id} className="flex items-center justify-between p-3 bg-[#f5f5f5] rounded-lg border border-[#e8e8e8]">
                            <div className="min-w-0 flex-1 mr-2">
                              <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] truncate">{student.name}</p>
                              <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] truncate">{student.email}</p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <button
                              onClick={() => handleSendAbsentMessage(student, batch)}
                              className="ad-icon-btn ad-icon-whatsapp"
                              title="Send Absent Alert"
                            >
                              <MessageCircle size={15} />
                            </button>
                              <button
                                onClick={() => handleOpenChangePassword(student)}
                                className="ad-icon-btn ad-icon-key"
                                title="Change Password"
                              >
                                <KeyRound size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteStudent(student._id, student.name)}
                                className="ad-icon-btn ad-icon-delete"
                                title="Delete Student"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>
                        ))
                      : <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] col-span-2 text-center py-4">No students assigned yet</p>}
                  </div>
                </div>
              </div>
            ))}
           {filteredBatchesForStudents.length === 0 && (
              <div className="bg-white rounded-xl p-12 text-center border-2 border-[#e8e8e8]">
                <Users className="mx-auto h-12 w-12 text-[#555555] mb-4" />
                <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-[#555555]">
                  {batchSearchQuery ? "No batches match your search" : "No batches available"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Recordings Tab */}
        {activeTab === "recordings" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">All Recordings</h3>
                <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs sm:text-sm text-[#555555] mt-1">
                  {totalRecordingParts} recording part{totalRecordingParts !== 1 ? 's' : ''} across {allRecordingClasses.length} class{allRecordingClasses.length !== 1 ? 'es' : ''}
                </p>
              </div>
              <button onClick={handleOpenAddRecording} style={{ fontFamily: 'Poppins, sans-serif' }} className="ad-btn w-full sm:w-auto">
                <Plus size={20} /><span>Add Recording</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: "Total Recording Parts", value: totalRecordingParts },
                { label: "Trainers with Recordings", value: recordingsByTrainer.length },
                { label: "Classes Without Recording", value: classes.length - allRecordingClasses.length }
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-3 sm:p-5 border-2 border-[#e8e8e8] shadow-md">
                  <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs sm:text-sm text-[#555555] leading-tight">{s.label}</p>
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 800 }} className="text-2xl sm:text-3xl text-[#0a0a0a] mt-1">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Mobile: Card View */}
            <div className="block lg:hidden space-y-3">
              <div className="px-1">
                <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-base text-[#0a0a0a] mb-3">All Recordings - Newest First</h4>
              </div>
              {allRecordingClasses.map((cls) => {
                const auto = getAutoStatus(cls);
                const isLongterm = cls.classType === "longterm";
                const dateGroups = isLongterm ? getLongtermRecordingsByDate(cls) : null;
                const singleParts = isLongterm ? null : getClassRecordings(cls);
                return (
                  <div key={cls._id} className="bg-white rounded-xl p-4 shadow-md border-2 border-[#e8e8e8]">
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0 flex-1 mr-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">{cls.className}</p>
                          {isLongterm && <span style={{ fontFamily: 'Poppins, sans-serif', }} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Long-Term</span>}
                        </div>
                        <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] mt-0.5">{cls.trainer?.name || 'N/A'} • {cls.batch?.name || 'N/A'}</p>
                        {!isLongterm && <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555]">{formatDate(cls.date)} • {cls.startTime}–{cls.endTime}</p>}
                      </div>
                      <span style={{ fontFamily: 'Poppins, sans-serif' }} className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusColor(auto)}`}>{auto}</span>
                    </div>

                    {/* MOBILE: Accordion for longterm, pills for single */}
                    <div className="mb-3">
                      {isLongterm ? (
                        <LongtermRecordingsAccordion dateGroups={dateGroups} formatDate={formatDate} />
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {singleParts.map((part, i) => (
                            <a key={i} href={part.url} target="_blank" rel="noopener noreferrer"
                              style={{ fontFamily: 'Poppins, sans-serif' }}
                              className="flex items-center space-x-1 px-2 py-1 bg-[#0a0a0a] text-white rounded text-xs hover:bg-[#E8001C] transition-colors">
                              <PlayCircle size={12} /><span>{part.label}</span>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <button onClick={() => handleOpenEditRecordings(cls)}
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                        className="flex items-center space-x-1 px-3 py-1.5 border-2 border-[#e8e8e8] text-[#0a0a0a] rounded-lg text-xs hover:bg-[#f5f5f5]">
                        <Edit2 size={14} /><span>Edit Parts</span>
                      </button>
                      <a href={cls.teamsLink} target="_blank" rel="noopener noreferrer" className="ad-icon-btn">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </div>
                );
              })}
              {allRecordingClasses.length === 0 && (
                <div className="bg-white rounded-xl p-12 text-center border-2 border-[#e8e8e8]">
                  <PlayCircle className="mx-auto h-12 w-12 text-[#555555] mb-4" />
                  <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-[#555555]">No recordings uploaded yet</p>
                </div>
              )}
            </div>

            {/* Desktop: Table View */}
            <div className="hidden lg:block bg-white rounded-xl shadow-md border-2 border-[#e8e8e8] overflow-hidden">
              <div className="px-6 py-4 border-b-2 border-[#e8e8e8] bg-[#f5f5f5]">
                <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-base text-[#0a0a0a]">All Recordings — Newest First</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0a0a0a]">
                    <tr>
                      {["Class Name", "Trainer", "Batch", "Date & Time", "Status", "Parts", "Actions"].map(h => (
                        <th key={h} style={{ fontFamily: 'Poppins, sans-serif' }} className="px-6 py-3 text-left text-xs font-semibold text-white uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-[#e8e8e8]">
                    {allRecordingClasses.map((cls) => {
                      const auto = getAutoStatus(cls);
                      const isLongterm = cls.classType === "longterm";
                      const dateGroups = isLongterm ? getLongtermRecordingsByDate(cls) : null;
                      const singleParts = isLongterm ? null : getClassRecordings(cls);
                      return (
                        <tr key={cls._id} className="hover:bg-[#f5f5f5]">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">{cls.className}</div>
                              {isLongterm && <span style={{ fontFamily: 'Poppins, sans-serif' }} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Long-Term</span>}
                            </div>
                            {cls.description && <div style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] mt-0.5">{cls.description}</div>}
                          </td>
                          <td style={{ fontFamily: 'Poppins, sans-serif' }} className="px-6 py-4 text-sm text-[#555555]">{cls.trainer?.name || 'N/A'}</td>
                          <td style={{ fontFamily: 'Poppins, sans-serif' }} className="px-6 py-4 text-sm text-[#555555]">{cls.batch?.name || 'N/A'}</td>
                          <td className="px-6 py-4">
                            {isLongterm ? (
                              <div style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555]">Batch period • {cls.startTime}–{cls.endTime}</div>
                            ) : (
                              <>
                                <div style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#0a0a0a]">{formatDate(cls.date)}</div>
                                <div style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555]">{cls.startTime} - {cls.endTime}</div>
                              </>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span style={{ fontFamily: 'Poppins, sans-serif' }} className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(auto)}`}>{auto}</span>
                          </td>
                          {/* DESKTOP: Accordion for longterm, pills for single */}
                          <td className="px-6 py-4" style={{ minWidth: '180px', maxWidth: '260px' }}>
                            {isLongterm ? (
                              <LongtermRecordingsAccordion dateGroups={dateGroups} formatDate={formatDate} />
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {singleParts.map((part, i) => (
                                  <a key={i} href={part.url} target="_blank" rel="noopener noreferrer"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                    className="flex items-center space-x-1 px-2 py-1 bg-[#0a0a0a] text-white rounded text-xs hover:bg-[#E8001C] transition-colors">
                                    <PlayCircle size={12} /><span>{part.label}</span>
                                  </a>
                                ))}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <button onClick={() => handleOpenEditRecordings(cls)}
                                style={{ fontFamily: 'Poppins, sans-serif' }}
                                className="flex items-center space-x-1 px-3 py-1.5 border-2 border-[#e8e8e8] text-[#0a0a0a] rounded-lg text-xs hover:bg-[#f5f5f5]">
                                <Edit2 size={14} /><span>Edit Parts</span>
                              </button>
                              <a href={cls.teamsLink} target="_blank" rel="noopener noreferrer" className="ad-icon-btn">
                                <ExternalLink size={16} />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {allRecordingClasses.length === 0 && (
                  <div className="text-center py-12">
                    <PlayCircle className="mx-auto h-12 w-12 text-[#555555] mb-4" />
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-[#555555]">No recordings uploaded yet</p>
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] mt-1">Click "Add Recording" above to upload a recording link.</p>
                  </div>
                )}
              </div>
            </div>

            {recordingsByTrainer.length > 0 && (
              <div className="space-y-4">
                <h4 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-base sm:text-lg text-[#0a0a0a]">Recordings by Trainer</h4>
                {recordingsByTrainer.map(({ trainer, recordings }) => (
                  <div key={trainer._id} className="bg-white rounded-xl border-2 border-[#e8e8e8] shadow-md overflow-hidden">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-[#f5f5f5] border-b-2 border-[#e8e8e8]">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="text-white" size={16} />
                        </div>
                        <div className="min-w-0">
                          <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] truncate">{trainer.name}</p>
                          <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] truncate">{trainer.email}</p>
                        </div>
                      </div>
                      <span style={{ fontFamily: 'Poppins, sans-serif' }} className="px-2 sm:px-3 py-1 bg-[#0a0a0a] text-white text-xs rounded-full flex-shrink-0 ml-2">
                        {recordings.reduce((sum, cls) => sum + getClassRecordings(cls).length, 0)} part{recordings.reduce((sum, cls) => sum + getClassRecordings(cls).length, 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="divide-y divide-[#e8e8e8]">
                      {recordings.map((cls) => {
                        const auto = getAutoStatus(cls);
                        const isLongterm = cls.classType === "longterm";
                        const dateGroups = isLongterm ? getLongtermRecordingsByDate(cls) : null;
                        const singleParts = isLongterm ? null : getClassRecordings(cls);
                        return (
                          <div key={cls._id} className="px-4 sm:px-6 py-4 hover:bg-[#f5f5f5]">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex items-start space-x-3 min-w-0 flex-1">
                                <PlayCircle size={16} className="text-[#E8001C] flex-shrink-0 mt-0.5" />
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] truncate">{cls.className}</p>
                                    {isLongterm && <span style={{ fontFamily: 'Poppins, sans-serif' }} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Long-Term</span>}
                                  </div>
                                  <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555]">{cls.batch?.name || 'N/A'} • {isLongterm ? "batch period" : formatDate(cls.date)} • {cls.startTime}–{cls.endTime}</p>
                                  {/* TRAINER SECTION: Accordion for longterm */}
                                  {isLongterm && (
                                    <div className="mt-2" style={{ maxWidth: '320px' }}>
                                      <LongtermRecordingsAccordion dateGroups={dateGroups} formatDate={formatDate} />
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 flex-shrink-0">
                                <span style={{ fontFamily: 'Poppins, sans-serif' }} className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(auto)}`}>{auto}</span>
                                {!isLongterm && singleParts.map((part, i) => (
                                  <a key={i} href={part.url} target="_blank" rel="noopener noreferrer"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                    className="flex items-center space-x-1 px-2 py-1.5 bg-[#0a0a0a] text-white rounded-lg text-xs hover:bg-[#E8001C] transition-colors">
                                    <PlayCircle size={12} /><span>{part.label}</span>
                                  </a>
                                ))}
                                <button onClick={() => handleOpenEditRecordings(cls)} className="ad-icon-btn">
                                  <Edit2 size={14} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
          ══════════════════════════════════════════════════════════════════════ */}

      {/* ── Class Type Selection Modal ──────────────────────────────────────── */}
      {showModal && modalType === "classTypeSelect" && (
        <div className="fixed inset-0 bg-[#0a0a0a] bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-lg border-2 border-[#e8e8e8] max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Choose Class Type</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#f5f5f5] rounded-lg"><X size={20} /></button>
            </div>
            <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] mb-5">Select the type of class you want to create.</p>
            <div className="space-y-3 mb-6">
              <div onClick={() => setClassCreationType("longterm")} className={`class-type-card ${classCreationType === "longterm" ? "selected" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${classCreationType === "longterm" ? "border-[#E8001C] bg-[#E8001C]" : "border-[#e8e8e8]"}`}>
                    {classCreationType === "longterm" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">Long-Term Class (Batch Duration)</p>
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] mt-1">
                      A recurring class that runs for the entire batch period. Daily recordings are added separately via "Add Recording".
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span style={{ fontFamily: 'Poppins, sans-serif' }} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">2D Animation</span>
                      <span style={{ fontFamily: 'Poppins, sans-serif' }} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">VFX Course</span>
                      <span style={{ fontFamily: 'Poppins, sans-serif' }} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">Regular Batch</span>
                    </div>
                  </div>
                </div>
              </div>
              <div onClick={() => setClassCreationType("single")} className={`class-type-card ${classCreationType === "single" ? "selected" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${classCreationType === "single" ? "border-[#E8001C] bg-[#E8001C]" : "border-[#e8e8e8]"}`}>
                    {classCreationType === "single" && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <div>
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">Single / Extra Lecture</p>
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] mt-1">
                      A one-off class on a specific date. Use for extra lectures, makeup classes, workshops, or guest sessions.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span style={{ fontFamily: 'Poppins, sans-serif' }} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Extra Lecture</span>
                      <span style={{ fontFamily: 'Poppins, sans-serif' }} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Workshop</span>
                      <span style={{ fontFamily: 'Poppins, sans-serif' }} className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Guest Session</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2 border-t-2 border-[#e8e8e8]">
              <button onClick={() => setShowModal(false)} style={{ fontFamily: 'Poppins, sans-serif' }} className="px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] hover:bg-[#f5f5f5] order-2 sm:order-1">Cancel</button>
              <button onClick={handleProceedClassCreation} style={{ fontFamily: 'Poppins, sans-serif' }} className="ad-btn order-1 sm:order-2">Continue →</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Class Creation / Edit Modal ─────────────────────────────────────── */}
      {showModal && modalType === "class" && (
        <div className="fixed inset-0 bg-[#0a0a0a] bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-2xl border-2 border-[#e8e8e8] max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">
                  {selectedItem ? "Edit Class" : classCreationType === "longterm" ? "Create Long-Term Class" : "Create Single / Extra Lecture"}
                </h3>
                {!selectedItem && (
                  <span style={{ fontFamily: 'Poppins, sans-serif' }} className={`text-xs px-2 py-0.5 rounded-full font-medium ${classCreationType === "longterm" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}`}>
                    {classCreationType === "longterm" ? "Long-Term (Batch Duration)" : "Single / Extra Lecture"}
                  </span>
                )}
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#f5f5f5] rounded-lg"><X size={20} /></button>
            </div>
            {!selectedItem && classCreationType === "longterm" && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-blue-700">
                  This class will span the entire batch period. Recordings are added daily via the "Add Recording" button on the Recordings tab.
                </p>
              </div>
            )}
            {error && <div style={{ fontFamily: 'Poppins, sans-serif' }} className="mb-4 p-3 bg-[#E8001C] text-white rounded-lg text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Class Name *</label>
                <input type="text" value={formData.className || ""} onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none"
                  placeholder={classCreationType === "longterm" ? "e.g., B-154 2D Animation" : "e.g., Extra Lecture – Rigging Basics"} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Batch *</label>
                  <select value={formData.batch || ""} onChange={(e) => handleBatchChange(e.target.value)}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg bg-white text-[#0a0a0a] focus:border-[#E8001C] focus:outline-none">
                    <option value="">Select Batch</option>
                    {batches.map(b => <option key={b._id} value={b._id}>{b.name}{b.startDate ? ` (${new Date(b.startDate).toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'})} – ${new Date(b.endDate).toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'})})` : ''}</option>)}
                  </select>
                  {classCreationType === "longterm" && formData.startDate && (
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-blue-600 mt-1">
                      Class period: {formatDate(formData.startDate)} – {formatDate(formData.endDate)}
                    </p>
                  )}
                </div>
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Trainer *</label>
                  <select value={formData.trainer || ""} onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg bg-white text-[#0a0a0a] focus:border-[#E8001C] focus:outline-none">
                    <option value="">Select Trainer</option>
                    {trainers.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
                  </select>
                </div>
              </div>
              {(classCreationType === "single" || selectedItem) && (
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">
                    {classCreationType === "longterm" ? "Class Date (for display)" : "Date *"}
                  </label>
                  <input type="date" value={formData.date || ""} onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Start Time *</label>
                  <input type="time" value={formData.startTime || ""} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" />
                </div>
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">End Time *</label>
                  <input type="time" value={formData.endTime || ""} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" />
                </div>
              </div>
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">MS Teams Link *</label>
                <input type="url" value={formData.teamsLink || ""} onChange={(e) => setFormData({ ...formData, teamsLink: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" placeholder="https://teams.microsoft.com/..." />
              </div>
              {selectedItem && (
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Status</label>
                  <select value={formData.status || ""} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg bg-white text-[#0a0a0a] focus:border-[#E8001C] focus:outline-none">
                    <option value="scheduled">Scheduled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              )}
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Description</label>
                <textarea value={formData.description || ""} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" rows="3" placeholder="Class description..." />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <button onClick={() => setShowModal(false)} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] hover:bg-[#f5f5f5] order-2 sm:order-1">Cancel</button>
                <button onClick={handleSaveClass} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="ad-btn disabled:opacity-50 order-1 sm:order-2">
                  {submitting ? <><Loader className="animate-spin" size={18} /><span>Saving...</span></> : <><Save size={18} /><span>{selectedItem ? "Update" : "Create"}</span></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Recording by Date Modal ─────────────────────────────────────── */}
      {showModal && modalType === "addRecording" && (
        <div className="fixed inset-0 bg-[#0a0a0a] bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-lg border-2 border-[#e8e8e8] max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Add Recording</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#f5f5f5] rounded-lg"><X size={20} /></button>
            </div>
            {addRecError && <div style={{ fontFamily: 'Poppins, sans-serif' }} className="mb-4 p-3 bg-[#E8001C] text-white rounded-lg text-sm">{addRecError}</div>}
            <div className="space-y-4">
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Step 1 — Select the class date *</label>
                <input type="date" value={addRecDate}
                  onChange={(e) => { setAddRecDate(e.target.value); setAddRecBatchId(""); setAddRecClassId(""); }}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" />
              </div>
              {addRecDate && (
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Step 2 — Select batch *</label>
                  <select value={addRecBatchId} onChange={(e) => { setAddRecBatchId(e.target.value); setAddRecClassId(""); }}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg bg-white text-[#0a0a0a] focus:border-[#E8001C] focus:outline-none">
                    <option value="">Select a batch</option>
                    {batches.map(b => <option key={b._id} value={b._id}>{b.name} — {b.subject}</option>)}
                  </select>
                </div>
              )}
              {addRecDate && addRecBatchId && (
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Step 3 — Select class *</label>
                  {addRecFilteredClasses.length === 0 ? (
                    <div className="p-3 bg-[#f5f5f5] border-2 border-[#e8e8e8] rounded-lg">
                      <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555]">No classes found for this batch on {new Date(addRecDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                    </div>
                  ) : (
                    <select value={addRecClassId} onChange={(e) => setAddRecClassId(e.target.value)}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                      className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg bg-white text-[#0a0a0a] focus:border-[#E8001C] focus:outline-none">
                      <option value="">Select a class</option>
                      {addRecFilteredClasses.map(cls => {
                        const isLT = cls.classType === 'longterm';
                        const datePrefix = addRecDate + ' |';
                        const sameDayCount = isLT
                          ? (cls.recordings || []).filter(r => r.label && r.label.startsWith(datePrefix)).length
                          : getClassRecordings(cls).length;
                        return (
                          <option key={cls._id} value={cls._id}>
                            {cls.className} {isLT ? '(Long-Term)' : ''} ({cls.startTime} – {cls.endTime}){sameDayCount > 0 ? ' — ' + sameDayCount + ' part' + (sameDayCount > 1 ? 's' : '') + ' today' : ''}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>
              )}
              {addRecClassId && (() => {
                const cls = classes.find(c => c._id === addRecClassId);
                if (!cls) return null;
                const isLongterm = cls.classType === "longterm";
                const allParts = cls.recordings || [];
                const datePrefix = addRecDate + " |";
                const sameDayParts = isLongterm
                  ? allParts.filter(r => r.label && r.label.startsWith(datePrefix))
                  : getClassRecordings(cls);
                const nextPartNum = sameDayParts.length + 1;
                const nextPartLabel = isLongterm
                  ? (addRecDate + " | Part " + nextPartNum)
                  : ("Part " + nextPartNum);
                return (
                  <div className="p-3 bg-[#f5f5f5] border border-[#e8e8e8] rounded-lg">
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs font-semibold text-[#0a0a0a]">{cls.className}</p>
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] mt-0.5">{cls.batch?.name} • Trainer: {cls.trainer?.name || 'N/A'} • {cls.startTime}–{cls.endTime}</p>
                    {isLongterm && (
                      <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-blue-600 mt-0.5">Recordings for {addRecDate}: {sameDayParts.length} part(s) already saved</p>
                    )}
                    <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] mt-1">
                      {sameDayParts.length > 0 ? "Existing today: " + sameDayParts.map(p => p.label.replace(addRecDate + " | ", "")).join(", ") + " — new link will be saved as " : "New link will be saved as "}
                      <strong>{isLongterm ? ("Part " + nextPartNum) : nextPartLabel}</strong>
                    </p>
                  </div>
                );
              })()}
              {addRecClassId && (
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Step 4 — Paste Google Drive recording link *</label>
                  <input type="url" value={addRecLink} onChange={(e) => setAddRecLink(e.target.value)}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none"
                    placeholder="https://drive.google.com/file/d/..." autoFocus />
                  <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] mt-1">Make sure sharing is set to "Anyone with the link" before pasting.</p>
                </div>
              )}
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
                <button onClick={() => setShowModal(false)} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] hover:bg-[#f5f5f5] order-2 sm:order-1">Cancel</button>
                <button onClick={handleSaveAddRecording} disabled={submitting || !addRecClassId || !addRecLink.trim()}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="ad-btn disabled:opacity-50 order-1 sm:order-2">
                  {submitting ? <><Loader className="animate-spin" size={18} /><span>Saving...</span></> : <><Save size={18} /><span>Save Recording</span></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit Recording Parts Modal ──────────────────────────────────────── */}
      {showModal && modalType === "editRecordings" && (
        <div className="fixed inset-0 bg-[#0a0a0a] bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-lg border-2 border-[#e8e8e8] max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Edit Recording Parts</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#f5f5f5] rounded-lg"><X size={20} /></button>
            </div>
            <div className="mb-4 p-3 bg-[#f5f5f5] border border-[#e8e8e8] rounded-lg">
              <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">{selectedItem?.className}</p>
              <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] mt-0.5">{selectedItem?.trainer?.name} • {selectedItem?.batch?.name} • {formatDate(selectedItem?.date)}</p>
            </div>
            {editRecError && <div style={{ fontFamily: 'Poppins, sans-serif' }} className="mb-4 p-3 bg-[#E8001C] text-white rounded-lg text-sm">{editRecError}</div>}
            {editRecordings.length === 0 && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-amber-700">All recordings removed. Saving will clear recordings for this class.</p>
              </div>
            )}
            <div className="space-y-3 mb-4">
              {editRecordings.map((part, idx) => (
                <div key={idx} className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-14 sm:w-16 flex-shrink-0">
                    <span style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs font-semibold text-[#0a0a0a] px-2 py-1 bg-[#f5f5f5] border border-[#e8e8e8] rounded">{part.label}</span>
                  </div>
                  <input type="url" value={part.url} onChange={(e) => handleEditRecordingUrl(idx, e.target.value)}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="flex-1 px-3 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white text-sm focus:border-[#E8001C] focus:outline-none min-w-0"
                    placeholder="https://drive.google.com/file/d/..." />
                  <button onClick={() => handleRemoveRecordingPart(idx)} className="ad-icon-btn ad-icon-delete flex-shrink-0" title="Delete this recording">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={handleAddRecordingPart}
              style={{ fontFamily: 'Poppins, sans-serif' }}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border-2 border-dashed border-[#e8e8e8] text-[#0a0a0a] rounded-lg hover:bg-[#f5f5f5] mb-4">
              <Plus size={18} /><span>Add Part {editRecordings.length + 1}</span>
            </button>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-2 border-t-2 border-[#e8e8e8]">
              <button onClick={() => setShowModal(false)} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] hover:bg-[#f5f5f5] order-2 sm:order-1">Cancel</button>
              <button onClick={handleSaveEditRecordings} disabled={submitting}
                style={{ fontFamily: 'Poppins, sans-serif' }}
                className="ad-btn disabled:opacity-50 order-1 sm:order-2">
                {submitting ? <><Loader className="animate-spin" size={18} /><span>Saving...</span></> : <><Save size={18} /><span>Save All Parts</span></>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Batch Modal ─────────────────────────────────────────────────────── */}
      {showModal && modalType === "batch" && (
        <div className="fixed inset-0 bg-[#0a0a0a] bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-2xl border-2 border-[#e8e8e8] max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">{selectedItem ? "Edit Batch" : "Create New Batch"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#f5f5f5] rounded-lg"><X size={20} /></button>
            </div>
            {error && <div style={{ fontFamily: 'Poppins, sans-serif' }} className="mb-4 p-3 bg-[#E8001C] text-white rounded-lg text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Batch Name *</label>
                <input type="text" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" placeholder="e.g., VFX Batch 2024-A" />
              </div>
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Subject *</label>
                <input type="text" value={formData.subject || ""} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" placeholder="e.g., Visual Effects" />
              </div>
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Trainer</label>
                <select value={formData.trainer || ""} onChange={(e) => setFormData({ ...formData, trainer: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg bg-white text-[#0a0a0a] focus:border-[#E8001C] focus:outline-none">
                  <option value="">Select Trainer (Optional)</option>
                  {trainers.map(t => <option key={t._id} value={t._id}>{t.name} - {t.subject || 'No Subject'}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Start Date</label>
                  <input type="date" value={formData.startDate || ""} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" />
                </div>
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">End Date</label>
                  <input type="date" value={formData.endDate || ""} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <button onClick={() => setShowModal(false)} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] hover:bg-[#f5f5f5] order-2 sm:order-1">Cancel</button>
                <button onClick={handleSaveBatch} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="ad-btn disabled:opacity-50 order-1 sm:order-2">
                  {submitting ? <><Loader className="animate-spin" size={18} /><span>Saving...</span></> : <><Save size={18} /><span>{selectedItem ? "Update" : "Create"}</span></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Student Modal ───────────────────────────────────────────────── */}
      {showModal && modalType === "addStudent" && (
        <div className="fixed inset-0 bg-[#0a0a0a] bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-md border-2 border-[#e8e8e8] max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Add New Student</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#f5f5f5] rounded-lg"><X size={20} /></button>
            </div>
            <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] mb-4">Adding to <strong>{selectedItem?.name}</strong></p>
            {error && <div style={{ fontFamily: 'Poppins, sans-serif' }} className="mb-4 p-3 bg-[#E8001C] text-white rounded-lg text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Student Name *</label>
                <input type="text" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" placeholder="e.g., John Doe" />
              </div>
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Email *</label>
                <input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" placeholder="student@example.com" />
              </div>
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Parent's WhatsApp Number</label>
                <input type="tel" value={formData.parentPhone || ""} onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" placeholder="e.g., 9876543210" />
              </div>
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Password *</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={formData.password || ""} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white pr-10 focus:border-[#E8001C] focus:outline-none" placeholder="Enter password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#555555] hover:text-[#0a0a0a]">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <button onClick={() => setShowModal(false)} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] hover:bg-[#f5f5f5] order-2 sm:order-1">Cancel</button>
                <button onClick={handleSaveNewStudent} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="ad-btn disabled:opacity-50 order-1 sm:order-2">
                  {submitting ? <><Loader className="animate-spin" size={18} /><span>Creating...</span></> : <><UserPlus size={18} /><span>Create Student</span></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Change Student Password Modal ───────────────────────────────────── */}
      {showModal && modalType === "changePassword" && (
        <div className="fixed inset-0 bg-[#0a0a0a] bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-md border-2 border-[#e8e8e8] max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Change Password</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#f5f5f5] rounded-lg"><X size={20} /></button>
            </div>
            <div className="mb-4 p-3 bg-[#f5f5f5] border border-[#e8e8e8] rounded-lg">
              <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a]">{selectedItem?.name}</p>
              <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555]">{selectedItem?.email}</p>
            </div>
            {changePassError && <div style={{ fontFamily: 'Poppins, sans-serif' }} className="mb-4 p-3 bg-[#E8001C] text-white rounded-lg text-sm">{changePassError}</div>}
            <div className="space-y-4">
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">New Password *</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                    className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white pr-10 focus:border-[#E8001C] focus:outline-none"
                    placeholder="Enter new password (min. 6 chars)"
                    autoFocus
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#555555] hover:text-[#0a0a0a]">
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <button onClick={() => setShowModal(false)} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] hover:bg-[#f5f5f5] order-2 sm:order-1">Cancel</button>
                <button onClick={handleSaveChangePassword} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="ad-btn disabled:opacity-50 order-1 sm:order-2">
                  {submitting ? <><Loader className="animate-spin" size={18} /><span>Updating...</span></> : <><KeyRound size={18} /><span>Update Password</span></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Trainer Modals ──────────────────────────────────────────────────── */}
      {showModal && (modalType === "trainer" || modalType === "editTrainer") && (
        <div className="fixed inset-0 bg-[#0a0a0a] bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-md border-2 border-[#e8e8e8] max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">{modalType === "editTrainer" ? "Edit Trainer" : "Add New Trainer"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#f5f5f5] rounded-lg"><X size={20} /></button>
            </div>
            {error && <div style={{ fontFamily: 'Poppins, sans-serif' }} className="mb-4 p-3 bg-[#E8001C] text-white rounded-lg text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Name *</label>
                <input type="text" value={formData.name || ""} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" placeholder="e.g., Jane Smith" />
              </div>
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Email *</label>
                <input type="email" value={formData.email || ""} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" placeholder="trainer@example.com" />
              </div>
              {modalType === "trainer" && (
                <div>
                  <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Password *</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={formData.password || ""} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ fontFamily: 'Poppins, sans-serif' }}
                      className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white pr-10 focus:border-[#E8001C] focus:outline-none" placeholder="Enter password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#555555] hover:text-[#0a0a0a]">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Subject/Specialization</label>
                <input type="text" value={formData.subject || ""} onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" placeholder="e.g., Visual Effects, Animation" />
              </div>
              <div>
                <label style={{ fontFamily: 'Poppins, sans-serif' }} className="block text-sm font-medium text-[#0a0a0a] mb-1">Phone Number</label>
                <input type="tel" value={formData.phone || ""} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" placeholder="e.g., +91 98765 43210" />
              </div>
              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
                <button onClick={() => setShowModal(false)} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] hover:bg-[#f5f5f5] order-2 sm:order-1">Cancel</button>
                <button onClick={modalType === "editTrainer" ? handleUpdateTrainer : handleSaveTrainer} disabled={submitting}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="ad-btn disabled:opacity-50 order-1 sm:order-2">
                  {submitting ? <><Loader className="animate-spin" size={18} /><span>{modalType === "editTrainer" ? "Updating..." : "Creating..."}</span></> : <><Save size={18} /><span>{modalType === "editTrainer" ? "Update" : "Create"}</span></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Assign Students Modal ───────────────────────────────────────────── */}
      {showModal && modalType === "assign" && (
        <div className="fixed inset-0 bg-[#0a0a0a] bg-opacity-50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-xl p-5 sm:p-6 w-full sm:max-w-2xl border-2 border-[#e8e8e8] max-h-[92vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }} className="text-lg sm:text-xl text-[#0a0a0a]">Assign Students</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#f5f5f5] rounded-lg"><X size={20} /></button>
            </div>
            <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] mb-1">Assigning to <strong>{selectedItem?.name}</strong></p>
            {error && <div style={{ fontFamily: 'Poppins, sans-serif' }} className="mb-4 p-3 bg-[#E8001C] text-white rounded-lg text-sm">{error}</div>}
            <div className="mb-4">
              <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] mb-3">{selectedStudents.length} student(s) selected.</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#555555]" size={18} />
                <input type="text" placeholder="Search by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ fontFamily: 'Poppins, sans-serif' }}
                  className="w-full pl-10 pr-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] bg-white focus:border-[#E8001C] focus:outline-none" />
              </div>
            </div>
            <div className="space-y-2 max-h-64 sm:max-h-96 overflow-y-auto mb-4">
              {filteredStudents.map((student) => (
                <div key={student._id} onClick={() => toggleStudentSelection(student._id)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${selectedStudents.includes(student._id) ? 'bg-[#f5f5f5] border-2 border-[#0a0a0a]' : 'bg-[#f5f5f5] border-2 border-transparent hover:border-[#e8e8e8]'}`}>
                  <div className="flex items-center space-x-3 min-w-0">
                    <input type="checkbox" checked={selectedStudents.includes(student._id)} onChange={() => { }} className="w-4 h-4 accent-[#E8001C] rounded flex-shrink-0" />
                    <div className="min-w-0">
                      <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm font-semibold text-[#0a0a0a] truncate">{student.name}</p>
                      <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] truncate">{student.email}</p>
                    </div>
                  </div>
                  {student.batch && student.batch._id !== selectedItem?._id && (
                    <span style={{ fontFamily: 'Poppins, sans-serif' }} className="text-xs text-[#555555] bg-[#e8e8e8] px-2 py-1 rounded flex-shrink-0 ml-2">In another batch</span>
                  )}
                </div>
              ))}
              {filteredStudents.length === 0 && students.length > 0 && <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] text-center py-8">No students match your search</p>}
              {students.length === 0 && <p style={{ fontFamily: 'Poppins, sans-serif' }} className="text-sm text-[#555555] text-center py-8">No students available</p>}
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t-2 border-[#e8e8e8]">
              <button onClick={() => setShowModal(false)} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="px-4 py-2 border-2 border-[#e8e8e8] rounded-lg text-[#0a0a0a] hover:bg-[#f5f5f5] order-2 sm:order-1">Cancel</button>
              <button onClick={handleSaveStudentAssignment} disabled={submitting} style={{ fontFamily: 'Poppins, sans-serif' }} className="ad-btn disabled:opacity-50 order-1 sm:order-2">
                {submitting ? <><Loader className="animate-spin" size={18} /><span>Saving...</span></> : <><Save size={18} /><span>Save Assignment</span></>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}