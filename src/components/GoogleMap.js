import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export function GoogleMap({
  google,
  zoom,
  center,
  style,
  onMarkerClick,
  onMapClicked,
  showingInfoWindow,
  onInfoWindowClose,
  locationMarkers,
  activeMarker,
  manualInfoWindowInfo
}) {
  const { name, address } = activeMarker;
  let infoWindow;

  if (name) {
    infoWindow = (
      <InfoWindow
        marker={activeMarker}
        visible={showingInfoWindow}
        onClose={onInfoWindowClose}
      >
        <div>
          <h1>{name}</h1>
          <h2>{address}</h2>
        </div>
      </InfoWindow>
    );
  } else if (manualInfoWindowInfo) {
    const { position, name, address } = manualInfoWindowInfo;
    infoWindow = (
      <InfoWindow
        position={position}
        visible={showingInfoWindow}
        onClose={onInfoWindowClose}
      >
        <div>
          <h1>{name}</h1>
          <h2>{address}</h2>
        </div>
      </InfoWindow>
    );
  }

  function getMarker({ marker }) {
    return marker;
  }
  return (
    <Map
      google={google}
      zoom={zoom}
      onClick={onMapClicked}
      initialCenter={center}
      style={style}
      className={'map-container'}
    >
      {locationMarkers.map(getMarker)}
      {infoWindow}
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBAxbjkY2XIFNOn1V6hVxUuKpsZoX9i28E'
})(GoogleMap);
