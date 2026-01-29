import React, { useState, useEffect } from "react";
import { BookOpen, Video, Calendar, Users, ExternalLink, LogOut, Settings, Clock, PlayCircle, CheckCircle, Loader } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import config from "../../config";

const API_URL = config.apiUrl;

export default function LearnerDashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [classes, setClasses] = useState([]);
  const [stats, setStats] = useState({
    totalClasses: 0,
    upcomingClasses: 0,
    completedClasses: 0,
    ongoingClasses: 0
  });
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [error, setError] = useState("");

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json"
  });

  useEffect(() => {
    if (!authLoading && user) {
      fetchDashboardData();
    }
  }, [authLoading, user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    
    console.log('=== LEARNER DASHBOARD DEBUG ===');
    console.log('User object:', user);
    console.log('User role:', user?.role);
    
    try {
      const headers = getAuthHeaders();

      // Fetch classes for the learner using my-classes endpoint
      console.log('Fetching classes from:', `${API_URL}/classes/my-classes`);
      const classesRes = await fetch(`${API_URL}/classes/my-classes`, { headers });
      
      console.log('Classes response status:', classesRes.status);
      
      if (!classesRes.ok) {
        const errorData = await classesRes.json();
        console.error('Classes fetch error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch classes');
      }
      
      const classesData = await classesRes.json();
      console.log('✅ Fetched classes:', classesData);
      console.log('Number of classes:', classesData?.length);
      setClasses(classesData || []);

      // Fetch all batches and filter for student's batches
      console.log('Fetching batches from:', `${API_URL}/batches`);
      const batchesRes = await fetch(`${API_URL}/batches`, { headers });
      
      if (batchesRes.ok) {
        const allBatches = await batchesRes.json();
        console.log('All batches:', allBatches);
        
        // Filter batches where current user is in the students array
        const myBatches = allBatches.filter(batch => 
          batch.students && batch.students.some(student => {
            const studentId = typeof student === 'object' ? student._id : student;
            return studentId === user._id;
          })
        );
        
        console.log('✅ My batches:', myBatches);
        setBatches(myBatches || []);
      } else {
        console.error('Batches fetch failed:', batchesRes.status);
      }

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcoming = classesData.filter(cls => {
        const classDate = new Date(cls.date);
        classDate.setHours(0, 0, 0, 0);
        return classDate > today && cls.status === 'scheduled';
      }).length;

      const completed = classesData.filter(cls => cls.status === 'completed').length;
      const ongoing = classesData.filter(cls => cls.status === 'ongoing').length;

      setStats({
        totalClasses: classesData.length,
        upcomingClasses: upcoming,
        completedClasses: completed,
        ongoingClasses: ongoing
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
    window.location.href = "/login";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return timeString;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing':
        return 'bg-black text-white';
      case 'completed':
        return 'bg-gray-300 text-black';
      case 'scheduled':
      default:
        return 'bg-white text-black border border-black';
    }
  };

  const getTodayClasses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return classes.filter(cls => {
      const classDate = new Date(cls.date);
      classDate.setHours(0, 0, 0, 0);
      return classDate.getTime() === today.getTime();
    });
  };

  const getUpcomingClasses = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return classes
      .filter(cls => {
        const classDate = new Date(cls.date);
        classDate.setHours(0, 0, 0, 0);
        return classDate > today && cls.status === 'scheduled';
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  const getRecentCompletedClasses = () => {
    return classes
      .filter(cls => cls.status === 'completed')
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  };

  const statsCards = [
    {
      label: "Total Classes",
      value: stats.totalClasses,
      icon: Video,
      color: "from-black via-zinc-900 to-zinc-700"
    },
    {
      label: "Upcoming",
      value: stats.upcomingClasses,
      icon: Calendar,
      color: "from-black via-zinc-900 to-zinc-700"
    },
    {
      label: "Completed",
      value: stats.completedClasses,
      icon: CheckCircle,
      color: "from-black via-zinc-900 to-zinc-700"
    },
    {
      label: "Ongoing",
      value: stats.ongoingClasses,
      icon: Clock,
      color: "from-black via-zinc-900 to-zinc-700"
    }
  ];

  if (authLoading || (loading && classes.length === 0)) {
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
          <p className="barlow text-black">Loading your dashboard...</p>
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
              <h1 className="barlow text-2xl font-bold text-white">Student Portal</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="barlow text-sm text-white">
                Welcome, <span className="font-semibold">{user?.name || "Student"}</span>
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {["overview", "batches", "schedule", "recordings"].map((tab) => (
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
        {error && (
          <div className="mb-6 p-4 bg-black text-white rounded-lg">
            <p className="barlow">{error}</p>
          </div>
        )}

        {/* Overview Tab */}
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

            {/* My Batches & Today's Classes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* My Batches */}
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-black">
                <h3 className="barlow text-lg font-semibold text-black mb-4 flex items-center">
                  <BookOpen className="mr-2" size={20} />
                  My Batches
                </h3>
                <div className="space-y-3">
                  {batches.length > 0 ? (
                    batches.slice(0, 3).map((batch) => (
                      <div key={batch._id} className="p-4 bg-gray-100 rounded-lg border border-black">
                        <h4 className="barlow text-base font-semibold text-black">{batch.name}</h4>
                        <p className="barlow text-sm text-black mt-1">{batch.subject}</p>
                        <div className="barlow text-xs text-black mt-2">
                          <p>{formatDate(batch.startDate)} - {formatDate(batch.endDate)}</p>
                          {batch.trainer && (
                            <p className="mt-1">Trainer: {batch.trainer.name}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="barlow text-sm text-black text-center py-8">No batches assigned yet</p>
                  )}
                </div>
              </div>

              {/* Today's Classes */}
              <div className="bg-white rounded-xl p-6 shadow-md border-2 border-black">
                <h3 className="barlow text-lg font-semibold text-black mb-4 flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Today's Classes
                </h3>
                <div className="space-y-3">
                  {getTodayClasses().length > 0 ? (
                    getTodayClasses().map((cls) => (
                      <div key={cls._id} className="p-3 bg-gray-100 rounded-lg border border-black">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="barlow text-sm font-medium text-black">{cls.className}</p>
                            <p className="barlow text-xs text-black mt-1">
                              {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                            </p>
                            {cls.trainer && (
                              <p className="barlow text-xs text-black mt-1">
                                Trainer: {cls.trainer.name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`barlow px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cls.status)}`}>
                              {cls.status}
                            </span>
                            {cls.teamsLink && (
                              <a 
                                href={cls.teamsLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 text-black hover:bg-gray-200 rounded-lg border border-black"
                                title="Join Class"
                              >
                                <ExternalLink size={16} />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="barlow text-sm text-black text-center py-8">No classes scheduled for today</p>
                  )}
                </div>
              </div>
            </div>

            {/* Upcoming Classes Preview */}
            <div className="bg-white rounded-xl p-6 shadow-md border-2 border-black">
              <h3 className="barlow text-lg font-semibold text-black mb-4 flex items-center">
                <Clock className="mr-2" size={20} />
                Upcoming Classes
              </h3>
              <div className="space-y-3">
                {getUpcomingClasses().length > 0 ? (
                  getUpcomingClasses().map((cls) => (
                    <div key={cls._id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border border-black">
                      <div className="flex-1">
                        <p className="barlow text-sm font-medium text-black">{cls.className}</p>
                        <p className="barlow text-xs text-black mt-1">
                          {formatDate(cls.date)} • {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                        </p>
                        {cls.trainer && (
                          <p className="barlow text-xs text-black">Trainer: {cls.trainer.name}</p>
                        )}
                      </div>
                      {cls.teamsLink && (
                        <a 
                          href={cls.teamsLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-black hover:bg-gray-200 rounded-lg border border-black"
                          title="Class Link"
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="barlow text-sm text-black text-center py-8">No upcoming classes</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Batches Tab */}
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
                      {batch.trainer && (
                        <p className="barlow text-sm text-black mt-2">Trainer: {batch.trainer.name}</p>
                      )}
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

        {/* Schedule Tab */}
        {activeTab === "schedule" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="barlow text-xl font-semibold text-black">Class Schedule</h3>
            </div>

            <div className="bg-white rounded-xl shadow-md border-2 border-black overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-black">
                    <tr>
                      <th className="barlow px-6 py-3 text-left text-xs font-medium text-white uppercase">Class Name</th>
                      <th className="barlow px-6 py-3 text-left text-xs font-medium text-white uppercase">Date</th>
                      <th className="barlow px-6 py-3 text-left text-xs font-medium text-white uppercase">Time</th>
                      <th className="barlow px-6 py-3 text-left text-xs font-medium text-white uppercase">Trainer</th>
                      <th className="barlow px-6 py-3 text-left text-xs font-medium text-white uppercase">Status</th>
                      <th className="barlow px-6 py-3 text-left text-xs font-medium text-white uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-black">
                    {classes
                      .sort((a, b) => new Date(b.date) - new Date(a.date))
                      .map((cls) => (
                        <tr key={cls._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="barlow text-sm font-medium text-black">{cls.className}</div>
                            {cls.description && (
                              <div className="barlow text-xs text-black mt-1">{cls.description}</div>
                            )}
                          </td>
                          <td className="barlow px-6 py-4 text-sm text-black">
                            {formatDate(cls.date)}
                          </td>
                          <td className="barlow px-6 py-4 text-sm text-black">
                            {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                          </td>
                          <td className="barlow px-6 py-4 text-sm text-black">
                            {cls.trainer ? cls.trainer.name : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`barlow px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(cls.status)}`}>
                              {cls.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              {cls.teamsLink && cls.status !== 'completed' && (
                                <a 
                                  href={cls.teamsLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="barlow flex items-center space-x-1 px-3 py-1 text-black hover:bg-gray-100 rounded-lg border border-black text-xs"
                                >
                                  <ExternalLink size={14} />
                                  <span>Join</span>
                                </a>
                              )}
                              {cls.recordingLink && cls.status === 'completed' && (
                                <a 
                                  href={cls.recordingLink} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="barlow flex items-center space-x-1 px-3 py-1 text-white bg-black hover:bg-gray-800 rounded-lg text-xs"
                                >
                                  <PlayCircle size={14} />
                                  <span>Recording</span>
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                {classes.length === 0 && (
                  <div className="text-center py-12">
                    <Video className="mx-auto h-12 w-12 text-black mb-4" />
                    <p className="barlow text-black">No classes available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recordings Tab */}
        {activeTab === "recordings" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="barlow text-xl font-semibold text-black">Class Recordings</h3>
            </div>

            <div className="grid gap-4">
              {getRecentCompletedClasses().length > 0 ? (
                getRecentCompletedClasses().map((cls) => (
                  <div key={cls._id} className="bg-white rounded-xl p-6 shadow-md border-2 border-black">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="barlow text-lg font-semibold text-black">{cls.className}</h4>
                        <p className="barlow text-sm text-black mt-1">
                          {formatDate(cls.date)} • {formatTime(cls.startTime)} - {formatTime(cls.endTime)}
                        </p>
                        {cls.trainer && (
                          <p className="barlow text-sm text-black mt-1">Trainer: {cls.trainer.name}</p>
                        )}
                        {cls.description && (
                          <p className="barlow text-sm text-black mt-2">{cls.description}</p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        {cls.recordingLink ? (
                          <a 
                            href={cls.recordingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="barlow flex items-center space-x-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                          >
                            <PlayCircle size={18} />
                            <span>Watch Recording</span>
                          </a>
                        ) : (
                          <div className="barlow px-4 py-2 bg-gray-200 text-black rounded-lg border border-black">
                            <span className="text-sm">Recording not available</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl p-12 text-center border-2 border-black">
                  <PlayCircle className="mx-auto h-12 w-12 text-black mb-4" />
                  <p className="barlow text-black">No recordings available yet</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}