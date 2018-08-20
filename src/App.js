import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import GoogleMap from './components/GoogleMap';
import Sidebar from './components/Sidebar';
import HamburgerButton from './components/HamburgerButton';
import Attribution from './components/Attribution';
import { FOURSQUARE, DEFAULT_CENTER, MAP_STYLE } from './constants';
import { isEmpty } from './utilityFns';
import './App.css';

/*
  - COMMENT ALL NECESSARY PARTS OF CODE
*/

class App extends Component {
  state = {
    filterText: '',
    showingInfoWindow: false,
    activeMarker: {},
    markerInfoArr: [],
    filterMarkers: [],
    hamburgerOpen: false,
    fourSquareError: null,
    googleMapsRef: React.createRef()
  };

  setMarkerRefsArr = markerRefsArr =>
    this.setState({ markerRefsArr }, () =>
      console.log(this.state.markerRefsArr)
    );

  componentDidMount() {
    const { CLIENT_ID, CLIENT_SECRET } = FOURSQUARE;
    const { lat, lng } = DEFAULT_CENTER;

    const firstPartOfApiUrl = 'https://api.foursquare.com/v2/venues/search?';
    const clientIdString = 'client_id=' + CLIENT_ID;
    const clientSecretString = '&client_secret=' + CLIENT_SECRET;
    const coordinateString = '&ll=' + lat + ',' + lng;
    const queryString = '&query=coffee';
    const versioningString = '&v=20180723';
    const limitString = '&limit=7';

    const foursquareUrl =
      firstPartOfApiUrl +
      clientIdString +
      clientSecretString +
      coordinateString +
      queryString +
      versioningString +
      limitString;

    fetch(foursquareUrl)
      .then(res => res.json())
      .then(res => {
        if (res.meta.code !== 200) {
          console.log('res.meta.code status was not 200', res);
          return this.setState({ fourSquareError: res });
        }

        const {
          response: { venues } // Array
        } = res;

        return this.setMarkerInfoArr(venues.map(makeMarker));
      })
      .catch(e => {
        console.log('foursqure fetch error', e);

        return this.setState({
          fourSquareError: e
        });
      });

    function makeMarker(resObj, locationNumber) {
      const { name, location } = resObj;
      const { lat, lng, address, formattedAddress } = location;
      const position = { lat, lng };
      const markerInfo = {
        key: `location${locationNumber}`,
        name,
        address,
        position,
        title: formattedAddress.join(', ')
      };

      return { locationNumber, markerInfo };
    }
  }

  handleFilterTextChange = e => {
    const filterText = e.target.value;
    const { markerInfoArr } = this.state;
    const filterLocation = this.locationFilter(filterText);

    const filterMarkers = filterText
      ? markerInfoArr.filter(filterLocation)
      : [...this.state.filterMarkers];

    return this.setState({
      filterText,
      filterMarkers
    });
  };

  // curried method that checks if user's filterText input
  // is contained within a location's name
  locationFilter = filterText => ({ markerInfo: { name } }) => {
    return name.toLowerCase().indexOf(filterText.toLowerCase()) !== -1;
  };

  // clicking markers after the first marker creates bugs with animation
  onMarkerClick = (props, selectedMarker, e) => {
    console.log('marker clicked', selectedMarker);
    const { activeMarker } = this.state;
    const previousActiveMarker = !isEmpty(activeMarker);

    if (previousActiveMarker) {
      console.log('previousActiveMarker', activeMarker);
      this.stopMarkerAnimation(activeMarker);
      this.closeInfoWindow();
      this.resetActiveMarker();
    }

    return (
      this.setActiveMarker(selectedMarker),
      this.makeMarkerBounce(selectedMarker),
      this.showInfoWindow()
    );
  };

  handleListItemClick = e => {
    const { target } = e;
    const notListItem = !target.classList.contains('list-item');
    if (notListItem) return;

    const { activeMarker } = this.state;
    const infoWindowAlreadyOpen = !isEmpty(activeMarker);

    if (infoWindowAlreadyOpen) {
      return (
        this.stopMarkerAnimation(activeMarker),
        this.closeInfoWindow(),
        this.resetActiveMarker()
      );
      // console.log('infoWindowAlreadyOpen block', this.state);
    }

    try {
      const tagWithDatasetAttr = target.parentNode;
      const {
        dataset: { locationNumber }
      } = tagWithDatasetAttr;
      const parsedLocationNum = parseInt(locationNumber, 10);
      const {
        googleMapsRef: { current: googleMapComponent }
      } = this.state;

      const markersFromGoogleMapComponent =
        googleMapComponent.state.markerRefsArr;
      const chosenMarker = findMarker(
        parsedLocationNum,
        markersFromGoogleMapComponent
      );

      return (
        this.setActiveMarker(chosenMarker),
        this.makeMarkerBounce(chosenMarker),
        this.showInfoWindow()
      );
    } catch (e) {
      console.log('handleListItemClick method error!', e);
    }

    // used to find object created from google.maps.Marker constructor
    // from array in <GoogleMaps/> components
    function findMarker(datasetNum, arrayOfMarkers) {
      return arrayOfMarkers[datasetNum].current.marker;
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

  setMarkerInfoArr = markerInfoArr => this.setState({ markerInfoArr });

  makeMarkerBounce = marker => this.setMarkerAnimation(marker, this.props.google.maps.Animation.BOUNCE);

  setMarkerAnimation = (marker, val) => (
    marker.setAnimation(val), console.log('setMarkerAnimation called')
  );

  stopMarkerAnimation = marker => marker.setAnimation(null);

  setFourSquareError = fourSquareError => this.setState({ fourSquareError });

  setActiveMarker = activeMarker => this.setState({ activeMarker });

  resetActiveMarker = () => this.setActiveMarker({});

  toggleHamburgerOpen = () =>
    this.setState({ hamburgerOpen: !this.state.hamburgerOpen });

  handleHamburgerButtonClick = () => this.toggleHamburgerOpen();

  render() {
    const {
      showingInfoWindow, // Boolean
      activeMarker, // Object
      hamburgerOpen, // Boolean
      markerInfoArr,
      markerRefsArr,
      filterMarkers, // Array
      filterText, // String
      fourSquareError
    } = this.state;
    const markersToShow = !filterText ? markerInfoArr : filterMarkers;

    return fourSquareError ? (
      <h1>FourSquare Error, apologies for any inconvenience!</h1>
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
          markersToShow={markersToShow}
          textValue={filterText}
          open={hamburgerOpen}
        />
        <GoogleMap
          ref={this.state.googleMapsRef}
          google={this.props.google}
          activeMarker={activeMarker}
          markerInfoArr={markersToShow}
          showingInfoWindow={showingInfoWindow}
          setActiveMarker={this.setActiveMarker}
          stopMarkerAnimation={this.stopMarkerAnimation}
          showInfoWindow={this.showInfoWindow}
          onMapClicked={this.onMapClicked}
          onMarkerClick={this.onMarkerClick}
          onInfoWindowClose={this.onInfoWindowClose}
          center={DEFAULT_CENTER}
          zoom={13}
          style={MAP_STYLE}
        />
      </React.Fragment>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyBAxbjkY2XIFNOn1V6hVxUuKpsZoX9i28E'
})(App);
