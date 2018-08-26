export function arraysEqualByProperty(property, arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  for (var i = arr1.length; i--; ) {
    if (arr1[i][property] !== arr2[i][property]) return false;
  }

  return true;
}

export function fourSquareVenueSearch(fourSquareObj, centerObj) {
  const { CLIENT_ID, CLIENT_SECRET } = fourSquareObj;
  const { lat, lng } = centerObj;

  const mainUrl = 'https://api.foursquare.com/v2/venues/search?';
  const clientIdString = 'client_id=' + CLIENT_ID;
  const clientSecretString = '&client_secret=' + CLIENT_SECRET;
  const coordinateString = '&ll=' + lat + ',' + lng;
  const queryString = '&query=coffee';
  const versioningString = '&v=20180723';
  const limitString = '&limit=7';

  const foursquareUrl =
    mainUrl +
    clientIdString +
    clientSecretString +
    coordinateString +
    queryString +
    versioningString +
    limitString;

  return fetch(foursquareUrl).then(res => res.json());
}

export function makeMarker(resObj, locationNumber) {
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
