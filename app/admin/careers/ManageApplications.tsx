'use client';
import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { JobApplication } from '@/types/Career';
import { baseAPI } from '@/useAPI/api';


const fetcher = (url: string) => axios.get(`${baseAPI}${url}`).then(res => res.data);

export default function ManageApplications() {
  const { data: applications, mutate } = useSWR<JobApplication[]>('/careers/job-applications/', fetcher);

  const updateStatus = async (id: number, status: JobApplication['status']) => {
    await axios.patch(`${baseAPI}/careers/job-applications/${id}/`, { status });
    mutate();
  };

  const statusOptions: JobApplication['status'][] = [
    'submitted', 'processing', 'review', 'approved', 'rejected'
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Career</th>
            <th className="p-2">Status</th>
            <th className="p-2">Change</th>
          </tr>
        </thead>
        <tbody>
          {applications?.map((app) => (
            <tr key={app.id} className="border-t">
              <td className="p-2">{app.full_name}</td>
              <td className="p-2">{app.email}</td>
              <td className="p-2">{app.career.title}</td>
              <td className="p-2 capitalize">{app.status}</td>
              <td className="p-2">
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app.id, e.target.value as JobApplication['status'])}
                  className="border p-1"
                >
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
