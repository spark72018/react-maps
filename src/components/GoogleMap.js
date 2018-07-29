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
  console.log('GoogleMaps activeMarker', activeMarker);
  console.log('GoogleMaps manualInfoWindow', manualInfoWindowInfo);
  console.log('GoogleMaps showingInfoWindow', showingInfoWindow);
  let infoWindow;

  if (name) {
    console.log('there is activeMarker name');
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
    infoWindow = (
      <InfoWindow
        position={manualInfoWindowInfo.position}
        visible={showingInfoWindow}
        onClose={onInfoWindowClose}
      >
        <div>
          <h1>{manualInfoWindowInfo.name}</h1>
          <h2>{manualInfoWindowInfo.address}</h2>
        </div>
      </InfoWindow>
    );
  }
  console.log('infoWindow is', infoWindow);
  return (
    <Map
      google={google}
      zoom={zoom}
      onClick={onMapClicked}
      initialCenter={center}
      style={style}
      className={'map-container'}
    >
      {locationMarkers.map(({ marker }) => marker)}
      {infoWindow}
    </Map>
  );
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBAxbjkY2XIFNOn1V6hVxUuKpsZoX9i28E'
})(GoogleMap);
