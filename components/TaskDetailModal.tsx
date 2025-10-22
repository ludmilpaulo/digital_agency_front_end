"use client";

import { useState, useEffect } from 'react';
import { FaTimes, FaClock, FaCheckCircle, FaComment, FaFile, FaUser } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { baseAPI } from '@/useAPI/api';

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  due_date?: string;
  start_date?: string;
  estimated_hours?: number;
  actual_hours?: number;
  progress_percentage: number;
  is_overdue: boolean;
  assignees: Array<{ id: number; username: string; email: string }>;
  created_by?: { id: number; username: string };
  tags?: string;
  list?: number;
  comments_count: number;
}

interface Comment {
  id: number;
  user: { id: number; username: string };
  text: string;
  comment_type: string;
  hours_logged?: number;
  created: string;
}

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
  userId?: number;
}

export default function TaskDetailModal({ task, onClose, onUpdate, userId }: TaskDetailModalProps) {
  const [status, setStatus] = useState(task.status);
  const [description, setDescription] = useState(task.description);
  const [isUpdating, setIsUpdating] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [hoursToLog, setHoursToLog] = useState('');
  const [showTimeLog, setShowTimeLog] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);

  const statusOptions = [
    'Not Started',
    'In Progress',
    'Under Review',
    'On Hold',
    'Completed',
    'Failed'
  ];

  const priorityColors = {
    Low: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    High: 'bg-orange-100 text-orange-800',
    Urgent: 'bg-red-100 text-red-800'
  };

  const statusColors = {
    'Not Started': 'bg-gray-100 text-gray-800',
    'In Progress': 'bg-blue-100 text-blue-800',
    'Under Review': 'bg-purple-100 text-purple-800',
    'On Hold': 'bg-yellow-100 text-yellow-800',
    'Completed': 'bg-green-100 text-green-800',
    'Failed': 'bg-red-100 text-red-800'
  };

  useEffect(() => {
    fetchComments();
  }, [task.id]);

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await fetch(`${baseAPI}/task/cards/${task.id}/comments/`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${baseAPI}/task/cards/${task.id}/update_status/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          comment: `Status updated to ${newStatus}`
        })
      });

      if (response.ok) {
        setStatus(newStatus);
        toast.success(`Task status updated to ${newStatus}`);
        fetchComments(); // Refresh comments
        onUpdate();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogTime = async () => {
    if (!hoursToLog || parseFloat(hoursToLog) <= 0) {
      toast.error('Please enter valid hours');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`${baseAPI}/task/cards/${task.id}/log_time/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hours: parseFloat(hoursToLog),
          comment: `Logged ${hoursToLog} hours`
        })
      });

      if (response.ok) {
        toast.success(`Logged ${hoursToLog} hours`);
        setHoursToLog('');
        setShowTimeLog(false);
        fetchComments();
        onUpdate();
      } else {
        toast.error('Failed to log time');
      }
    } catch (error) {
      console.error('Error logging time:', error);
      toast.error('Failed to log time');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`${baseAPI}/task/cards/${task.id}/add_comment/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newComment,
          comment_type: 'comment',
          card: task.id
        })
      });

      if (response.ok) {
        toast.success('Comment added');
        setNewComment('');
        fetchComments();
      } else {
        toast.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCommentIcon = (type: string) => {
    switch (type) {
      case 'status_update':
        return '🔄';
      case 'time_log':
        return '⏱️';
      case 'file_upload':
        return '📎';
      case 'system':
        return '🤖';
      default:
        return '💬';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{task.title}</h2>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status as keyof typeof statusColors] || statusColors['Not Started']}`}>
                {status}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${priorityColors[task.priority as keyof typeof priorityColors] || priorityColors.Medium}`}>
                {task.priority} Priority
              </span>
              {task.is_overdue && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-600 text-white">
                  ⚠️ Overdue
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Progress Bar */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span className="font-semibold">{task.progress_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${task.progress_percentage}%` }}
              />
            </div>
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-600">Start Date</label>
                <p className="text-gray-900">{formatDate(task.start_date)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Due Date</label>
                <p className="text-gray-900">{formatDate(task.due_date)}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Estimated Hours</label>
                <p className="text-gray-900">{task.estimated_hours || 'Not set'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-sm font-semibold text-gray-600">Actual Hours</label>
                <p className="text-gray-900">{task.actual_hours || 0} hours</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Assigned To</label>
                <div className="flex gap-2 flex-wrap mt-1">
                  {task.assignees.map(assignee => (
                    <span key={assignee.id} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-sm">
                      <FaUser className="inline mr-1" size={12} />
                      {assignee.username}
                    </span>
                  ))}
                </div>
              </div>
              {task.tags && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Tags</label>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {task.tags.split(',').map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-semibold text-gray-600 block mb-2">Description</label>
            <div 
              className="prose max-w-none bg-gray-50 p-4 rounded-lg"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          {/* Action Buttons */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            
            {/* Status Update */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Update Status
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusUpdate(e.target.value)}
                disabled={isUpdating}
                className="w-full md:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            {/* Time Logging */}
            <div className="mb-4">
              {!showTimeLog ? (
                <button
                  onClick={() => setShowTimeLog(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FaClock />
                  Log Time
                </button>
              ) : (
                <div className="bg-green-50 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Hours Worked
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      value={hoursToLog}
                      onChange={(e) => setHoursToLog(e.target.value)}
                      placeholder="e.g., 2.5"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleLogTime}
                      disabled={isUpdating}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Log
                    </button>
                    <button
                      onClick={() => {
                        setShowTimeLog(false);
                        setHoursToLog('');
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 flex-wrap">
              {status !== 'In Progress' && (
                <button
                  onClick={() => handleStatusUpdate('In Progress')}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <FaCheckCircle />
                  Start Task
                </button>
              )}
              {status !== 'Completed' && status !== 'Not Started' && (
                <button
                  onClick={() => handleStatusUpdate('Completed')}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <FaCheckCircle />
                  Mark Complete
                </button>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FaComment />
              Comments ({comments.length})
            </h3>

            {/* Add Comment */}
            <div className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={handleAddComment}
                disabled={isUpdating || !newComment.trim()}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Add Comment
              </button>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {isLoadingComments ? (
                <p className="text-gray-500 text-center py-4">Loading comments...</p>
              ) : comments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No comments yet</p>
              ) : (
                comments.map(comment => (
                  <div key={comment.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{getCommentIcon(comment.comment_type)}</span>
                        <span className="font-semibold text-gray-900">{comment.user.username}</span>
                        {comment.hours_logged && (
                          <span className="text-sm text-green-600 font-semibold">
                            +{comment.hours_logged}h
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(comment.created).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

