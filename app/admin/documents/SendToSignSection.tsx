'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Document } from '@/services/documentService';
import { sendInvite } from '@/services/inviteService';
import { fetchUsers } from '@/services/userService';

import { XMarkIcon } from '@heroicons/react/24/solid';
import { User } from '@/types/groups';

interface Props {
  documents: Document[];
  onLoading: (state: boolean) => void;
}

const SendToSignSection: React.FC<Props> = ({ documents, onLoading }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [selectedDocId, setSelectedDocId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers()
      .then((res) => setUsers(res.data))
      .catch(() => {});
  }, []);

  const handleAddEmail = () => {
    const email = emailInput.trim();
    if (email && !emails.includes(email)) {
      setEmails([...emails, email]);
    }
    setEmailInput('');
  };
  const auth_user = useSelector((state: RootState) => state.auth.user);
  const userId = auth_user?.user_id;
  
  const handleSubmit = async () => {
    if (!selectedDocId) return alert('Please select a document.');
    if (selectedUsers.length === 0 && emails.length === 0) {
      return alert('Select at least one user or email.');
    }
  
    if (!userId) {
      alert('You must be logged in to send invites.');
      return;
    }
  
    const recipients = [...emails, ...selectedUsers.map((u) => u.email)];
  
    try {
      onLoading(true);
      for (const email of recipients) {
        await sendInvite({ email, documentId: selectedDocId, user_id: userId }); // ✅ added user_id
      }
      alert('Invites sent!');
      setSelectedUsers([]);
      setEmails([]);
      setSelectedDocId(null);
    } catch {
      alert('Failed to send invites.');
    } finally {
      onLoading(false);
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Send for Signature</h2>

      {/* Select Document */}
      <div>
        <label className="text-sm font-semibold block mb-1 text-gray-700">Select Document</label>
        
        {/* Document List with Visual Indicators */}
        <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
          {documents.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-red-500">No documents available. Please upload a document first.</p>
            </div>
          ) : (
            documents.map((doc) => (
              <label
                key={doc.id}
                className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer transition ${
                  selectedDocId === doc.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                }`}
              >
                <input
                  type="radio"
                  name="document"
                  value={doc.id}
                  checked={selectedDocId === doc.id}
                  onChange={() => setSelectedDocId(doc.id)}
                  className="mr-3 w-4 h-4 text-blue-600"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{doc.title}</span>
                    {doc.signed_file ? (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800 border border-green-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Signed
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Pending
                      </span>
                    )}
                  </div>
                  {doc.signed_file && (
                    <p className="text-xs text-gray-500 mt-1">
                      Signed document available for counter-signature
                    </p>
                  )}
                </div>
              </label>
            ))
          )}
        </div>
        
        <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>You can send both signed and unsigned documents. Recipients will receive a signing link.</span>
        </p>
      </div>

      {/* Select Internal Users */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
          <label className="text-sm font-semibold text-gray-800">
            Internal Users (Team Members)
          </label>
        </div>
        
        {users.length === 0 ? (
          <p className="text-sm text-gray-500">No internal users available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {users.map((user) => (
              <label 
                key={user.id} 
                className={`flex items-center space-x-2 p-2 rounded cursor-pointer transition ${
                  selectedUsers.some((u) => u.id === user.id) 
                    ? 'bg-blue-100 border border-blue-300' 
                    : 'bg-white border border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedUsers.some((u) => u.id === user.id)}
                  onChange={(e) =>
                    setSelectedUsers((prev) =>
                      e.target.checked
                        ? [...prev, user]
                        : prev.filter((u) => u.id !== user.id)
                    )
                  }
                  className="w-4 h-4 text-blue-600"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-gray-800 truncate block">
                    {user.username || user.email}
                  </span>
                  {user.username && (
                    <span className="text-xs text-gray-500 truncate block">{user.email}</span>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}
        
        {selectedUsers.length > 0 && (
          <div className="mt-3 p-2 bg-white rounded border border-blue-200">
            <p className="text-xs font-semibold text-blue-800 mb-1">
              Selected: {selectedUsers.length} internal user{selectedUsers.length !== 1 ? 's' : ''}
            </p>
            <div className="flex flex-wrap gap-1">
              {selectedUsers.map((user) => (
                <span
                  key={user.id}
                  className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                >
                  {user.username || user.email}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add External Emails */}
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
          <label className="text-sm font-semibold text-gray-800">
            External Recipients (Email Addresses)
          </label>
        </div>
        
        <div className="flex space-x-2">
          <input
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddEmail()}
            placeholder="Enter external email and press Enter"
            className="flex-1 p-2 border border-amber-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <button 
            onClick={handleAddEmail} 
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded transition"
          >
            Add
          </button>
        </div>
        
        {emails.length > 0 && (
          <div className="mt-3 p-2 bg-white rounded border border-amber-200">
            <p className="text-xs font-semibold text-amber-800 mb-2">
              External recipients: {emails.length}
            </p>
            <div className="flex flex-wrap gap-2">
              {emails.map((email, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full gap-2"
                >
                  {email}
                  <XMarkIcon
                    className="w-4 h-4 cursor-pointer hover:text-amber-900"
                    onClick={() => setEmails(emails.filter((e) => e !== email))}
                  />
                </span>
              ))}
            </div>
          </div>
        )}
        
        <p className="text-xs text-amber-700 mt-2 flex items-start gap-1">
          <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <span>External recipients will receive an email with a signing link</span>
        </p>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Send Invites
        </button>
      </div>
    </div>
  );
};

export default SendToSignSection;
