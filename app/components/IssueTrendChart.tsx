import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import { Issue } from '../types';

interface IssueTrendChartProps {
  issues: Issue[];
}

const IssueTrendChart: React.FC<IssueTrendChartProps> = ({ issues }) => {
  const chartData = useMemo(() => {
    const dates: string[] = [];
    const raisedData: number[] = [];
    const resolvedData: number[] = [];

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toLocaleDateString('en-CA'); // YYYY-MM-DD format
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));

      const raisedOnDay = issues.filter(
        (issue) => new Date(issue.submittedAt).toLocaleDateString('en-CA') === dateString
      ).length;

      const resolvedOnDay = issues.filter(
        (issue) => issue.resolvedAt && new Date(issue.resolvedAt).toLocaleDateString('en-CA') === dateString
      ).length;
      
      raisedData.push(raisedOnDay);
      resolvedData.push(resolvedOnDay);
    }

    return { dates, raisedData, resolvedData };
  }, [issues]);

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#FEF7FF', // surface
      borderColor: '#79747E', // outline
      borderWidth: 1,
      textStyle: {
        color: '#1D1B20', // on-surface
      },
    },
    legend: {
      data: ['Issues Raised', 'Issues Resolved'],
      textStyle: {
        color: '#49454F', // on-surface-variant
      },
      bottom: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: chartData.dates,
      axisLine: {
        lineStyle: {
          color: '#79747E', // outline
        },
      },
      axisLabel: {
        color: '#49454F', // on-surface-variant
      },
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: true,
        lineStyle: {
          color: '#79747E',
        },
      },
      axisLabel: {
        color: '#49454F',
      },
      splitLine: {
        lineStyle: {
          color: '#F3EDF7', // surface-container
        },
      },
    },
    series: [
      {
        name: 'Issues Raised',
        type: 'line',
        smooth: true,
        data: chartData.raisedData,
        itemStyle: { color: '#625B71' }, // secondary
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: '#625B71' }, { offset: 1, color: 'rgba(98, 91, 113, 0)' }]
          }
        },
      },
      {
        name: 'Issues Resolved',
        type: 'line',
        smooth: true,
        data: chartData.resolvedData,
        itemStyle: { color: '#6750A4' }, // primary
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: '#6750A4' }, { offset: 1, color: 'rgba(103, 80, 164, 0)' }]
          }
        },
      },
    ],
  };

  return (
    <div className="bg-surface rounded-2xl shadow-sm p-4">
      <h3 className="text-lg font-semibold text-on-surface mb-2">30-Day Issue Trend</h3>
      <p className="text-sm text-on-surface-variant mb-4">Comparison of new vs. resolved issues over the last 30 days.</p>
      <ReactECharts option={option} style={{ height: '350px' }} notMerge={true} lazyUpdate={true} />
    </div>
  );
};

export default IssueTrendChart;
