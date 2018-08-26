import React, { Component } from 'react';
import { GoogleApiWrapper } from 'google-maps-react';
import GoogleMap from './components/GoogleMap';
import Sidebar from './components/Sidebar';
import HamburgerButton from './components/HamburgerButton';
import Attribution from './components/Attribution';
import {
  FOURSQUARE,
  DEFAULT_CENTER,
  MAP_STYLE,
  DEFAULT_ZOOM,
  GOOGLE_API_KEY
} from './constants';
import { fourSquareVenueSearch, makeMarker } from './utilityFns';
import './App.css';

class App extends Component {
  state = {
    filterText: '',
    showingInfoWindow: false,
    activeMarker: null,
    markerInfoArr: [],
    filterMarkers: [],
    hamburgerOpen: false,
    fourSquareError: null,
    mapError: false,
    googleMapsRef: React.createRef() // ref to <GoogleMap/> component
  };

  // get FourSquare data and save to state
  componentDidMount() {
    fourSquareVenueSearch(FOURSQUARE, DEFAULT_CENTER)
      .then(res => {
        if (res.meta.code !== 200) return this.setFourSquareError(res);

        const { venues } = res.response;

        return this.setMarkerInfoArr(venues.map(makeMarker));
      })
      .catch(e => {
        console.log('foursquare fetch error', e);
        return this.setFourSquareError(e);
      });
  }

  handleFilterTextChange = e => {
    const filterText = e.target.value;
    const { markerInfoArr } = this.state;
    // filterLocation is a function that takes an object as an argument
    // and returns Boolean if filterText is a substring of venue name
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

  onMarkerClick = (props, selectedMarker, e) => {
    const { activeMarker } = this.state;
    const previousActiveMarker = !!activeMarker;

    if (previousActiveMarker) {
      const sameMarker = activeMarker.address === selectedMarker.address;

      this.closeInfoWindow();
      this.resetActiveMarker();
      // only stop animation if selectedMarker is different from previous activeMarker
      if (!sameMarker) {
        this.stopMarkerAnimation(activeMarker);
      }
    }

    return this.bounceMarkerAndShowInfoWindow(selectedMarker);
  };

  getChosenMarker = tagWithDatasetAttr => {
    const { locationNumber } = tagWithDatasetAttr.dataset;
    const index = parseInt(locationNumber, 10);
    const googleMapRef = this.state.googleMapsRef.current;
    // access array of <Marker/>'s from within <GoogleMap/> component state
    const { markerRefsArr } = googleMapRef.state;

    return findMarker(index, markerRefsArr);

    // used to find object created from google.maps.Marker constructor
    // from array in <GoogleMaps/> components
    function findMarker(datasetNum, arrayOfMarkers) {
      return arrayOfMarkers[datasetNum].current.marker;
    }
  };

  bounceMarkerAndShowInfoWindow = marker => {
    return (
      this.setActiveMarker(marker),
      this.makeMarkerBounce(marker),
      this.showInfoWindow()
    );
  };

  handleListItemClick = e => {
    const { target } = e;
    const notListItem = !target.classList.contains('list-item');
    if (notListItem) return;

    const { activeMarker, showingInfoWindow } = this.state;

    if (showingInfoWindow) {
      return (
        this.stopMarkerAnimation(activeMarker),
        this.closeInfoWindow(),
        this.resetActiveMarker()
      );
    }

    try {
      const tagWithDatasetAttr = target.parentNode;
      const chosenMarker = this.getChosenMarker(tagWithDatasetAttr);

      return this.bounceMarkerAndShowInfoWindow(chosenMarker);
    } catch (e) {
      console.log('handleListItemClick method error!', e);
    }
  };

  onMapClicked = props => {
    const { activeMarker, showingInfoWindow } = this.state;

    return (
      // stop animation and close info window
      activeMarker && this.stopMarkerAnimation(activeMarker),
      showingInfoWindow && this.closeInfoWindow()
    );
  };

  onInfoWindowClose = () => {
    const { activeMarker } = this.state;

    // if already active animating marker, stop animation when window closes
    return activeMarker && this.stopMarkerAnimation(activeMarker);
  };

  closeInfoWindow = () => this.setState({ showingInfoWindow: false });

  showInfoWindow = () => this.setState({ showingInfoWindow: true });

  setMarkerInfoArr = markerInfoArr => this.setState({ markerInfoArr });

  makeMarkerBounce = marker =>
    this.setMarkerAnimation(marker, this.props.google.maps.Animation.BOUNCE);

  setMarkerAnimation = (marker, val) => marker.setAnimation(val);

  stopMarkerAnimation = marker => marker.setAnimation(null);

  setFourSquareError = fourSquareError => this.setState({ fourSquareError });

  setActiveMarker = activeMarker => this.setState({ activeMarker });

  setMapError = mapError => this.setState({ mapError });

  resetActiveMarker = () => this.setActiveMarker(null);

  toggleHamburgerOpen = () =>
    this.setState({ hamburgerOpen: !this.state.hamburgerOpen });

  handleHamburgerButtonClick = () => this.toggleHamburgerOpen();

  render() {
    const {
      showingInfoWindow, // Boolean
      activeMarker, // Object
      hamburgerOpen, // Boolean
      markerInfoArr,
      filterMarkers, // Array
      filterText, // String
      fourSquareError,
      mapError
    } = this.state;
    const markersToShow = !filterText ? markerInfoArr : filterMarkers;

    return fourSquareError ? (
      <h1>FourSquare Error, apologies for any inconvenience!</h1>
    ) : mapError ? (
      <h1>Google Maps Error, apologies for any inconvenience!</h1>
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
          setMapError={this.setMapError}
          onMapClicked={this.onMapClicked}
          onMarkerClick={this.onMarkerClick}
          onInfoWindowClose={this.onInfoWindowClose}
          center={DEFAULT_CENTER}
          zoom={DEFAULT_ZOOM}
          style={MAP_STYLE}
        />
      </React.Fragment>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: GOOGLE_API_KEY
})(App);
