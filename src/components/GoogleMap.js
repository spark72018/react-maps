import React from 'react';
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
  markerWindowInfo
}) {
  const { name, address } = activeMarker;
  const infoWindowStyle = {
    backgroundColor: 'red'
  };
  let infoWindow;

  if (name) {
    infoWindow = (
      <InfoWindow
        style={infoWindowStyle}
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
  } else if (markerWindowInfo) {
    const { position, name, address } = markerWindowInfo;
    infoWindow = (
      <InfoWindow
        position={position}
        visible={showingInfoWindow}
        onClose={onInfoWindowClose}
      >
        <div className='location-text'>
          <h2>{name}</h2>
          <h3>{address}</h3>
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
