import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Issue } from '../types';
import { User, Mail, Building2, UserCheck, Clock, MapPin, Calendar, Wrench } from './icons';

interface SettingsPageProps {
  issues: Issue[];
}

const SettingsPage: React.FC<SettingsPageProps> = ({ issues }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p>Loading user data...</p>
      </div>
    );
  }

  const resolvedIssuesCount = issues.filter(
    (issue) => issue.status === 'Resolved' && (user.role === 'Administrator' || issue.department === user.department)
  ).length;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };
  
  const DetailItem: React.FC<{ icon: React.ElementType, label: string, value: string }> = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-4">
      <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
      <div>
        <p className="text-sm text-on-surface-variant">{label}</p>
        <p className="font-medium text-on-surface">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface">User Settings</h2>
        <p className="text-on-surface-variant mt-1">Manage your profile and view your activity.</p>
      </div>

      <div className="bg-surface p-8 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-outline/20 pb-8 mb-8">
          <img src={user.avatarUrl} alt={user.username} className="w-32 h-32 rounded-full object-cover border-4 border-primary/50" />
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-bold text-on-surface">{user.username}</h3>
            <p className="text-primary font-medium">{user.role}</p>
            <p className="text-on-surface-variant mt-2 max-w-lg">{user.about}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: User Details */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-on-surface">Personal Information</h4>
            <DetailItem icon={User} label="Employee ID" value={user.id} />
            <DetailItem icon={Mail} label="Email Address" value={user.email} />
            <DetailItem icon={Calendar} label="Join Date" value={formatDate(user.joinDate)} />
          </div>

          {/* Right Column: Work Details */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-on-surface">Work Details</h4>
            <DetailItem icon={Building2} label="Department" value={user.department} />
            <DetailItem icon={UserCheck} label="Role" value={user.role} />
            <DetailItem icon={Clock} label="Shift" value={`${user.shift} Shift`} />
            <DetailItem icon={MapPin} label="Work Location" value={user.location} />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-outline/20">
           <h4 className="text-lg font-semibold text-on-surface mb-4">Activity Summary</h4>
           <div className="p-6 bg-surface-container rounded-xl flex items-center gap-4">
              <Wrench className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-on-surface">{resolvedIssuesCount}</p>
                <p className="text-on-surface-variant">Issues resolved in your department</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
