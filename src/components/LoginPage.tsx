import React, { useState } from 'react';
import { User, Lock, Building2, UserCheck, Clock, MapPin, Eye, EyeOff, AlertCircle } from './icons';
import { LoginCredentials } from '../types/auth';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
    department: 'Administration',
    role: 'Staff',
    shift: 'Morning',
    location: '',
  });

  const departments = [
    { value: 'Administration' as const, label: 'Administration' },
    { value: 'Electrical' as const, label: 'Electrical Department' },
    { value: 'Sewer' as const, label: 'Sewer Department' },
    { value: 'Road & Transport' as const, label: 'Road & Transport' },
    { value: 'Water' as const, label: 'Water Department' },
    { value: 'Sanitation' as const, label: 'Sanitation Department' },
  ];

  const roles = [
    { value: 'Administrator' as const, label: 'Administrator' },
    { value: 'Department Head' as const, label: 'Department Head' },
    { value: 'Supervisor' as const, label: 'Supervisor' },
    { value: 'Staff' as const, label: 'Staff Member' },
  ];

  const shifts = [
    { value: 'Morning' as const, label: 'Morning Shift (6:00 AM - 2:00 PM)' },
    { value: 'Evening' as const, label: 'Evening Shift (2:00 PM - 10:00 PM)' },
    { value: 'Night' as const, label: 'Night Shift (10:00 PM - 6:00 AM)' },
    { value: 'Flexible' as const, label: 'Flexible Hours' },
  ];

  const locations = [
    'Central Zone',
    'North Zone',
    'South Zone',
    'East Zone',
    'West Zone',
    'Headquarters',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!credentials.username || !credentials.password || !credentials.location) {
      setError('Please fill in all required fields');
      return;
    }

    const success = await login(credentials);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const updateCredentials = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary-container/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-on-primary" />
          </div>
          <h1 className="text-2xl font-bold text-on-surface mb-2">Civic Issue Tracker</h1>
          <p className="text-on-surface-variant">Municipal Administration Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-surface rounded-3xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-on-surface mb-6 text-center">Sign In to Your Account</h2>
          
          {error && (
            <div className="bg-error-container text-on-error-container p-3 rounded-xl mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => updateCredentials('username', e.target.value)}
                  className="w-full bg-surface-container border border-outline/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-3 pl-10 pr-4 text-on-surface placeholder:text-on-surface-variant outline-none transition-all"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => updateCredentials('password', e.target.value)}
                  className="w-full bg-surface-container border border-outline/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-3 pl-10 pr-12 text-on-surface placeholder:text-on-surface-variant outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Department</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <select
                  value={credentials.department}
                  onChange={(e) => updateCredentials('department', e.target.value)}
                  className="w-full bg-surface-container border border-outline/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-3 pl-10 pr-4 text-on-surface outline-none transition-all appearance-none cursor-pointer"
                >
                  {departments.map(dept => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Role</label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <select
                  value={credentials.role}
                  onChange={(e) => updateCredentials('role', e.target.value)}
                  className="w-full bg-surface-container border border-outline/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-3 pl-10 pr-4 text-on-surface outline-none transition-all appearance-none cursor-pointer"
                >
                  {roles.map(role => (
                    <option key={role.value} value={role.value}>{role.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shift */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Work Shift</label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <select
                  value={credentials.shift}
                  onChange={(e) => updateCredentials('shift', e.target.value)}
                  className="w-full bg-surface-container border border-outline/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-3 pl-10 pr-4 text-on-surface outline-none transition-all appearance-none cursor-pointer"
                >
                  {shifts.map(shift => (
                    <option key={shift.value} value={shift.value}>{shift.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-on-surface mb-2">Work Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <select
                  value={credentials.location}
                  onChange={(e) => updateCredentials('location', e.target.value)}
                  className="w-full bg-surface-container border border-outline/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl py-3 pl-10 pr-4 text-on-surface outline-none transition-all appearance-none cursor-pointer"
                  required
                >
                  <option value="">Select your work location</option>
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-on-primary font-semibold py-3 px-4 rounded-xl hover:bg-primary/90 focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-on-surface-variant">
              Need help? Contact IT Support at{' '}
              <a href="mailto:it@municipality.gov.in" className="text-primary hover:underline">
                it@municipality.gov.in
              </a>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-secondary-container/20 rounded-2xl">
          <p className="text-sm font-semibold text-on-surface mb-2">Demo Credentials:</p>
          <p className="text-xs text-on-surface-variant">
            Username: <code className="bg-outline/20 px-1 rounded">admin</code> | 
            Password: <code className="bg-outline/20 px-1 rounded">demo123</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
