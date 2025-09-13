import { faker } from '@faker-js/faker';
import { Issue, Notification } from '../types';
import { Zap, Trash, Truck, CheckCircle2, AlertCircle } from '../components/icons';

const departments = ['Electrical', 'Sewer', 'Road & Transport', 'Water', 'Sanitation'] as const;
const priorities = ['Low', 'Medium', 'High', 'Critical'] as const;

const sampleQuestions = [
  'When will this be fixed?',
  'Is this a safety hazard?',
  'Should I evacuate the area?',
  'Who is responsible for maintenance?',
  'How long has this been an issue?',
  'Is there a temporary solution?',
  'What caused this problem?',
  'Will there be any service interruption?'
];

const sampleNotes = [
  'This issue has been recurring for the past few weeks.',
  'Residents in the area have been complaining about this.',
  'The problem seems to worsen during peak hours.',
  'This is affecting multiple households in the vicinity.',
  'Emergency response may be required.',
  'Previous repairs were unsuccessful.',
  'Weather conditions may have contributed to this issue.',
  'Local business operations are being impacted.'
];

const sampleResolutionNotes = [
  'Replaced the faulty transformer. Power restored.',
  'Cleared the blockage and sanitized the area.',
  'Patched the pothole and resurfaced the immediate area.',
  'Fixed the leaking pipe. Water supply is back to normal.',
  'Emptied the overflowing bin and scheduled more frequent pickups.'
];

export const createRandomIssue = (): Issue => {
  const lat = faker.location.latitude({ min: 16.48, max: 16.52 });
  const lng = faker.location.longitude({ min: 80.63, max: 80.67 });
  const status = faker.helpers.arrayElement(['Pending', 'In Progress', 'Resolved', 'Error']);
  const submittedAt = faker.date.recent({ days: 30 });
  
  let resolvedAt: Date | null = null;
  let resolvedImageUrl: string | null = null;
  let resolutionNotes: string | null = null;
  let resolvedBy: string | null = null;

  if (status === 'Resolved') {
    resolvedAt = faker.date.between({ from: submittedAt, to: new Date() });
    resolvedImageUrl = `https://picsum.photos/seed/${faker.string.uuid()}/400/400`;
    resolutionNotes = faker.helpers.arrayElement(sampleResolutionNotes);
    resolvedBy = faker.person.fullName();
  }

  return {
    id: faker.string.alphanumeric(5).toUpperCase(),
    title: faker.lorem.sentence(4),
    description: faker.lorem.paragraph(),
    department: faker.helpers.arrayElement(departments),
    status,
    location: { lat, lng },
    locationAddress: `${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.zipCode()}`,
    distance: parseFloat(faker.number.float({ min: 0.5, max: 10, precision: 0.1 }).toFixed(1)),
    imageUrl: `https://picsum.photos/seed/${faker.string.uuid()}/400/400`,
    submittedAt,
    resolvedAt,
    userId: `USR${faker.string.alphanumeric(6).toUpperCase()}`,
    userContact: faker.phone.number('9#########'),
    notes: faker.helpers.arrayElement(sampleNotes),
    questions: faker.helpers.arrayElements(sampleQuestions, { min: 0, max: 3 }),
    priority: faker.helpers.arrayElement(priorities),
    resolvedImageUrl,
    resolutionNotes,
    resolvedBy,
  };
};

export const generateIssues = (count: number): Issue[] => {
  return Array.from({ length: count }, createRandomIssue);
};

export const generateNotifications = (count: number, issues: Issue[]): Notification[] => {
  const issueRelatedTemplates = [
    { icon: Zap, title: 'New Electrical Issue', baseDesc: 'A new high-priority electrical issue has been reported.' },
    { icon: Trash, title: 'Sanitation Task Completed', baseDesc: 'was marked as resolved.' },
    { icon: Truck, title: 'Dispatch Alert', baseDesc: 'A road & transport issue has been dispatched to your team.' },
    { icon: AlertCircle, title: 'Critical Alert', baseDesc: 'A critical sewer issue requires immediate attention near' }
  ];

  const systemTemplates = [
    { icon: CheckCircle2, title: 'System Update', description: 'The admin panel has been updated to v1.1.0.' }
  ];

  const notifications: Notification[] = [];

  for (let i = 0; i < count; i++) {
    const isIssueRelated = faker.datatype.boolean({ probability: 0.8 }) && issues.length > 0;
    let notification: Notification;

    if (isIssueRelated) {
      const template = faker.helpers.arrayElement(issueRelatedTemplates);
      const randomIssue = faker.helpers.arrayElement(issues);
      
      let description = template.baseDesc;
      if (template.title.includes('Completed')) {
        description = `Issue #${randomIssue.id} ${template.baseDesc}`;
      } else if (template.title.includes('Alert')) {
        description = `${template.baseDesc} ${randomIssue.locationAddress.split(',')[0]}`;
      } else {
        description = `${template.baseDesc} (ID: #${randomIssue.id})`;
      }

      notification = {
        id: faker.string.uuid(),
        issueId: randomIssue.id,
        icon: template.icon,
        title: template.title,
        description,
        timestamp: faker.date.recent({ days: 3 }),
        read: faker.datatype.boolean({ probability: 0.3 }),
      };
    } else {
      const template = faker.helpers.arrayElement(systemTemplates);
      notification = {
        id: faker.string.uuid(),
        icon: template.icon,
        title: template.title,
        description: template.description,
        timestamp: faker.date.recent({ days: 3 }),
        read: faker.datatype.boolean({ probability: 0.3 }),
      };
    }
    notifications.push(notification);
  }
  return notifications;
};
