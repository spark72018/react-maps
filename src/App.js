import React, { Component } from 'react';
import GoogleMap from './components/GoogleMap';

class App extends Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {}
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
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      }, () => console.log('new state is', this.state))
    }
  }

  render() {
    const { showingInfoWindow, activeMarker, selectedPlace } = this.state;
    return (
      <div>
        <h1>Hello World</h1>
        <GoogleMap
          showingInfoWindow={showingInfoWindow}
          activeMarker={activeMarker}
          selectedPlace={selectedPlace}
          onMarkerClick={this.onMarkerClick}
          onMapClicked={this.onMapClicked}
          center={{
            lat: 59.95,
            lng: 30.33
          }}
          zoom={13}
        />
      </div>
    );
  }
}

export default App;
