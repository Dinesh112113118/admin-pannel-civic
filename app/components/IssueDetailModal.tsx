import React, { useState, useEffect } from 'react';
import { Issue } from '../types';
import { X, MapPin, Calendar, User, Phone, AlertCircle, MessageSquare, FileText, Building2, Trash2, UploadCloud, CheckCircle2 } from './icons';
import { useAuth } from '../context/AuthContext';

interface IssueDetailModalProps {
  issue: Issue;
  isOpen: boolean;
  onClose: () => void;
  onUpdateIssue: (issueId: string, updates: Partial<Issue>) => void;
  onDeleteIssue: (issueId: string) => void;
}

const IssueDetailModal: React.FC<IssueDetailModalProps> = ({ issue, isOpen, onClose, onUpdateIssue, onDeleteIssue }) => {
  const { user } = useAuth();
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [resolutionImage, setResolutionImage] = useState<File | null>(null);
  const [resolutionImagePreview, setResolutionImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (issue) {
      setResolutionNotes('');
      setResolutionImage(null);
      setResolutionImagePreview(null);
    }
  }, [issue]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResolutionImage(file);
      setResolutionImagePreview(URL.createObjectURL(file));
    }
  };

  const handleResolveSubmit = () => {
    if (!resolutionImage || !resolutionNotes) {
      alert('Please provide resolution notes and an image.');
      return;
    }
    onUpdateIssue(issue.id, {
      status: 'Resolved',
      resolvedAt: new Date(),
      resolvedImageUrl: resolutionImagePreview,
      resolutionNotes,
      resolvedBy: user?.username || 'Staff',
    });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this issue? This action cannot be undone.')) {
      onDeleteIssue(issue.id);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: Issue['status']) => {
    switch (status) {
      case 'Pending': return 'bg-red-100 text-red-800 border-red-200';
      case 'In Progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Error': return 'bg-slate-100 text-slate-800 border-slate-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-outline/20 sticky top-0 bg-surface z-10">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Issue Details</h2>
            <p className="text-on-surface-variant">Complete information about this civic issue</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-black/5 transition-colors">
            <X className="w-6 h-6 text-on-surface-variant" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-on-surface mb-3">Issue Photo (Before)</h3>
                <img src={issue.imageUrl} alt={issue.title} className="w-full h-64 object-cover rounded-2xl border border-outline/20"/>
              </div>

              {issue.status === 'Resolved' && issue.resolvedImageUrl && (
                <div>
                  <h3 className="text-lg font-semibold text-on-surface mb-3">Resolution Photo (After)</h3>
                  <img src={issue.resolvedImageUrl} alt="Resolved issue" className="w-full h-64 object-cover rounded-2xl border border-outline/20"/>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-on-surface mb-4">Basic Information</h3>
                <div className="space-y-4">
                  {/* ... other info items */}
                  <div className="flex items-start gap-3 p-4 bg-surface-container rounded-xl">
                    <FileText className="w-5 h-5 text-primary mt-0.5" />
                    <div><p className="font-medium text-on-surface">Issue ID</p><p className="text-on-surface-variant">{issue.id}</p></div>
                  </div>
                  <div className="flex items-start gap-3 p-4 bg-surface-container rounded-xl">
                    <Building2 className="w-5 h-5 text-primary mt-0.5" />
                    <div><p className="font-medium text-on-surface">Department</p><p className="text-on-surface-variant">{issue.department}</p></div>
                  </div>
                   <div className="flex items-start gap-3 p-4 bg-surface-container rounded-xl">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div><p className="font-medium text-on-surface">Submitted At</p><p className="text-on-surface-variant">{formatDate(issue.submittedAt)}</p></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-container rounded-xl">
                      <p className="font-medium text-on-surface mb-2">Status</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(issue.status)}`}>{issue.status}</span>
                    </div>
                    <div className="p-4 bg-surface-container rounded-xl">
                      <p className="font-medium text-on-surface mb-2">Priority</p>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(issue.priority)}`}>{issue.priority}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-on-surface mb-4">Issue Description</h3>
                <div className="p-4 bg-surface-container rounded-xl">
                  <h4 className="font-medium text-on-surface mb-2">{issue.title}</h4>
                  <p className="text-on-surface-variant leading-relaxed">{issue.description}</p>
                </div>
              </div>

              {issue.status === 'Resolved' && (
                <div>
                  <h3 className="text-lg font-semibold text-on-surface mb-4">Resolution Details</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-surface-container rounded-xl">
                      <p className="font-medium text-on-surface mb-2">Resolved By</p>
                      <p className="text-on-surface-variant">{issue.resolvedBy}</p>
                    </div>
                    <div className="p-4 bg-surface-container rounded-xl">
                      <p className="font-medium text-on-surface mb-2">Resolution Notes</p>
                      <p className="text-on-surface-variant leading-relaxed">{issue.resolutionNotes}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold text-on-surface mb-4">Location Details</h3>
                <div className="space-y-4">
                  {/* ... location items */}
                   <div className="flex items-start gap-3 p-4 bg-surface-container rounded-xl">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div><p className="font-medium text-on-surface">Address</p><p className="text-on-surface-variant">{issue.locationAddress}</p></div>
                  </div>
                   <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-container rounded-xl"><p className="font-medium text-on-surface mb-1">Latitude</p><p className="text-on-surface-variant text-sm">{issue.location.lat.toFixed(6)}</p></div>
                    <div className="p-4 bg-surface-container rounded-xl"><p className="font-medium text-on-surface mb-1">Longitude</p><p className="text-on-surface-variant text-sm">{issue.location.lng.toFixed(6)}</p></div>
                  </div>
                </div>
              </div>

              {issue.notes && (
                <div>
                  <h3 className="text-lg font-semibold text-on-surface mb-4">Additional Notes</h3>
                  <div className="flex items-start gap-3 p-4 bg-surface-container rounded-xl">
                    <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                    <div><p className="text-on-surface-variant leading-relaxed">{issue.notes}</p></div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Section */}
          <div className="mt-8 pt-6 border-t border-outline/20">
            {issue.status === 'Pending' && (
              <div className="flex flex-wrap gap-4">
                <button onClick={() => onUpdateIssue(issue.id, { status: 'In Progress' })} className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                  Dispatch to Department
                </button>
                <button onClick={() => onUpdateIssue(issue.id, { status: 'Error' })} className="flex items-center gap-2 text-error px-6 py-3 rounded-xl font-medium hover:bg-error-container transition-colors">
                  <AlertCircle className="w-5 h-5" /> Mark as Error
                </button>
              </div>
            )}
            
            {issue.status === 'In Progress' && (
              <div>
                <h3 className="text-lg font-semibold text-on-surface mb-4">Resolve Issue</h3>
                <div className="p-6 bg-surface-container rounded-2xl space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Resolution Notes</label>
                    <textarea
                      value={resolutionNotes}
                      onChange={(e) => setResolutionNotes(e.target.value)}
                      placeholder="Describe the work that was done to resolve the issue..."
                      className="w-full bg-surface border border-outline/30 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl p-3 text-on-surface placeholder:text-on-surface-variant outline-none transition-all"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface mb-2">Upload Proof of Resolution</label>
                    <div className="mt-2 flex justify-center rounded-xl border-2 border-dashed border-outline/50 px-6 py-10">
                      <div className="text-center">
                        {resolutionImagePreview ? (
                          <img src={resolutionImagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-lg object-cover" />
                        ) : (
                          <UploadCloud className="mx-auto h-12 w-12 text-on-surface-variant" />
                        )}
                        <div className="mt-4 flex text-sm leading-6 text-on-surface-variant">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary/50 focus-within:ring-offset-2 hover:text-primary/80">
                            <span>Upload a file</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs leading-5 text-on-surface-variant/80">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-4">
                    <button onClick={handleResolveSubmit} className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
                      <CheckCircle2 className="w-5 h-5" /> Submit Resolution
                    </button>
                    <button onClick={() => onUpdateIssue(issue.id, { status: 'Error' })} className="flex items-center gap-2 text-error px-6 py-3 rounded-xl font-medium hover:bg-error-container transition-colors">
                      <AlertCircle className="w-5 h-5" /> Mark as Error
                    </button>
                  </div>
                </div>
              </div>
            )}

            {issue.status === 'Error' && user?.role === 'Administrator' && (
              <button onClick={handleDelete} className="flex items-center gap-2 bg-error text-on-error px-6 py-3 rounded-xl font-medium hover:bg-opacity-90 transition-colors">
                <Trash2 className="w-5 h-5" /> Delete Permanently
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueDetailModal;
