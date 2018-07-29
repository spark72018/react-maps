import React from 'react';
import { TextFilter } from 'react-text-filter';
import ListView from './ListView';

export default function Sidebar({
  filterText,
  markersArray,
  handleFilterTextChange,
  handleListItemClick
}) {
  return (
    <div className="sidebar">
      <TextFilter value={filterText} onFilter={handleFilterTextChange} />

      <ListView
        markersArray={markersArray}
        handleListItemClick={handleListItemClick}
      />
    </div>
  );
}
