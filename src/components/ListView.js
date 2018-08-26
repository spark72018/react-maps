import React from 'react';

export default function ListView({ markersToShow, handleListItemClick }) {
  
  return (
    <ul className='list-locations' role='menubar' onClick={handleListItemClick}>
      {markersToShow ? markersToShow.map(makeClickableItems) : null}
    </ul>
  );

  function makeClickableItems({ markerInfo }, idx) {
    const { name, address } = markerInfo;

    return (
      <li tabIndex='0' data-location-number={idx} role='menuitem' key={`listItem${idx}`}>
        <h2 className='list-item name'>{name}</h2>
        <h3 className='list-item address'>{address}</h3>
      </li>
    );
  }
}
