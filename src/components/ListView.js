import React from 'react';

export default function ListView({ markersArray, handleListItemClick }) {
  return (
    <ul className="list-locations" onClick={handleListItemClick}>
      {markersArray ? markersArray.map(makeClickableItems) : null}
    </ul>
  );
  
  function makeClickableItems({ locationNumber, marker }, idx) {
    const { name, address } = marker.props;

    return (
      <li data-location-number={locationNumber} key={`listItem${idx}`}>
        <h2 className="list-item name">{name}</h2>
        <h3 className="list-item address">{address}</h3>
      </li>
    );
  }
}
