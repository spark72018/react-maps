import React from 'react';
import { TextFilter } from 'react-text-filter';
import ListView from './ListView';

export default function Sidebar({
  filterText,
  markersToShow,
  open,
  handleFilterTextChange,
  handleListItemClick
}) {
  return (
    <div className={open ? 'sidebar open' : 'sidebar'} aria-hidden={!open}>
      <TextFilter value={filterText} onFilter={handleFilterTextChange} />

      <ListView
        markersToShow={markersToShow}
        handleListItemClick={handleListItemClick}
      />
    </div>
  );
}
