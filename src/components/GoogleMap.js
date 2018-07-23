import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';

export function GoogleMap({
  google,
  zoom,
  center,
  onMarkerClick,
  onMapClicked,
  showingInfoWindow,
  onInfoWindowClose,
  locationMarkers,
  activeMarker,
  selectedPlace
}) {
  return (
    <Map
      google={google}
      zoom={zoom}
      onClick={onMapClicked}
      initialCenter={center}
    >
      {locationMarkers}
      <InfoWindow
        marker={activeMarker}
        visible={showingInfoWindow}
        onClose={onInfoWindowClose}
      >
        <div>
          <h1>{selectedPlace.name}</h1>
          <h2>Address here</h2>
        </div>
      </InfoWindow>
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBAxbjkY2XIFNOn1V6hVxUuKpsZoX9i28E'
})(GoogleMap);
