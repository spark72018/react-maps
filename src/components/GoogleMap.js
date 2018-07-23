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
      <Marker onClick={onMarkerClick} name={'Current location'} />
      <Marker
        onClick={onMarkerClick}
        title={'The marker`s title will appear as a tooltip.'}
        name={'SOMA'}
        position={{ lat: 37.778519, lng: -122.40564 }}
      />
      <Marker
        onClick={onMarkerClick}
        name={'Dolores park'}
        position={{ lat: 37.759703, lng: -122.428093 }}
      />
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
