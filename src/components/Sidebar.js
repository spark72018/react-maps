import React from 'react';
import FilterSearchInput from './FilterSearchInput';
import ListView from './ListView';

export default function Sidebar({ textValue, handleFilterTextChange }) {
  return (
    <div className="sidebar">
      <FilterSearchInput
        textValue={textValue}
        handleFilterTextChange={handleFilterTextChange}
      />
      <ListView />
    </div>
  );
}
