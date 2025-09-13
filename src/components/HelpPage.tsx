import React from 'react';
import { Map, Search, List, Bell, Settings, Trash2 } from './icons';

const HelpPage: React.FC = () => {

  const helpTopics = [
    {
      icon: Map,
      title: 'Using the Live Map',
      content: `The Live Issue Map provides a real-time geographic overview of all reported issues.
      <ul class="list-disc list-inside space-y-2 mt-2">
        <li><b>Pan & Zoom:</b> Use your mouse to drag the map and the scroll wheel to zoom in and out.</li>
        <li><b>Issue Markers:</b> Each pin on the map represents an issue. Click a pin to open a popup with summary details.</li>
        <li><b>Search & Locate:</b> Type a search query (like an ID, title, or department) into the header search bar and press <b>Enter</b>. The map will automatically pan and zoom to the location of the first matching issue.</li>
      </ul>`
    },
    {
      icon: Search,
      title: 'Filtering & Searching',
      content: `You can narrow down the list of issues using several powerful filtering tools.
      <ul class="list-disc list-inside space-y-2 mt-2">
        <li><b>Global Search:</b> The search bar in the header searches across multiple fields: Issue ID, Title, Description, Department, and User ID.</li>
        <li><b>Department Filters:</b> Click on a department statistics card on the dashboard or a department name in the sidebar to show issues only from that department. Click again or use the "Clear" button to remove the filter.</li>
        <li><b>Status Toggles:</b> On the dashboard, use the "Pending," "In Progress," and "Resolved" buttons to toggle between different issue statuses. The counts on these buttons update based on your other active filters.</li>
      </ul>`
    },
    {
      icon: List,
      title: 'Dashboard & Views',
      content: `The sidebar allows you to switch between different views to manage issues effectively.
      <ul class="list-disc list-inside space-y-2 mt-2">
        <li><b>Dashboard:</b> Your main landing page with an overview of pending issues, department statistics, and status toggles.</li>
        <li><b>All Issues:</b> A comprehensive list of every single issue in the system, regardless of its status.</li>
        <li><b>Dispatches:</b> Shows only issues that are currently "In Progress," helping you track active work.</li>
        <li><b>Completed:</b> A view of all "Resolved" issues, useful for reviewing past work and generating reports.</li>
      </ul>`
    },
    {
      icon: Trash2,
      title: 'Handling Incorrect Issues (Trash)',
      content: `Sometimes, incorrect or fake issues are submitted. You can manage these using the "Error" status and the "Trash" view.
      <ul class="list-disc list-inside space-y-2 mt-2">
        <li><b>Mark as Error:</b> For any "Pending" or "In Progress" issue, you can click the "Mark as Error" button. This moves the issue to the Trash.</li>
        <li><b>Trash View:</b> The "Trash" section in the sidebar contains all issues that have been marked as errors. This keeps your main dashboard clean.</li>
        <li><b>Permanent Deletion (Admins Only):</b> If you are an Administrator, you will see a "Delete Permanently" button on issues in the Trash. This action cannot be undone and is restricted to prevent accidental data loss.</li>
      </ul>`
    },
    {
      icon: Bell,
      title: 'Notifications',
      content: `The notification bell in the header keeps you updated on important events.
      <ul class="list-disc list-inside space-y-2 mt-2">
        <li><b>Unread Indicator:</b> A red dot on the bell icon indicates you have unread notifications.</li>
        <li><b>Reading Notifications:</b> Click on a notification to mark it as read. Use the "Mark all as read" button to clear all notifications at once.</li>
        <li><b>Real-time Alerts:</b> You'll receive notifications for new high-priority issues, status changes, and system updates.</li>
      </ul>`
    },
    {
      icon: Settings,
      title: 'User Settings',
      content: `The Settings page provides details about your user profile and activity.
      <ul class="list-disc list-inside space-y-2 mt-2">
        <li><b>Profile Information:</b> View your employee ID, join date, department, role, and other personal details.</li>
        <li><b>Activity Summary:</b> See a count of the issues that have been resolved within your department, giving you an overview of your team's performance.</li>
      </ul>`
    }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-on-surface">Help Center</h2>
        <p className="text-on-surface-variant mt-1">Find answers and instructions on how to use the admin panel.</p>
      </div>

      <div className="space-y-4">
        {helpTopics.map((topic, index) => (
          <details key={index} className="bg-surface rounded-2xl shadow-sm overflow-hidden group" open={index === 0}>
            <summary className="flex items-center gap-4 p-5 cursor-pointer hover:bg-black/5 transition-colors">
              <topic.icon className="w-6 h-6 text-primary" />
              <h3 className="text-lg font-semibold text-on-surface flex-1">{topic.title}</h3>
              <div className="transform transition-transform group-open:rotate-180">
                <svg className="w-6 h-6 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div 
              className="p-5 border-t border-outline/20 text-on-surface-variant leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: topic.content }}
            />
          </details>
        ))}
      </div>
    </div>
  );
};

export default HelpPage;
