import React, { useState, useMemo, useEffect } from 'react';
import { Issue, Status } from '../types';
import { List, Zap, Truck, Droplets, Trash as TrashIcon, X } from './icons';
import { useAuth } from '../context/AuthContext';
import IssueList from './IssueList';
import IssueMap from './IssueMap';
import AnalyticsStats from './AnalyticsStats';
import IssueTrendChart from './IssueTrendChart';
import DepartmentalStats from './DepartmentalStats';

const departmentIcons = {
  Electrical: <Zap className="w-8 h-8 text-yellow-500" />,
  Sanitation: <TrashIcon className="w-8 h-8 text-green-500" />,
  'Sewer & Water': <Droplets className="w-8 h-8 text-blue-500" />,
  'Road & Transport': <Truck className="w-8 h-8 text-gray-500" />,
};

interface DashboardProps {
  issues: Issue[];
  searchTerm: string;
  activeView: string;
  selectedDepartment: string | null;
  onDepartmentSelect: (department: string | null) => void;
  searchEnterTrigger: number;
  onUpdateIssue: (issueId: string, updates: Partial<Issue>) => void;
  onDeleteIssue: (issueId: string) => void;
  onIssueClick: (issue: Issue) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  issues,
  searchTerm, 
  activeView, 
  selectedDepartment, 
  onDepartmentSelect,
  searchEnterTrigger,
  onUpdateIssue,
  onDeleteIssue,
  onIssueClick,
}) => {
  const { user } = useAuth();
  const [activeStatus, setActiveStatus] = useState<Status>('Pending');
  const [mapView, setMapView] = useState<{ center: [number, number], zoom: number } | null>(null);

  const analyticsRoles: (string | undefined)[] = ['Administrator', 'Department Head', 'Supervisor'];
  const canViewAnalytics = user && analyticsRoles.includes(user.role);
  const canViewDepartmentStats = user && ['Staff', 'Department Head', 'Supervisor'].includes(user.role) && user.department !== 'Administration';

  const departmentalStats = useMemo(() => {
    if (!user || !user.department || user.role === 'Administrator') {
      return { ongoing: 0, resolved: 0 };
    }

    const departmentIssues = issues.filter(i => i.department === user.department);

    const ongoing = departmentIssues.filter(i => i.status === 'Pending' || i.status === 'In Progress').length;
    const resolved = departmentIssues.filter(i => i.status === 'Resolved').length;

    return { ongoing, resolved };
  }, [issues, user]);

  const getFilteredIssuesForView = () => {
    const baseFilter = (issue: Issue) => {
      // Enhanced Search filter
      const normalizedSearchTerm = searchTerm.trim().toLowerCase();
      const searchMatch = normalizedSearchTerm === '' ||
        issue.id.toLowerCase().includes(normalizedSearchTerm) ||
        issue.title.toLowerCase().includes(normalizedSearchTerm) ||
        issue.department.toLowerCase().includes(normalizedSearchTerm) ||
        issue.description.toLowerCase().includes(normalizedSearchTerm) ||
        issue.userId.toLowerCase().includes(normalizedSearchTerm);
      
      // User department filter (only show user's department unless admin)
      const userDepartmentMatch = user?.role === 'Administrator' || 
        user?.department === 'Administration' ||
        issue.department === user?.department;
      
      // Selected department filter
      let departmentFilterMatch = true;
      if (selectedDepartment) {
        // Handle special mapping for display names
        if (selectedDepartment === 'Sewer & Water') {
          departmentFilterMatch = issue.department === 'Sewer' || issue.department === 'Water';
        } else {
          departmentFilterMatch = issue.department === selectedDepartment;
        }
      }
      
      return searchMatch && userDepartmentMatch && departmentFilterMatch;
    };

    switch (activeView) {
      case 'all':
        return issues.filter(issue => baseFilter(issue) && issue.status !== 'Error');
        
      case 'dispatches':
        return issues.filter(issue => baseFilter(issue) && issue.status === 'In Progress');
        
      case 'completed':
        return issues.filter(issue => baseFilter(issue) && issue.status === 'Resolved');
        
      case 'trash':
        return issues.filter(issue => baseFilter(issue) && issue.status === 'Error');
        
      default:
        return issues.filter(issue => baseFilter(issue) && issue.status === activeStatus && issue.status !== 'Error');
    }
  };

  const filteredIssues = useMemo(getFilteredIssuesForView, [
    issues, 
    activeStatus, 
    searchTerm, 
    user, 
    selectedDepartment, 
    activeView
  ]);
  
  useEffect(() => {
    if (searchEnterTrigger > 0 && filteredIssues.length > 0) {
      const firstIssue = filteredIssues[0];
      setMapView({
        center: [firstIssue.location.lat, firstIssue.location.lng],
        zoom: 16, // Zoom in closer on search
      });
    }
  }, [searchEnterTrigger, filteredIssues]);


  const stats = useMemo(() => {
    const departmentCounts = issues.reduce((acc, issue) => {
      if (issue.status === 'Pending') {
        if (user?.role === 'Administrator' || user?.department === 'Administration' || issue.department === user?.department) {
          acc[issue.department] = (acc[issue.department] || 0) + 1;
        }
      }
      return acc;
    }, {} as Record<string, number>);

    return [
      { 
        name: 'Electrical', 
        value: 'Electrical',
        count: departmentCounts['Electrical'] || 0, 
        icon: departmentIcons.Electrical 
      },
      { 
        name: 'Sanitation', 
        value: 'Sanitation',
        count: departmentCounts['Sanitation'] || 0, 
        icon: departmentIcons.Sanitation 
      },
      { 
        name: 'Sewer & Water', 
        value: 'Sewer & Water',
        count: (departmentCounts['Sewer'] || 0) + (departmentCounts['Water'] || 0), 
        icon: departmentIcons['Sewer & Water'] 
      },
      { 
        name: 'Road & Transport', 
        value: 'Road & Transport',
        count: departmentCounts['Road & Transport'] || 0, 
        icon: departmentIcons['Road & Transport'] 
      },
    ];
  }, [issues, user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleDepartmentClick = (departmentValue: string) => {
    if (selectedDepartment === departmentValue) {
      onDepartmentSelect(null); // Deselect if already selected
    } else {
      onDepartmentSelect(departmentValue); // Select new department
    }
  };

  const clearDepartmentFilter = () => {
    onDepartmentSelect(null);
  };

  const getViewTitle = () => {
    switch (activeView) {
      case 'all': return 'All Issues';
      case 'dispatches': return 'Dispatched Issues';
      case 'completed': return 'Completed Issues';
      case 'trash': return 'Trash - Incorrect Issues';
      default: return 'Dashboard';
    }
  };

  const getViewDescription = () => {
    switch (activeView) {
      case 'all': return 'View all reported civic issues regardless of status';
      case 'dispatches': return 'Issues currently being processed by departments';
      case 'completed': return 'Successfully resolved civic issues';
      case 'trash': return 'Incorrect or fake issues marked as errors. Admins can permanently delete them.';
      default: return "Here's what's happening with civic issues in your area today.";
    }
  };

  const showStatusToggle = activeView === 'dashboard';
  const showStatsCards = activeView === 'dashboard' && (user?.role === 'Administrator' || user?.department === 'Administration');

  const getStatusCount = (status: Status) => {
    return issues.filter(issue => {
      const userMatch = user?.role === 'Administrator' || user?.department === 'Administration' || issue.department === user?.department;
      const statusMatch = issue.status === status;
      
      let deptMatch = true;
      if (selectedDepartment) {
        if (selectedDepartment === 'Sewer & Water') {
          deptMatch = issue.department === 'Sewer' || issue.department === 'Water';
        } else {
          deptMatch = issue.department === selectedDepartment;
        }
      }
      
      return userMatch && statusMatch && deptMatch && issue.status !== 'Error';
    }).length;
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-on-surface mb-2">
          {activeView === 'dashboard' ? `${getGreeting()}, ${user?.username}!` : getViewTitle()}
        </h2>
        {activeView === 'dashboard' && (
          <p className="text-on-surface-variant">
            {user?.department} Department • {user?.role} • {user?.shift} Shift
          </p>
        )}
        <p className="text-on-surface-variant text-sm">
          {getViewDescription()}
        </p>
      </div>

      {canViewDepartmentStats && activeView === 'dashboard' && (
        <DepartmentalStats
          ongoingIssues={departmentalStats.ongoing}
          resolvedIssues={departmentalStats.resolved}
          departmentName={user.department!}
        />
      )}
      
      {canViewAnalytics && activeView === 'dashboard' && <AnalyticsStats issues={issues} />}

      {selectedDepartment && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-on-surface-variant">Filtering by:</span>
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium">
            <span>{selectedDepartment}</span>
            <button
              onClick={clearDepartmentFilter}
              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
              title="Clear filter"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {showStatsCards && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {stats.map(stat => {
            const isSelected = selectedDepartment === stat.value;
            
            return (
              <button
                key={stat.name}
                onClick={() => handleDepartmentClick(stat.value)}
                className={`bg-surface p-5 rounded-2xl flex items-center gap-4 shadow-sm hover:shadow-md transition-all cursor-pointer text-left w-full border-2 ${
                  isSelected 
                    ? 'border-primary bg-primary/5 scale-105' 
                    : 'border-transparent hover:border-primary/20'
                }`}
              >
                <div className={`p-3 rounded-full transition-colors ${
                  isSelected ? 'bg-primary/20' : 'bg-secondary-container/50'
                }`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-on-surface">{stat.count}</p>
                  <p className="text-sm font-medium text-on-surface-variant">{stat.name} Issues</p>
                  {isSelected && (
                    <p className="text-xs text-primary font-medium mt-1">● Filtered</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {canViewAnalytics && activeView === 'dashboard' && (
        <div className="mb-6">
          <IssueTrendChart issues={issues} />
        </div>
      )}

      <div className="bg-surface rounded-2xl shadow-sm mb-6">
        <div className="p-4 border-b border-outline/20">
          <h3 className="text-lg font-semibold text-on-surface">Live Issue Map</h3>
          <p className="text-sm text-on-surface-variant mt-1">
            Real-time locations of reported civic issues
            {selectedDepartment && (
              <span className="text-primary font-medium"> • Showing {selectedDepartment} department</span>
            )}
          </p>
        </div>
        <IssueMap issues={filteredIssues} mapView={mapView} />
      </div>

      <div className="bg-surface rounded-2xl shadow-sm">
        <div className="p-4 flex justify-between items-center border-b border-outline/20">
          <div>
            <h3 className="text-lg font-semibold text-on-surface mb-2">
              {getViewTitle()}
              {selectedDepartment && (
                <span className="text-primary font-medium text-base ml-2">
                  • {selectedDepartment}
                </span>
              )}
            </h3>
            
            {showStatusToggle && (
              <div role="group" className="inline-flex rounded-full bg-surface-container p-1">
                <button
                  onClick={() => setActiveStatus('Pending')}
                  className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${activeStatus === 'Pending' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:bg-black/5'}`}
                >
                  Pending ({getStatusCount('Pending')})
                </button>
                <button
                  onClick={() => setActiveStatus('In Progress')}
                  className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${activeStatus === 'In Progress' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:bg-black/5'}`}
                >
                  In Progress ({getStatusCount('In Progress')})
                </button>
                <button
                  onClick={() => setActiveStatus('Resolved')}
                  className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${activeStatus === 'Resolved' ? 'bg-primary text-on-primary shadow' : 'text-on-surface-variant hover:bg-black/5'}`}
                >
                  Resolved ({getStatusCount('Resolved')})
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <List className="w-5 h-5 text-on-surface-variant" />
            <span className="text-sm text-on-surface-variant">
              {filteredIssues.length} issue{filteredIssues.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <IssueList 
          issues={filteredIssues} 
          onUpdateIssue={onUpdateIssue} 
          onDeleteIssue={onDeleteIssue} 
          onIssueClick={onIssueClick}
        />
      </div>
    </div>
  );
};

export default Dashboard;
