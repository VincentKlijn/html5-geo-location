/*
    vkHTML5GeoLocationGM.js by Vincent Klijn LRPS
    <https://www.vincentklijnux.eu>
    created 2016-12-26

    Copyright (c) 2016 Vincent Klijn UX
    This file may be used for personal educational purposes as needed. 
    Use for other purposes is granted provided that this notice is
    retained and any changes made are clearly indicated as such.
	
	version 1.0.3 - vk 2018-07-23
*/

// global variable to hold ...
var myWatchID;
// global variable to hold the geo-location object
var myGeoLoc;
// global variable to hold the map object
var myGeoMap;
// the marker on the map
var myMapMarker;
// global variable which holds the getCurrentPosition options
var myGetCurPosOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 200
};

// check for browser support on HTML5 Geo Location functionality
// if support is available, return the object, so it can be assigned to a variable
// if support is not available, return undefined to the variable
// try-catch checks for availability of the property without causing an error if not 
function getGeoLocation() {
    try {
        if ( Boolean(navigator.geolocation) ) {
            return navigator.geolocation;
        } else {
            return undefined;
        }
    }
    catch(e) {
        return undefined;
    }
}

// when watchPosition is successful, show the map and marker
function dispMap(myCurPos) {
    // grab the lat and lon from the position object
    var myLatitude = myCurPos.coords.latitude;
    var myLongitude = myCurPos.coords.longitude;
    var myLatLng = new google.maps.LatLng(myLatitude, myLongitude);
    
    // if the map already exists, then adjust position and marker
    if (myGeoMap) {
        myGeoMap.panTo(myLatLng);
        myMapMarker.setPosition(myLatLng);
    } else {
        // else, create a new map
        // first set the options
        var myMapOptions = {
            zoom: 18,
            center: myLatLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
            // ROADMAP; the default roadmap view
            // SATELLITE: Google Earth Satellite images
            // HYBRID: a mixture of the two above
            // TERRAIN: a physical map based on terrain information
        };
        // create the map
        myGeoMap = new google.maps.Map(document.getElementById('mapCanvas'), myMapOptions);
        // turn off the 45 degree view
        myGeoMap.setTilt(0);
        
        // create the marker
        myMapMarker = new google.maps.Marker( {
            position: myLatLng,
            title: 'you are here'
        });
        myMapMarker.setMap(myGeoMap);
    }  
}

// when getCurrentPosition is not successful, do some error handling
function dispNoLuck(myErr) {
    // stop watching
    if (myWatchID) {
        myGeoLoc.clearWatch(myWatchID);
        myWatchID = null;
    }
    // initialize error message
    var errMessage = '';
    // check the error code
    switch(myErr.code) {
        case myErr.TIMEOUT:
            errMessage = 'Geolocation Timeout';
            break;
        case myErr.POSITION_UNAVAILABLE:
            errMessage = 'Geolocation Position Unavailable';
            break;
        case myErr.PERMISSION_DENIED:
            errMessage = 'Geolocation Permission Denied';
            break;
        default:
            errMessage = 'Geolocation returned an unknown code';
    }
    statusMessage(errMessage);
}

// initialize our little piece of JavaScript
function init() {
    if ( (myGeoLoc = getGeoLocation()) ) {
        // change the status message
        statusMessage('Using HTML5 Geolocation');
        // fetch the coordinates
        // .watchPosition( success, failure, options );
        // be aware: set a timeout in the options, otherwise failure is never called!
        myWatchID = myGeoLoc.watchPosition( dispMap, dispNoLuck, myGetCurPosOptions );
    } else {
        // change the status message
        statusMessage('HTML5 Geolocation is not supported');
    }
}

// wait for everything to load, then start running the script
window.onload = function() {
    init();        
};

// Utility Functions

// useful for finding elements (a shortcut for getElementById)
var myElement = function(id) { 
	return document.getElementById(id); 
};

// sets the html messagee shown in the statusbar at the top of the screen
function statusMessage(myStr) {
	// if an argument is given
	if(myStr) {
		// put the argument in statusMessage
		myElement('statusMessage').innerHTML = myStr;
	} else {
		// else, put a non-breaking space in there, otherwise it won't show
		myElement('statusMessage').innerHTML = '&nbsp;';
	}
}
