import React from 'react';

export default function ListView({ markersToShow, handleListItemClick }) {
  
  return (
    <ul className="list-locations" onClick={handleListItemClick}>
      {markersToShow ? markersToShow.map(makeClickableItems) : null}
    </ul>
  );

  function makeClickableItems({ markerInfo }, idx) {
    const { name, address } = markerInfo;

    return (
      <li data-location-number={idx} key={`listItem${idx}`}>
        <h2 className="list-item name">{name}</h2>
        <h3 className="list-item address">{address}</h3>
      </li>
    );
  }
}
