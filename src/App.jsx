import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import ApplicationsView from './components/ApplicationsView';
import InterviewsView from './components/InterviewsView';
import AnalyticsView from './components/AnalyticsView';
import SettingsView from './components/SettingsView';
import ApplicationFormModal from './components/ApplicationFormModal';
import ApplicationDetailsModal from './components/ApplicationDetailsModal';
import Toast from './components/Toast';
import { Menu } from 'lucide-react';

// ==========================================================================
// 1. Initial Sample / Demo Data (Loaded on first startup)
// ==========================================================================
const INITIAL_DEMO_APPLICATIONS = [
  {
    id: 'demo-1',
    company: 'Stripe',
    position: 'Frontend Engineer',
    location: 'San Francisco, CA (Hybrid)',
    jobType: 'Full-time',
    status: 'Offer',
    dateApplied: '2026-08-01',
    salary: '$145,000 / yr',
    interviewDate: '2026-08-15',
    jobUrl: 'https://stripe.com/jobs',
    notes: 'Technical rounds covered React render optimization, security, and grid layouts. Recruiter confirmed offer details. Super excited!'
  },
  {
    id: 'demo-2',
    company: 'Google',
    position: 'Software Engineer Intern',
    location: 'Mountain View, CA',
    jobType: 'Internship',
    status: 'Interview',
    dateApplied: '2026-08-10',
    salary: '$52/hr',
    interviewDate: '2026-09-02',
    jobUrl: 'https://google.com/careers',
    notes: 'Screener complete. Virtual Onsite scheduled for Sept 2. Focus areas: data structures, graphs, and system design concepts.'
  },
  {
    id: 'demo-3',
    company: 'Amazon',
    position: 'SDE-1',
    location: 'Seattle, WA',
    jobType: 'Full-time',
    status: 'Online Assessment',
    dateApplied: '2026-08-18',
    salary: '$138,000 / yr',
    interviewDate: '2026-08-28',
    jobUrl: 'https://amazon.jobs',
    notes: 'Completed OA part 1 (debugging and code simulation). OA part 2 scheduled for August 28.'
  },
  {
    id: 'demo-4',
    company: 'Meta',
    position: 'Production Engineer',
    location: 'Menlo Park, CA (Onsite)',
    jobType: 'Full-time',
    status: 'Applied',
    dateApplied: '2026-08-22',
    salary: '$165,000 / yr',
    interviewDate: '',
    jobUrl: 'https://meta.com/careers',
    notes: 'Applied with a referral from university alumnus. Recruiter review pending.'
  },
  {
    id: 'demo-5',
    company: 'Netflix',
    position: 'UI Engineer',
    location: 'Los Gatos, CA (Remote)',
    jobType: 'Contract',
    status: 'Rejected',
    dateApplied: '2026-07-20',
    salary: '$90/hr',
    interviewDate: '',
    jobUrl: 'https://netflix.com/careers',
    notes: 'Resume screen rejected. Notes: recruiter mentioned needing 3+ years in high-performance WebGL frameworks.'
  }
];

const DEFAULT_SETTINGS = {
  profileName: 'Alex Morgan',
  profileEmail: 'alex.morgan@university.edu',
  theme: 'light',
  compactMode: false,
  interviewReminders: true,
  applicationUpdates: true
};

