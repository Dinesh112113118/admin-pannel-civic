export interface User {
  id: string;
  username: string;
  email: string;
  department: 'Electrical' | 'Sewer' | 'Road & Transport' | 'Water' | 'Sanitation' | 'Administration';
  role: 'Administrator' | 'Department Head' | 'Supervisor' | 'Staff';
  shift: 'Morning' | 'Evening' | 'Night' | 'Flexible';
  location: string;
  lastLogin?: Date;
  joinDate: Date;
  about: string;
  avatarUrl: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  department: User['department'];
  role: User['role'];
  shift: User['shift'];
  location: string;
}
