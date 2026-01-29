import React, { useState, useEffect } from "react";
import { BookOpen, Video, Calendar, Plus, Edit2, Trash2, Settings, ExternalLink, X, Save, Loader, LogOut, Clock } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import config from "../../config";

const API_URL = config.apiUrl;

export default function TrainerDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ totalBatches: 0, totalClasses: 0, todayClasses: 0, upcomingClasses: 0 });
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      
      // Fetch trainer's classes using the my-classes endpoint
      const classesRes = await fetch(`${API_URL}/classes/my-classes`, { headers });
      
      // Fetch all batches and filter by trainer on frontend
      const batchesRes = await fetch(`${API_URL}/batches`, { headers });

      if (!classesRes.ok || !batchesRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const classesData = await classesRes.json();
      const allBatches = await batchesRes.json();

      // Filter batches where current user is the trainer
      const trainerBatches = allBatches.filter(batch => 
        batch.trainer && batch.trainer._id === user._id
      );

      setBatches(trainerBatches || []);
      setClasses(classesData || []);

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const todayClasses = (classesData || []).filter(cls => {
        const classDate = new Date(cls.date);
        classDate.setHours(0, 0, 0, 0);
        return classDate.getTime() === today.getTime();
      }).length;

      const upcomingClasses = (classesData || []).filter(cls => {
        const classDate = new Date(cls.date);
        classDate.setHours(0, 0, 0, 0);
        return classDate.getTime() > today.getTime();
      }).length;

      setStats({
        totalBatches: trainerBatches?.length || 0,
        totalClasses: classesData?.length || 0,
        todayClasses: todayClasses,
        upcomingClasses: upcomingClasses,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const handleCreateClass = () => {
    setModalType("class");
    setSelectedItem(null);
    setFormData({ 
      className: "", 
      batch: "", 
      date: "", 
      startTime: "", 
      endTime: "", 
      teamsLink: "", 
      description: "", 
      status: "scheduled" 
    });
    setError("");
    setShowModal(true);
  };

  const handleEditClass = (classItem) => {
    setModalType("class");
    setSelectedItem(classItem);
    setFormData({
      className: classItem.className || "",
      batch: (classItem.batch && classItem.batch._id) ? classItem.batch._id : "",
      date: classItem.date ? new Date(classItem.date).toISOString().split('T')[0] : "",
      startTime: classItem.startTime || "",
      endTime: classItem.endTime || "",
      teamsLink: classItem.teamsLink || "",
      description: classItem.description || "",
      status: classItem.status || "scheduled",
      recordingLink: classItem.recordingLink || ""
    });
    setError("");
    setShowModal(true);
  };

  const handleSaveClass = async () => {
    setSubmitting(true);
    setError("");
    
    const requiredFields = {
      'Class Name': formData.className, 
      'Batch': formData.batch,
      'Date': formData.date, 
      'Start Time': formData.startTime, 
      'End Time': formData.endTime,
      'MS Teams Link': formData.teamsLink
    };
    
    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value || value === '')
      .map(([field]) => field);
    
    if (missingFields.length > 0) {
      setError(`Please fill in: ${missingFields.join(', ')}`);
      setSubmitting(false);
      return;
    }

    try {
      const headers = getAuthHeaders();
      let response;
      
      if (selectedItem) {
        response = await fetch(`${API_URL}/classes/${selectedItem._id}`, {
          method: 'PUT', 
          headers, 
          body: JSON.stringify(formData)
        });
      } else {
        // When creating, trainer is automatically assigned by backend
        response = await fetch(`${API_URL}/classes`, {
          method: 'POST', 
          headers, 
          body: JSON.stringify(formData)
        });
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save class');
      }
      
      setShowModal(false);
      setError("");
      alert(selectedItem ? "Class updated successfully!" : "Class created successfully!");
      fetchDashboardData();
    } catch (error) {
      console.error("Error saving class:", error);
      setError(error.message || "Failed to save class");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteClass = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`${API_URL}/classes/${classId}`, { 
        method: 'DELETE', 
        headers 
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete class');
      }
      
      alert("Class deleted successfully!");
      fetchDashboardData();
    } catch (error) {
      console.error("Error deleting class:", error);
      alert(error.message || "Failed to delete class");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const statsCards = [
    {
      label: "My Batches",
      value: stats.totalBatches,
      icon: BookOpen,
      color: "from-black via-zinc-900 to-zinc-700"
    },
    {
      label: "Total Classes",
      value: stats.totalClasses,
      icon: Video,
      color: "from-black via-zinc-900 to-zinc-700"
    },
    {
      label: "Today's Classes",
      value: stats.todayClasses,
      icon: Calendar,
      color: "from-black via-zinc-900 to-zinc-700"
    },
    {
      label: "Upcoming Classes",
      value: stats.upcomingClasses,
      icon: Clock,
      color: "from-black via-zinc-900 to-zinc-700"
    },
  ];

  if (loading && classes.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <style>{`
          @font-face {
            font-family: 'Barlow Condensed';
            src: url('/fonts/BarlowCondensed-Regular.woff2') format('woff2');
            font-weight: 400;
            font-style: normal;
          }
          .barlow { font-family: 'Barlow Condensed', sans-serif; }
        `}</style>
        <div className="text-center">
          <Loader className="animate-spin h-12 w-12 text-black mx-auto mb-4" />
          <p className="barlow text-black">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @font-face {
          font-family: 'Barlow Condensed';
          src: url('/fonts/BarlowCondensed-Regular.woff2') format('woff2');
          font-weight: 400;
          font-style: normal;
        }
        .barlow { font-family: 'Barlow Condensed', sans-serif; }
      `}</style>

      {/* Header */}
      <div className="bg-black shadow-sm border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <img src="/whitelogo.png" alt="Logo" className="h-10 w-auto" />
              <div className="h-8 w-px bg-white opacity-30"></div>
              <h1 className="barlow text-2xl font-bold text-white">Trainer Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="barlow text-sm text-white">
                Welcome, <span className="font-semibold">{user?.name || "Trainer"}</span>
              </div>
              <div className="relative">
                <button 
                  onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <Settings size={20} className="text-white" />
                </button>
                
                {showSettingsDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border-2 border-black z-50">
                    <button
                      onClick={handleLogout}
                      className="barlow w-full flex items-center space-x-2 px-4 py-3 text-left text-black hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSettingsDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSettingsDropdown(false)}
        />
      )}

      {/* Tabs */}
      <div className="bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {["overview", "batches", "classes"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`barlow py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab ? "border-black text-black" : "border-transparent text-gray-500 hover:text-black"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 shadow-md border-2 border-black">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="barlow text-black text-sm">{stat.label}</p>
                      <p className="barlow text-3xl font-bold text-black mt-2">{stat.value}</p>
                    </div>
                    <div className={`bg-gradient-to-r ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                      <stat.icon className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Today's Classes */}
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-black">
                <h3 className="barlow text-lg font-semibold text-black mb-4">Today's Classes</h3>
                <div className="space-y-3">
                  {(() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const todayClasses = classes.filter(cls => {
                      const classDate = new Date(cls.date);
                      classDate.setHours(0, 0, 0, 0);
                      return classDate.getTime() === today.getTime();
                    });
                    
                    if (todayClasses.length === 0) {
                      return <p className="barlow text-sm text-black text-center py-4">No classes scheduled for today</p>;
                    }
                    
                    return todayClasses.slice(0, 3).map((cls) => (
                      <div key={cls._id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-black">
                        <div>
                          <p className="barlow text-sm font-medium text-black">{cls.className}</p>
                          <p className="barlow text-xs text-black">
                            {cls.batch && cls.batch.name ? cls.batch.name : 'N/A'} • {cls.startTime} - {cls.endTime}
                          </p>
                        </div>
                        <a 
                          href={cls.teamsLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="barlow px-3 py-1 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800"
                        >
                          Join
                        </a>
                      </div>
                    ));
                  })()}
                </div>
              </div>

              {/* My Batches Overview */}
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-black">
                <h3 className="barlow text-lg font-semibold text-black mb-4">My Batches</h3>
                <div className="space-y-3">
                  {batches.slice(0, 3).map((batch) => (
                    <div key={batch._id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-black">
                      <div>
                        <p className="barlow text-sm font-medium text-black">{batch.name}</p>
                        <p className="barlow text-xs text-black">
                          {batch.subject} • {batch.students && Array.isArray(batch.students) ? batch.students.length : 0} students
                        </p>
                      </div>
                    </div>
                  ))}
                  {batches.length === 0 && <p className="barlow text-sm text-black text-center py-4">No batches assigned</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "batches" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="barlow text-xl font-semibold text-black">My Batches</h3>
            </div>

            <div className="grid gap-4">
              {batches.map((batch) => (
                <div key={batch._id} className="bg-white rounded-xl p-6 shadow-md border-2 border-black">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="barlow text-lg font-semibold text-black">{batch.name}</h4>
                      <p className="barlow text-sm text-black mt-1">{batch.subject}</p>
                      <div className="barlow flex items-center space-x-4 mt-3 text-sm text-black">
                        <span>{formatDate(batch.startDate)} - {formatDate(batch.endDate)}</span>
                        <span>•</span>
                        <span>{batch.students && Array.isArray(batch.students) ? batch.students.length : 0} students</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {batches.length === 0 && (
                <div className="bg-white rounded-xl p-12 text-center border-2 border-black">
                  <BookOpen className="mx-auto h-12 w-12 text-black mb-4" />
                  <p className="barlow text-black">No batches assigned to you</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "classes" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="barlow text-xl font-semibold text-black">My Classes</h3>
              <button 
                onClick={handleCreateClass} 
                className="barlow flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
              >
                <Plus size={20} />
                <span>Create Class</span>
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-md border-2 border-black overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black">
                    <tr>
                      <th className="barlow px-6 py-3 text-left text-xs font-medium text-white uppercase">Class Name</th>
                      <th className="barlow px-6 py-3 text-left text-xs font-medium text-white uppercase">Batch</th>
                      <th className="barlow px-6 py-3 text-left text-xs font-medium text-white uppercase">Date & Time</th>
                      <th className="barlow px-6 py-3 text-left text-xs font-medium text-white uppercase">Status</th>
                      <th className="barlow px-6 py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black">
                    {classes.map((cls) => (
                      <tr key={cls._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="barlow text-sm font-medium text-black">{cls.className}</div>
                        </td>
                        <td className="barlow px-6 py-4 text-sm text-black">
                          {cls.batch && cls.batch.name ? cls.batch.name : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <div className="barlow text-sm text-black">{formatDate(cls.date)}</div>
                          <div className="barlow text-xs text-black">{cls.startTime} - {cls.endTime}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`barlow px-3 py-1 rounded-full text-xs font-medium ${
                            cls.status === "ongoing" ? "bg-black text-white" :
                            cls.status === "completed" ? "bg-gray-300 text-black" :
                            "bg-white text-black border border-black"
                          }`}>
                            {cls.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <a 
                              href={cls.teamsLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="p-2 text-black hover:bg-gray-100 rounded-lg border border-black" 
                              title="Open Teams Link"
                            >
                              <ExternalLink size={18} />
                            </a>
                            <button 
                              onClick={() => handleEditClass(cls)} 
                              className="p-2 text-black hover:bg-gray-100 rounded-lg border border-black" 
                              title="Edit Class"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDeleteClass(cls._id)} 
                              className="p-2 text-white bg-black hover:bg-gray-800 rounded-lg" 
                              title="Delete Class"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {classes.length === 0 && (
                  <div className="text-center py-12">
                    <Video className="mx-auto h-12 w-12 text-black mb-4" />
                    <p className="barlow text-black">No classes created yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Class Modal */}
      {showModal && modalType === "class" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-black">
            <div className="flex justify-between items-center mb-4">
              <h3 className="barlow text-xl font-semibold text-black">
                {selectedItem ? "Edit Class" : "Create New Class"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            
            {error && (
              <div className="barlow mb-4 p-3 bg-black text-white rounded-lg text-sm">{error}</div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="barlow block text-sm font-medium text-black mb-1">Class Name *</label>
                <input 
                  type="text" 
                  value={formData.className || ""} 
                  onChange={(e) => setFormData({...formData, className: e.target.value})}
                  className="barlow w-full px-4 py-2 border-2 border-black rounded-lg text-black bg-white" 
                  placeholder="e.g., Introduction to VFX" 
                />
              </div>
              
              <div>
                <label className="barlow block text-sm font-medium text-black mb-1">Batch *</label>
                <select 
                  value={formData.batch || ""} 
                  onChange={(e) => setFormData({...formData, batch: e.target.value})}
                  className="barlow w-full px-4 py-2 border-2 border-black rounded-lg bg-white text-black"
                >
                  <option value="">Select Batch</option>
                  {batches.map(b => (
                    <option key={b._id} value={b._id}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="barlow block text-sm font-medium text-black mb-1">Date *</label>
                <input 
                  type="date" 
                  value={formData.date || ""} 
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="barlow w-full px-4 py-2 border-2 border-black rounded-lg text-black bg-white" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="barlow block text-sm font-medium text-black mb-1">Start Time *</label>
                  <input 
                    type="time" 
                    value={formData.startTime || ""} 
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="barlow w-full px-4 py-2 border-2 border-black rounded-lg text-black bg-white" 
                  />
                </div>
                <div>
                  <label className="barlow block text-sm font-medium text-black mb-1">End Time *</label>
                  <input 
                    type="time" 
                    value={formData.endTime || ""} 
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="barlow w-full px-4 py-2 border-2 border-black rounded-lg text-black bg-white" 
                  />
                </div>
              </div>

              <div>
                <label className="barlow block text-sm font-medium text-black mb-1">MS Teams Link *</label>
                <input 
                  type="url" 
                  value={formData.teamsLink || ""} 
                  onChange={(e) => setFormData({...formData, teamsLink: e.target.value})}
                  className="barlow w-full px-4 py-2 border-2 border-black rounded-lg text-black bg-white" 
                  placeholder="https://teams.microsoft.com/..." 
                />
              </div>

              {selectedItem && (
                <>
                  <div>
                    <label className="barlow block text-sm font-medium text-black mb-1">Recording Link</label>
                    <input 
                      type="url" 
                      value={formData.recordingLink || ""} 
                      onChange={(e) => setFormData({...formData, recordingLink: e.target.value})}
                      className="barlow w-full px-4 py-2 border-2 border-black rounded-lg text-black bg-white" 
                      placeholder="https://..." 
                    />
                  </div>
                  <div>
                    <label className="barlow block text-sm font-medium text-black mb-1">Status</label>
                    <select 
                      value={formData.status || ""} 
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="barlow w-full px-4 py-2 border-2 border-black rounded-lg bg-white text-black"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </>
              )}

              <div>
                <label className="barlow block text-sm font-medium text-black mb-1">Description</label>
                <textarea 
                  value={formData.description || ""} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="barlow w-full px-4 py-2 border-2 border-black rounded-lg text-black bg-white" 
                  rows="3" 
                  placeholder="Class description..." 
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setShowModal(false)} 
                  disabled={submitting}
                  className="barlow px-4 py-2 border-2 border-black rounded-lg text-black hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveClass} 
                  disabled={submitting}
                  className="barlow flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>{selectedItem ? "Update" : "Create"}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}