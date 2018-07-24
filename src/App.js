import React, { Component } from 'react';
import GoogleMap from './components/GoogleMap';
import Sidebar from './components/Sidebar';
import { Marker } from 'google-maps-react';

const FOURSQUARE = {
  CLIENT_ID: '0JDWRCHL4O23OVWIBI0W3TUME1JIGNJL4QZDCWW252FK2ICS',
  CLIENT_SECRET: 'HQ0OM52QC3D0Y0D2Y4RG4CG2UL34KVFO15ODVGTBA4KH1QA2'
};

const DEFAULT_CENTER = {
  lat: 40.758896,
  lng: -73.98513
};

class App extends Component {
  state = {
    filterText: '',
    showingInfoWindow: false,
    locationMarkers: [],
    activeMarker: {}
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

    const foursquareUrl =
      firstPartOfApiUrl +
      clientIdString +
      clientSecretString +
      coordinateString +
      queryString +
      versioningString;

    /*
      Marker needs following props:
      - name
      - position
      - title (tooltip text)
      - onClick
    */
    const makeMarkerWithHandler = makeMarker(this.onMarkerClick);

    fetch(foursquareUrl)
      .then(res => res.json())
      .then(res => {
        console.log('foursquare res is');
        console.table(res);
        if (res.meta.code !== 200) {
          return console.log('res.meta.code status was not 200', res);
        }

        // 'venues' is an array
        const {
          response: { venues }
        } = res;
        console.log('venues is', venues);
        const arrayOfMarkers = venues.map(makeMarkerWithHandler);
        this.setState({
          locationMarkers: arrayOfMarkers
        }, () => console.log(this.state.locationMarkers[0]));
      })
      .catch(e => console.log('error', e));

    function makeMarker(clickHandler) {
      return function(resObj, idx) {
        const { name, location } = resObj;
        const { lat, lng, address, formattedAddress } = location;
        return (
          <Marker
            onClick={clickHandler}
            key={`location${idx}`}
            name={name}
            address={address}
            position={{ lat, lng }}
            title={formattedAddress.join(', ')}
          />
        );
      };
    }
  }

  handleFilterTextChange = e => {
    this.setState({
      filterText: e.target.value
    });
  };

  onMarkerClick = (props, marker, e) => {
    this.setState(
      {
        activeMarker: marker,
        showingInfoWindow: true
      },
      () => console.log('post onMarkerClick', this.state)
    );
  };

  onMapClicked = props => {
    if (this.state.showingInfoWindow) {
      this.setState(
        {
          showingInfoWindow: false,
          activeMarker: null
        },
        () => console.log('new state is', this.state)
      );
    }
  };

  render() {
    const {
      showingInfoWindow,
      activeMarker,
      selectedPlace,
      locationMarkers,
      filterText
    } = this.state;
    return (
      <div>
        <h1>Hello World</h1>
        <Sidebar 
          handleFilterTextChange={this.handleFilterTextChange}
          textValue={filterText}
        />
        <GoogleMap
          locationMarkers={locationMarkers}
          showingInfoWindow={showingInfoWindow}
          activeMarker={activeMarker}
          selectedPlace={selectedPlace}
          onMarkerClick={this.onMarkerClick}
          onMapClicked={this.onMapClicked}
          center={DEFAULT_CENTER}
          zoom={13}
        />
      </div>
    );
  }
}

export default App;
