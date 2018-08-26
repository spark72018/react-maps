import React, { Component } from 'react';
import { Map, Marker, InfoWindow } from 'google-maps-react';
import { arraysEqualByProperty } from '../utilityFns';

class GoogleMap extends Component {
  constructor() {
    super();
    this.state = {
      markersArr: [],
      markerRefsArr: [],
      mapRef: React.createRef()
    };
  }
  
  componentDidMount() {
    const {
      mapRef: {
        current: {
          refs: {
            map: { firstChild: container }
          }
        }
      }
    } = this.state;
    const { setMapError } = this.props;
    const appContainer = this.state.mapRef.current.refs.map.parentNode;
    
    appContainer.setAttribute('role', 'application');
    appContainer.setAttribute('tabindex', '-1');
    
    window.setTimeout(() => {
      if (container.firstChild.classList.contains('gm-err-container')) {
        setMapError(true);
      }
    }, 2000);
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
      /*
      - create an array of refs for each marker element in currentMarkers
      - used 'await' because sometimes the next setState on line 59
        would finish before the setState on line 66 would finish
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
        ref={this.state.mapRef}
        onReady={this.handleReady}
        google={google}
        zoom={zoom}
        onClick={onMapClicked}
        initialCenter={center}
        style={style}
        className='map-container'
        role='application'
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
