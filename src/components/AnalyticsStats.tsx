import React, { useMemo } from 'react';
import { Issue } from '../types';
import { AlertCircle, Timer, Building, Percent } from './icons';

interface AnalyticsStatsProps {
  issues: Issue[];
}

const StatCard: React.FC<{ icon: React.ElementType, title: string, value: string | number, color: string }> = ({ icon: Icon, title, value, color }) => (
  <div className="bg-surface p-5 rounded-2xl flex items-center gap-4 shadow-sm">
    <div className={`p-3 rounded-full ${color}`}>
      <Icon className="w-7 h-7 text-on-primary" />
    </div>
    <div>
      <p className="text-2xl font-bold text-on-surface">{value}</p>
      <p className="text-sm font-medium text-on-surface-variant">{title}</p>
    </div>
  </div>
);

const AnalyticsStats: React.FC<AnalyticsStatsProps> = ({ issues }) => {
  const stats = useMemo(() => {
    const pendingIssues = issues.filter(i => i.status === 'Pending' || i.status === 'In Progress');
    const resolvedIssues = issues.filter(i => i.status === 'Resolved' && i.resolvedAt);

    // Average Resolution Time
    let avgResolutionTime = 'N/A';
    if (resolvedIssues.length > 0) {
      const totalResolutionTime = resolvedIssues.reduce((acc, issue) => {
        return acc + (issue.resolvedAt!.getTime() - issue.submittedAt.getTime());
      }, 0);
      const avgMillis = totalResolutionTime / resolvedIssues.length;
      const avgDays = Math.floor(avgMillis / (1000 * 60 * 60 * 24));
      const avgHours = Math.floor((avgMillis % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      avgResolutionTime = `${avgDays}d ${avgHours}h`;
    }

    // Busiest Department
    const departmentCounts = pendingIssues.reduce((acc, issue) => {
      acc[issue.department] = (acc[issue.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const busiestDepartment = Object.keys(departmentCounts).reduce((a, b) => departmentCounts[a] > departmentCounts[b] ? a : b, 'None');

    // 30-Day Resolution Rate
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const raisedLast30Days = issues.filter(i => i.submittedAt >= thirtyDaysAgo).length;
    const resolvedLast30Days = issues.filter(i => i.resolvedAt && i.resolvedAt >= thirtyDaysAgo).length;
    const resolutionRate = raisedLast30Days > 0 ? ((resolvedLast30Days / raisedLast30Days) * 100).toFixed(1) : '0.0';

    return {
      totalPending: pendingIssues.length,
      avgResolutionTime,
      busiestDepartment,
      resolutionRate: `${resolutionRate}%`,
    };
  }, [issues]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard icon={AlertCircle} title="Total Pending Issues" value={stats.totalPending} color="bg-red-500" />
      <StatCard icon={Timer} title="Avg. Resolution Time" value={stats.avgResolutionTime} color="bg-blue-500" />
      <StatCard icon={Building} title="Busiest Department" value={stats.busiestDepartment} color="bg-orange-500" />
      <StatCard icon={Percent} title="30-Day Resolution Rate" value={stats.resolutionRate} color="bg-green-500" />
    </div>
  );
};

export default AnalyticsStats;
