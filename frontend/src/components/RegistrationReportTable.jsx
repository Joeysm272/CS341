// src/components/RegistrationReportTable.jsx
import React from 'react';

export default function RegistrationReportTable({ data }) {
  if (!data.length) {
    return <p className="text-gray-500">No registrations in this range.</p>;
  }
  const fmt = iso => new Date(iso).toLocaleDateString();
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2 border">Member</th>
            <th className="px-4 py-2 border">Program</th>
            <th className="px-4 py-2 border">Type</th>
            <th className="px-4 py-2 border">Class Dates</th>
            <th className="px-4 py-2 border">Registered On</th>
          </tr>
        </thead>
        <tbody>
          {data.map(r => (
            <tr key={r._id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border">
                {r.memberId.firstName} {r.memberId.lastName}
              </td>
              <td className="px-4 py-2 border">{r.programId.programName}</td>
              <td className="px-4 py-2 border">{r.programId.type}</td>
              <td className="px-4 py-2 border">
                {fmt(r.programId.startDate)} – {fmt(r.programId.endDate)}
              </td>
              <td className="px-4 py-2 border">{fmt(r.registrationDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
