import React from 'react';
import { Wrench, CheckCheck } from './icons';

interface DepartmentalStatsProps {
  ongoingIssues: number;
  resolvedIssues: number;
  departmentName: string;
}

const DepartmentalStatCard: React.FC<{ icon: React.ElementType, title: string, value: number, color: string }> = ({ icon: Icon, title, value, color }) => (
  <div className="bg-surface p-5 rounded-2xl flex items-center gap-4 shadow-sm flex-1">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="w-7 h-7 text-on-primary" />
    </div>
    <div>
      <p className="text-2xl font-bold text-on-surface">{value}</p>
      <p className="text-sm font-medium text-on-surface-variant">{title}</p>
    </div>
  </div>
);

const DepartmentalStats: React.FC<DepartmentalStatsProps> = ({ ongoingIssues, resolvedIssues, departmentName }) => {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-on-surface mb-3">Your Department's Status: <span className="text-primary font-bold">{departmentName}</span></h3>
      <div className="flex flex-col md:flex-row gap-6">
        <DepartmentalStatCard 
          icon={Wrench} 
          title="Ongoing Issues" 
          value={ongoingIssues} 
          color="bg-orange-500" 
        />
        <DepartmentalStatCard 
          icon={CheckCheck} 
          title="Total Resolved" 
          value={resolvedIssues} 
          color="bg-green-500" 
        />
      </div>
    </div>
  );
};

export default DepartmentalStats;
