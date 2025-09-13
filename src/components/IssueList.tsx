import React from 'react';
import { Issue, Status } from '../types';
import { MapPin, Check, Send, Clock, AlertCircle } from './icons';

interface IssueItemProps {
  issue: Issue;
  onIssueClick: (issue: Issue) => void;
}

const IssueItem: React.FC<IssueItemProps> = ({ issue, onIssueClick }) => {
  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
  }

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'Pending': return 'text-red-600 bg-red-100';
      case 'In Progress': return 'text-orange-600 bg-orange-100';
      case 'Resolved': return 'text-green-600 bg-green-100';
      case 'Error': return 'text-slate-600 bg-slate-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Issue['status']) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <Send className="w-4 h-4" />;
      case 'Resolved': return <Check className="w-4 h-4" />;
      case 'Error': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div 
      className="flex items-center gap-4 p-4 hover:bg-primary/5 cursor-pointer transition-colors"
      onClick={() => onIssueClick(issue)}
    >
      <img src={issue.imageUrl} alt={issue.title} className="w-24 h-24 object-cover rounded-lg flex-shrink-0" />
      <div className="flex-grow">
        <p className="font-semibold text-on-surface">{issue.title}</p>
        <p className="text-sm text-on-surface-variant mt-1">{issue.description.substring(0, 100)}...</p>
        <div className="text-xs text-on-surface-variant/80 mt-2 flex items-center flex-wrap gap-x-3 gap-y-1">
          <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{issue.department}</span>
          <span className={`font-semibold px-2 py-0.5 rounded-full ${getPriorityColor(issue.priority)}`}>{issue.priority}</span>
          <span>ID: {issue.id}</span>
          <span>User: {issue.userId}</span>
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {issue.distance} miles away</span>
          <span>{timeAgo(issue.submittedAt)}</span>
        </div>
      </div>
      <div className="flex-shrink-0 w-36 text-right">
        <span className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full ${getStatusColor(issue.status)}`}>
          {getStatusIcon(issue.status)}
          {issue.status}
        </span>
      </div>
    </div>
  );
};

interface IssueListProps {
  issues: Issue[];
  onUpdateIssue: (issueId: string, updates: Partial<Issue>) => void;
  onDeleteIssue: (issueId: string) => void;
  onIssueClick: (issue: Issue) => void;
}

const IssueList: React.FC<IssueListProps> = ({ issues, onIssueClick }) => {
  if (issues.length === 0) {
    return <div className="text-center py-20 text-on-surface-variant">No issues match your criteria.</div>;
  }

  return (
    <div className="divide-y divide-outline/20">
      {issues.map(issue => (
        <IssueItem 
          key={issue.id} 
          issue={issue} 
          onIssueClick={onIssueClick}
        />
      ))}
    </div>
  );
};

export default IssueList;
