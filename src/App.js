import React, { Component } from 'react';
import GoogleMap from './components/GoogleMap';
import { Marker } from 'google-maps-react';

const FOURSQUARE = {
  CLIENT_ID: '0JDWRCHL4O23OVWIBI0W3TUME1JIGNJL4QZDCWW252FK2ICS',
  CLIENT_SECRET: 'HQ0OM52QC3D0Y0D2Y4RG4CG2UL34KVFO15ODVGTBA4KH1QA2'
};

const defaultCenter = {
  lat: 40.758896,
  lng: -73.98513
};

class App extends Component {
  state = {
    filterText: '',
    showingInfoWindow: false,
    locationMarkers: [],
    activeMarker: {},
    selectedPlace: {}
  };

  componentDidMount() {
    const { CLIENT_ID, CLIENT_SECRET } = FOURSQUARE;
    const { lat, lng } = defaultCenter;

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
        const arrayOfMarkers = venues.map(this.makeMarker);
        this.setState({
          locationMarkers: arrayOfMarkers
        });
      })
      .catch(e => console.log('error', e));
  }

  makeMarker = (resObj, idx) => {
    const { name, location } = resObj;
    const { lat, lng, address, formattedAddress } = location;
    return (
      <Marker
        onClick={this.onMarkerClick}
        key={`location${idx}`}
        name={name + ' ' + address}
        position={{ lat, lng }}
        title={formattedAddress.join(', ')}
      />
    );
  };

  handleFilterTextChange = e => {
    this.setState({
      filterText: e.target.value
    });
  };

  onMarkerClick = (props, marker, e) => {
    this.setState(
      {
        selectedPlace: props,
        activeMarker: marker,
        showingInfoWindow: true
      },
      () => console.log('new state is', this.state)
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
      locationMarkers
    } = this.state;
    return (
      <div>
        <h1>Hello World</h1>
        <GoogleMap
          locationMarkers={locationMarkers}
          showingInfoWindow={showingInfoWindow}
          activeMarker={activeMarker}
          selectedPlace={selectedPlace}
          onMarkerClick={this.onMarkerClick}
          onMapClicked={this.onMapClicked}
          center={defaultCenter}
          zoom={13}
        />
      </div>
    );
  }
}

export default App;
