import React from 'react';
import { TextFilter } from 'react-text-filter';
import FilterSearchInput from './FilterSearchInput';
import ListView from './ListView';

export default function Sidebar({
  textValue,
  markersArray,
  handleFilterTextChange,
  handleListItemClick
}) {
  return (
    <div className="sidebar">
      <FilterSearchInput
        textValue={textValue}
        handleFilterTextChange={handleFilterTextChange}
      />
      
      <ListView
        markersArray={markersArray}
        handleListItemClick={handleListItemClick}
      />
    </div>
  );
}
