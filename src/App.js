import React, { Component } from 'react';
import { Marker } from 'google-maps-react';
import GoogleMap from './components/GoogleMap';
import Sidebar from './components/Sidebar';
import HamburgerButton from './components/HamburgerButton';
import Attribution from './components/Attribution';
import { FOURSQUARE, DEFAULT_CENTER, MAP_STYLE } from './constants';
import isEmpty from './utilityFns';
import './App.css';

/*
  - COMMENT ALL NECESSARY PARTS OF CODE
*/

class App extends Component {
  state = {
    filterText: '',
    showingInfoWindow: false,
    locationMarkers: [],
    filterMarkers: [],
    activeMarker: {},
    markerWindowInfo: {},
    hamburgerOpen: false,
    fourSquareApiError: null
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
        if (res.meta.code !== 200) {
          console.log('res.meta.code status was not 200', res);
          return this.setState({ fourSquareApiError: res });
        }

        const {
          response: { venues } // Array
        } = res;
        const arrayOfMarkers = venues.map(makeMarkerWithHandler);
        this.setState({
          locationMarkers: arrayOfMarkers
        });
      })
      .catch(e => {
        console.log('foursqure fetch error', e);

        return this.setState({
          fourSquareApiError: e
        });
      });

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

  // curried method that checks if user's filterText input
  // is contained within a location's name
  locationFilter = filterText => locationObj => {
    return (
      locationObj.marker.props.name
        .toLowerCase()
        .indexOf(filterText.toLowerCase()) !== -1
    );
  };

  onMarkerClick = (props, marker, e) => {
    const { activeMarker } = this.state;
    const previousActiveMarker = !isEmpty(activeMarker);
    const selectedMarker = marker;

    if (previousActiveMarker) {
      this.stopMarkerAnimation(activeMarker);
    }

    selectedMarker.setAnimation(props.google.maps.Animation.BOUNCE);

    return this.setActiveMarker(selectedMarker), this.showInfoWindow();
  };

  handleListItemClick = e => {
    const { target } = e;
    const notListItem = !target.classList.contains('list-item');
    if (notListItem) return;

    const { markerWindowInfo } = this.state;

    const infoWindowAlreadyOpen = !isEmpty(markerWindowInfo);

    if (infoWindowAlreadyOpen) {
      return this.closeInfoWindowAndResetWindowInfo();
    }

    const tagWithDatasetAttr = target.parentNode;
    const {
      dataset: { locationNumber }
    } = tagWithDatasetAttr;
    const parsedLocationNum = parseInt(locationNumber, 10);
    const { locationMarkers } = this.state;
    const chosenMarker = findLocationMarker(parsedLocationNum, locationMarkers);
    const { position, name, address } = chosenMarker.props;
    const windowInfo = { position, name, address };

    return (
      this.setMarkerWindowInfo(windowInfo),
      this.resetActiveMarker(),
      this.showInfoWindow()
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
    const { activeMarker, showingInfoWindow } = this.state;

    return (
      // stop animation and close info window
      !isEmpty(activeMarker) && this.stopMarkerAnimation(activeMarker),
      showingInfoWindow && this.closeInfoWindow()
    );
  };

  onInfoWindowClose = () => {
    const { activeMarker } = this.state;

    // if already active animating marker, stop animation when window closes
    return !isEmpty(activeMarker) && this.stopMarkerAnimation(activeMarker);
  };

  closeInfoWindow = () => this.setState({ showingInfoWindow: false });

  showInfoWindow = () => this.setState({ showingInfoWindow: true });

  setActiveMarker = marker => this.setState({ activeMarker: marker });

  resetActiveMarker = e => this.setState({ activeMarker: {} });

  resetMarkerWindowInfo = () => this.setMarkerWindowInfo({});

  setMarkerWindowInfo = infoObj =>
    this.setState({
      markerWindowInfo: infoObj
    });

  closeInfoWindowAndResetWindowInfo = () => (
    this.closeInfoWindow(), this.resetMarkerWindowInfo()
  );

  closeInfoWindowAndResetActiveMarker = () => (
    this.closeInfoWindow(), this.resetActiveMarker()
  );

  stopMarkerAnimation = marker => marker.setAnimation(null);

  toggleHamburgerOpen = () =>
    this.setState({ hamburgerOpen: !this.state.hamburgerOpen });

  handleHamburgerButtonClick = () => this.toggleHamburgerOpen();

  render() {
    const {
      showingInfoWindow, // Boolean
      activeMarker, // Object
      markerWindowInfo, // Object
      hamburgerOpen, // Boolean
      locationMarkers, // Array
      filterMarkers, // Array
      filterText, // String
      fourSquareApiError
    } = this.state;
    const markersToShow = !filterText ? locationMarkers : filterMarkers;

    return fourSquareApiError ? (
      <h1>FourSquare Error</h1>
    ) : (
      <React.Fragment>
        <Attribution text={'Venue data powered by Foursquare'} />
        <HamburgerButton
          open={hamburgerOpen}
          handleHamburgerButtonClick={this.handleHamburgerButtonClick}
        />
        <Sidebar
          handleFilterTextChange={this.handleFilterTextChange}
          handleListItemClick={this.handleListItemClick}
          markersArray={markersToShow}
          textValue={filterText}
          open={hamburgerOpen}
        />
        <GoogleMap
          locationMarkers={markersToShow}
          showingInfoWindow={showingInfoWindow}
          activeMarker={activeMarker}
          markerWindowInfo={markerWindowInfo}
          onMarkerClick={this.onMarkerClick}
          onMapClicked={this.onMapClicked}
          onInfoWindowClose={this.onInfoWindowClose}
          center={DEFAULT_CENTER}
          zoom={13}
          style={MAP_STYLE}
        />
      </React.Fragment>
    );
  }
}

export default App;