export default function App() {
  // ==========================================================================
  // 2. React State Definitions
  // ==========================================================================
  const [applications, setApplications] = useState([]);
  const [userSettings, setUserSettings] = useState(DEFAULT_SETTINGS);
  
  // Navigation & Menu drawers
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Modals Toggles
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);
  
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [viewingApplication, setViewingApplication] = useState(null);

  // Toast System
  const [toasts, setToasts] = useState([]);

  // ==========================================================================
  // 3. Application Initialization & LocalStorage loading
  // ==========================================================================
  useEffect(() => {
    // 3a. Initialize user settings
    try {
      const storedSettings = localStorage.getItem('careertrack_settings');
      if (storedSettings) {
        const parsedSettings = JSON.parse(storedSettings);
        setUserSettings(parsedSettings);
        
        // Immediately apply theme and compact mode settings
        document.documentElement.setAttribute('data-theme', parsedSettings.theme || 'light');
        if (parsedSettings.compactMode) {
          document.body.classList.add('compact-mode');
        } else {
          document.body.classList.remove('compact-mode');
        }
      } else {
        localStorage.setItem('careertrack_settings', JSON.stringify(DEFAULT_SETTINGS));
      }
    } catch (e) {
      console.error('Error loading settings from localStorage, fallback to defaults', e);
      setUserSettings(DEFAULT_SETTINGS);
    }

    // 3b. Initialize applications
    try {
      const storedApps = localStorage.getItem('careertrack_applications');
      if (storedApps) {
        setApplications(JSON.parse(storedApps));
      } else {
        // First startup: write initial demo records to local storage & state
        localStorage.setItem('careertrack_applications', JSON.stringify(INITIAL_DEMO_APPLICATIONS));
        setApplications(INITIAL_DEMO_APPLICATIONS);
      }
    } catch (e) {
      console.error('Error loading applications from localStorage, resetting with demo data', e);
      setApplications(INITIAL_DEMO_APPLICATIONS);
    }
  }, []);

  // Sync page title with tab selection
  useEffect(() => {
    const capitalized = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
    document.title = `CareerTrack | ${capitalized}`;
  }, [activeTab]);

  // ==========================================================================
  // 4. Action Handlers (CRUD, Toast, Settings)
  // ==========================================================================
  const triggerToast = (type, title, message) => {
    const newToast = {
      id: Date.now().toString() + Math.random().toString().substr(2, 5),
      type,
      title,
      message
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleSaveSettings = (updatedSettings) => {
    setUserSettings(updatedSettings);
    localStorage.setItem('careertrack_settings', JSON.stringify(updatedSettings));
    
    // Apply layout changes
    document.documentElement.setAttribute('data-theme', updatedSettings.theme);
    if (updatedSettings.compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
  };

  const handleCreateOrUpdate = (formData) => {
    let updatedApps = [];
    
    if (editingApplication) {
      // Editing Mode
      updatedApps = applications.map((app) => 
        app.id === editingApplication.id ? { ...app, ...formData } : app
      );
      setApplications(updatedApps);
      triggerToast(
        'success', 
        'Application Updated', 
        `Successfully modified your application for ${formData.position} at ${formData.company}.`
      );
    } else {
      // Adding Mode
      const newApp = {
        ...formData,
        id: 'user-' + Date.now().toString() // Unique user generated key
      };
      updatedApps = [newApp, ...applications];
      setApplications(updatedApps);
      triggerToast(
        'success', 
        'Application Logged', 
        `Position for ${formData.position} at ${formData.company} has been added to your dashboard.`
      );
    }

    localStorage.setItem('careertrack_applications', JSON.stringify(updatedApps));
    setFormModalOpen(false);
    setEditingApplication(null);
  };

  const handleDelete = (appId) => {
    const updatedApps = applications.filter((app) => app.id !== appId);
    setApplications(updatedApps);
    localStorage.setItem('careertrack_applications', JSON.stringify(updatedApps));
    
    // If viewing application was deleted, close details modal
    if (viewingApplication && viewingApplication.id === appId) {
      setDetailsModalOpen(false);
      setViewingApplication(null);
    }

    triggerToast('info', 'Application Deleted', 'The job application was permanently deleted.');
  };

  // Helper modals toggles
  const openAddModal = () => {
    setEditingApplication(null);
    setFormModalOpen(true);
  };

  const openEditModal = (app) => {
    setEditingApplication(app);
    setFormModalOpen(true);
  };

  const openDetailsModal = (app) => {
    setViewingApplication(app);
    setDetailsModalOpen(true);
  };

  // ==========================================================================
  // 5. Main Component Rendering
  // ==========================================================================
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            applications={applications}
            onAddClick={openAddModal}
            onViewClick={openDetailsModal}
            userSettings={userSettings}
          />
        );
      case 'applications':
        return (
          <ApplicationsView
            applications={applications}
            onAddClick={openAddModal}
            onViewClick={openDetailsModal}
            onEditClick={openEditModal}
            onDeleteConfirm={handleDelete}
          />
        );
      case 'interviews':
        return (
          <InterviewsView
            applications={applications}
            onAddClick={() => {
              // Direct navigation to applications page to update status/add interview date
              setActiveTab('applications');
              triggerToast('info', 'Interview Guide', 'Select a position below to add an interview date or edit details.');
            }}
          />
        );
      case 'analytics':
        return <AnalyticsView applications={applications} />;
      case 'settings':
        return (
          <SettingsView
            userSettings={userSettings}
            onSaveSettings={handleSaveSettings}
            triggerToast={triggerToast}
          />
        );
      default:
        return (
          <DashboardView
            applications={applications}
            onAddClick={openAddModal}
            onViewClick={openDetailsModal}
            userSettings={userSettings}
          />
        );
    }
  };

  return (
    <div className="app-container">
      {/* 5a. Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        userSettings={userSettings}
      />

      {/* 5b. Main Content Container */}
      <div className="main-wrapper">
        {/* Mobile Header Top Bar (Toggle Drawer) */}
        <header className="mobile-top-bar">
          <button
            onClick={() => setSidebarOpen(true)}
            className="menu-toggle-btn"
            aria-label="Open Navigation Menu"
          >
            <Menu size={24} />
          </button>
          <span style={{ fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)' }}>CareerTrack</span>
          <div style={{ width: 24 }} /> {/* Balancing spacer */}
        </header>

        {/* Dynamic page container */}
        <main className="main-content">
          {renderActiveView()}
        </main>
      </div>

      {/* ==========================================================================
         6. Modal Components & Feedback Toasts
         ========================================================================== */}
      {/* Add / Edit Form Modal */}
      <ApplicationFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingApplication(null);
        }}
        onSave={handleCreateOrUpdate}
        applicationToEdit={editingApplication}
      />

      {/* Detailed Info Modal */}
      <ApplicationDetailsModal
        isOpen={detailsModalOpen}
        onClose={() => {
          setDetailsModalOpen(false);
          setViewingApplication(null);
        }}
        application={viewingApplication}
      />

      {/* Toasts Stack */}
      <Toast toasts={toasts} setToasts={setToasts} />
    </div>
  );
}
