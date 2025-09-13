import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import SettingsPage from './SettingsPage';
import HelpPage from './HelpPage';
import { Issue, Status, Notification } from '../types';
import { generateIssues, generateNotifications } from '../lib/mockData';
import IssueDetailModal from './IssueDetailModal';

const Layout: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [searchEnterTrigger, setSearchEnterTrigger] = useState(0);
  
  const [issues, setIssues] = useState<Issue[]>(() => generateIssues(150));
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  useEffect(() => {
    setNotifications(generateNotifications(7, issues));
  }, [issues]);

  const handleSearchEnter = () => {
    setSearchEnterTrigger(prev => prev + 1);
  };
  
  const handleCloseModal = () => {
    setSelectedIssue(null);
  };

  const handleUpdateIssue = (issueId: string, updates: Partial<Issue>) => {
    setIssues(prevIssues =>
      prevIssues.map(issue => {
        if (issue.id === issueId) {
          return { 
            ...issue, 
            ...updates
          };
        }
        return issue;
      })
    );
    handleCloseModal();
  };

  const handleDeleteIssue = (issueId: string) => {
    setIssues(prevIssues => prevIssues.filter(issue => issue.id !== issueId));
    handleCloseModal();
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleNotificationSelect = (notification: Notification) => {
    setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
    
    if (notification.issueId) {
      const issueToShow = issues.find(issue => issue.id === notification.issueId);
      if (issueToShow) {
        setSelectedIssue(issueToShow);
      }
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'settings':
        return <SettingsPage issues={issues} />;
      case 'help':
        return <HelpPage />;
      default:
        return (
          <Dashboard 
            issues={issues}
            searchTerm={searchTerm} 
            activeView={activeView}
            selectedDepartment={selectedDepartment}
            onDepartmentSelect={setSelectedDepartment}
            searchEnterTrigger={searchEnterTrigger}
            onUpdateIssue={handleUpdateIssue}
            onDeleteIssue={handleDeleteIssue}
            onIssueClick={setSelectedIssue}
          />
        );
    }
  };

  return (
    <div className="h-screen w-screen flex bg-background font-sans">
      <Sidebar 
        selectedDepartment={selectedDepartment} 
        onDepartmentSelect={setSelectedDepartment}
        activeView={activeView}
        onViewChange={setActiveView}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          onSearchEnter={handleSearchEnter}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onNotificationSelect={handleNotificationSelect}
        />
        <div className="flex-1 overflow-y-auto">
          {renderContent()}
        </div>
      </div>
      
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          isOpen={!!selectedIssue}
          onClose={handleCloseModal}
          onUpdateIssue={handleUpdateIssue}
          onDeleteIssue={handleDeleteIssue}
        />
      )}
    </div>
  );
};

export default Layout;
