import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const columnOptions = [
  { label: 'SubmissionID', value: 's.Id' },
  { label: 'ຊື່', value: 'p.Name' },
  { label: 'ໜ້າທີຮັບຜິດຊອບ', value: 'p.Responsibility' },
  { label: 'ຫ້ອງການ', value: 'p.Office' }
];

const conditionOptions = [
  { label: 'Equals', value: 'equals' },
  { label: 'Contains', value: 'contains' },
  { label: 'Greater than', value: 'gt' },
  { label: 'Less than', value: 'lt' }
];

function FilterPanel({ filters, setFilters }) {   // 👈 function starts
  const [newFilter, setNewFilter] = useState({
    column: 'p.Name',
    condition: 'contains',
    value: ''
  });

  const addFilter = () => {
    if (newFilter.value.trim()) {
      setFilters([...filters, newFilter]);
      setNewFilter({ column: 'p.Name', condition: 'contains', value: '' });
    }
  };

  const removeFilter = (index) => {
    const updated = [...filters];
    updated.splice(index, 1);
    setFilters(updated);
  };

  // 👇 make sure return is inside the function
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <select
          value={newFilter.column}
          onChange={e => setNewFilter({ ...newFilter, column: e.target.value })}
        >
          {columnOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={newFilter.condition}
          onChange={e => setNewFilter({ ...newFilter, condition: e.target.value })}
        >
          {conditionOptions.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={newFilter.value}
          onChange={e => setNewFilter({ ...newFilter, value: e.target.value })}
          placeholder="Value"
        />
        <button className='btn btn-primary btn-sm me-2' onClick={addFilter}>Add</button>
      </div>

      {filters.map((filter, index) => {
        const columnLabel = columnOptions.find(opt => opt.value === filter.column)?.label || filter.column;
        const conditionLabel = conditionOptions.find(opt => opt.value === filter.condition)?.label || filter.condition;

        return (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', border: '1px solid #ccc', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
            <span>{columnLabel} {conditionLabel} {filter.value}</span>
            <button className='btn btn-primary btn-sm me-2' onClick={() => removeFilter(index)} style={{ marginLeft: '0.25rem' }}>✕</button>
          </div>
        );
      })}
    </div>
  );
}   // 👈 this closes the function

export default FilterPanel;   // 👈 this must come after the function
