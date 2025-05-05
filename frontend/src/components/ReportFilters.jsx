// src/components/ReportFilters.jsx
import React from 'react';

export default function ReportFilters({ startDate, endDate, onChange }) {
  return (
    <div className="flex gap-4 items-end mb-4">
      <div>
        <label className="block text-sm">From</label>
        <input
          type="date"
          value={startDate}
          onChange={e => onChange({ startDate: e.target.value, endDate })}
          className="border p-2 rounded"
        />
      </div>
      <div>
        <label className="block text-sm">To</label>
        <input
          type="date"
          value={endDate}
          onChange={e => onChange({ startDate, endDate: e.target.value })}
          className="border p-2 rounded"
        />
      </div>
    </div>
  );
}
