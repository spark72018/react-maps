import React, { Component } from 'react';
import GoogleMap from './components/GoogleMap';
import Sidebar from './components/Sidebar';
import { FOURSQUARE, DEFAULT_CENTER, MAP_STYLE } from './constants';
import { Marker } from 'google-maps-react';
import './App.css';

class App extends Component {
  state = {
    filterText: '',
    showingInfoWindow: false,
    locationMarkers: [],
    filterMarkers: [],
    activeMarker: {},
    manualInfoWindowInfo: {}
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
    const filterText = e.target.value;
    const { locationMarkers } = this.state;
    const filterLocation = this.locationFilter(filterText);

    const filterMarkers = filterText
      ? locationMarkers.filter(filterLocation)
      : [...this.state.filterMarkers];

    return this.setState({
      filterText,
      filterMarkers
    });
  };

  locationFilter = filterText => locationObj => {
    return (
      locationObj.marker.props.name
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
    );
  };

  onMarkerClick = (props, marker, e) => {
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

    return this.setState({
      manualInfoWindowInfo: {
        position,
        name,
        address
      },
      activeMarker: {},
      showingInfoWindow: true
    });

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
      showingInfoWindow, // Boolean
      activeMarker, // Object
      manualInfoWindowInfo, // Object
      locationMarkers, // Array
      filterMarkers, // Array
      filterText // String
    } = this.state;
    return (
      <React.Fragment>
        <Sidebar
          handleFilterTextChange={this.handleFilterTextChange}
          handleListItemClick={this.handleListItemClick}
          markersArray={!filterText ? locationMarkers : filterMarkers}
          textValue={filterText}
        />
        <GoogleMap
          locationMarkers={locationMarkers}
          showingInfoWindow={showingInfoWindow}
          activeMarker={activeMarker}
          manualInfoWindowInfo={manualInfoWindowInfo}
          onMarkerClick={this.onMarkerClick}
          onMapClicked={this.onMapClicked}
          center={DEFAULT_CENTER}
          zoom={13}
          style={MAP_STYLE}
        />
      </React.Fragment>
    );
  }
}

export default App;
