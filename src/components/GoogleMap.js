import React, { Component } from 'react';
import { Map, Marker, InfoWindow, GoogleApiWrapper } from 'google-maps-react';
import { isEmpty, arraysEqualByProperty } from '../utilityFns';

class GoogleMap extends Component {
  constructor() {
    super();
    this.state = {
      markersArr: [],
      markerRefsArr: []
    };
  }

  // returns Boolean
  sameVenueNames(arr1, arr2) {
    return arraysEqualByProperty('name', arr1, arr2);
  }

  async componentDidUpdate(prevProps) {
    const currentMarkers = this.props.markerInfoArr;
    const previousMarkers = prevProps.markerInfoArr;
    const arrayLengthsDifferent =
      currentMarkers.length !== previousMarkers.length;
    const venueNamesDifferent = !this.sameVenueNames(
      currentMarkers,
      previousMarkers
    );
    if (arrayLengthsDifferent || venueNamesDifferent) {
      console.log('componentDidUpdate');
      /*
      - create an array of refs for each marker element in currentMarkers
      - used 'await' because sometimes the next setState on line 48
        would finish before the setState on line 41 would finish
      */
      await this.setState({
        markerRefsArr: currentMarkers.map(obj => React.createRef())
      });

      const { markerRefsArr } = this.state;

      // create <Marker/> elements with refs
      return this.setState({
        markersArr: currentMarkers.map(({ markerInfo }, idx) => (
          <Marker
            key={`marker${idx}`}
            ref={markerRefsArr[idx]}
            onClick={this.props.onMarkerClick}
            {...markerInfo}
          />
        ))
      });
    }
  }

  render() {
    const { markersArr } = this.state;
    const {
      google,
      zoom,
      onMapClicked,
      center,
      style,
      activeMarker,
      showingInfoWindow,
      onInfoWindowClose
    } = this.props;

    return (
      <Map
        google={google}
        zoom={zoom}
        onClick={onMapClicked}
        initialCenter={center}
        style={style}
        className={'map-container'}
      >
        {markersArr}
        <InfoWindow
          marker={activeMarker}
          visible={showingInfoWindow}
          onClose={onInfoWindowClose}
        >
          <div>
            <h2>{activeMarker && activeMarker.name}</h2>
            <h3>{activeMarker && activeMarker.address}</h3>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleMap;
