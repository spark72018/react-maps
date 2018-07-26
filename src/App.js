import React, { Component } from 'react';
import GoogleMap from './components/GoogleMap';
import Sidebar from './components/Sidebar';
import { Marker } from 'google-maps-react';
import './App.css';

const FOURSQUARE = {
  CLIENT_ID: '0JDWRCHL4O23OVWIBI0W3TUME1JIGNJL4QZDCWW252FK2ICS',
  CLIENT_SECRET: 'HQ0OM52QC3D0Y0D2Y4RG4CG2UL34KVFO15ODVGTBA4KH1QA2'
};

const DEFAULT_CENTER = {
  lat: 40.758896,
  lng: -73.98513
};

const STYLE = {
  width: '500px',
  height: '600px'
};

class App extends Component {
  state = {
    filterText: '',
    showingInfoWindow: false,
    locationMarkers: [],
    activeMarker: {},
    manualInfoWindowInfo: null
  };

  componentDidMount() {
    const { CLIENT_ID, CLIENT_SECRET } = FOURSQUARE;
    const { lat, lng } = DEFAULT_CENTER;

    const firstPartOfApiUrl = 'https://api.foursquare.com/v2/venues/search?';
    const clientIdString = 'client_id=' + CLIENT_ID;
    const clientSecretString = '&client_secret=' + CLIENT_SECRET;
    const coordinateString = '&ll=' + lat + ',' + lng;
    const queryString = '&query=coffee';
    const versioningString = '&v=20180723';
    const limitString = '&limit=5';

    const foursquareUrl =
      firstPartOfApiUrl +
      clientIdString +
      clientSecretString +
      coordinateString +
      queryString +
      versioningString +
      limitString;

    const makeMarkerWithHandler = makeMarker(this.onMarkerClick);

    fetch(foursquareUrl)
      .then(res => res.json())
      .then(res => {
        // console.log('foursquare res is');
        // console.table(res);
        if (res.meta.code !== 200) {
          return console.log('res.meta.code status was not 200', res);
        }

        // 'venues' is an array
        const {
          response: { venues }
        } = res;
        const arrayOfMarkers = venues.map(makeMarkerWithHandler);
        this.setState({
          locationMarkers: arrayOfMarkers
        });
      })
      .catch(e => console.log('error', e));

    function makeMarker(clickHandler) {
      return function(resObj, idx) {
        const { name, location } = resObj;
        const { lat, lng, address, formattedAddress } = location;
        return {
          locationNumber: idx,
          marker: (
            <Marker
              onClick={clickHandler}
              key={`location${idx}`}
              name={name}
              address={address}
              position={{ lat, lng }}
              title={formattedAddress.join(', ')}
            />
          )
        };
      };
    }
  }

  handleFilterTextChange = e => {
    this.setState({
      filterText: e.target.value
    });
  };

  onMarkerClick = (props, marker, e) => {
    console.log('onMarkerClick marker is', marker);
    this.setState({
      activeMarker: marker,
      showingInfoWindow: true
    });
  };

  handleListItemClick = e => {
    const { target } = e;
    const notListItem = !target.classList.contains('list-item');
    if (notListItem) return;

    const tagWithDatasetAttr = target.parentNode;
    const {
      dataset: { locationNumber }
    } = tagWithDatasetAttr;
    const parsedLocationNum = parseInt(locationNumber, 10);
    const { locationMarkers } = this.state;
    const chosenMarker = findLocationMarker(parsedLocationNum, locationMarkers);
    const { position, name, address } = chosenMarker.props;
    return this.setState(
      {
        manualInfoWindowInfo: {
          position,
          name,
          address
        },
        activeMarker: {},
        showingInfoWindow: true
      },
      () => console.log('manualInfoWindowInfo set', this.state)
    );

    // finds marker with matching 'locationNumber' value
    function findLocationMarker(datasetNum, arrayOfMarkers) {
      const arrayLength = arrayOfMarkers.length;
      for (let i = 0; i < arrayLength; i++) {
        const { locationNumber } = arrayOfMarkers[i];
        if (datasetNum === locationNumber) {
          return arrayOfMarkers[i].marker;
        }
      }
      return null;
    }
  };

  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: {}
      });
    }
  };

  render() {
    const {
      showingInfoWindow,
      activeMarker,
      manualInfoWindowInfo,
      selectedPlace,
      locationMarkers,
      filterText
    } = this.state;
    return (
      <React.Fragment>
        <Sidebar
          handleFilterTextChange={this.handleFilterTextChange}
          handleListItemClick={this.handleListItemClick}
          markersArray={locationMarkers}
          textValue={filterText}
        />
        <GoogleMap
          locationMarkers={locationMarkers}
          showingInfoWindow={showingInfoWindow}
          activeMarker={activeMarker}
          manualInfoWindowInfo={manualInfoWindowInfo}
          selectedPlace={selectedPlace}
          onMarkerClick={this.onMarkerClick}
          onMapClicked={this.onMapClicked}
          center={DEFAULT_CENTER}
          zoom={13}
          style={STYLE}
        />
      </React.Fragment>
    );
  }
}

export default App;
