/*
    vkHTML5GeoLocation.js by Vincent Klijn LRPS
    <https://www.vincentklijnux.eu>
    created 2016-12-26

    Copyright (c) 2016 Vincent Klijn UX
    This file may be used for personal educational purposes as needed. 
    Use for other purposes is granted provided that this notice is
    retained and any changes made are clearly indicated as such.
	
	version 1.0.3 - vk 2018-07-23
*/

// global variable to hold the geo-location object
var myGeoLoc;
// global variable which holds the getCurrentPosition options
var myGetCurPosOptions = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 1000
};

// global variable to hold the table object
var tbl = new myTable();

// useful for finding elements (a shortcut for getElementById)
var myElement = function(id) { 
	return document.getElementById(id); 
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

// when getCurrentPosition is successful, display the coordinates
function dispCoordinates(myCurPos) {
    // grab the lat and lon from the position object
    var myLatitude = myCurPos.coords.latitude;
    var myLongitude = myCurPos.coords.longitude;
    // update the first datarow in the table
    tbl.updateRow( 0, [ myLatitude, myLongitude ] );
    // displays the updated table
    dispResults();
}

// when getCurrentPosition is not successful, do some error handling
function dispNoLuck(myErr) {
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
    // update the first datarow in the table with text
    tbl.updateRow( 0, [ myErr.code, errMessage ] );
    // displays the updated table
    dispResults();
}

// function to display the results in a table
function dispResults() {
    myElement('results').innerHTML = tbl.getTableHTML();
}

// initialize our little piece of JavaScript
function init() {
    if ( (myGeoLoc = getGeoLocation()) ) {
        // change the status message
        statusMessage('Using HTML5 Geolocation');
        // create the table with two rows
        tbl.setHeader( [ 'Latitude', 'Longitude' ] );
        tbl.addRow( [ '&nbsp;', '&nbsp;' ] );
        // fetch the coordinates
        // .getCurrentPosition( success, failure, options );
        // be aware: set a timeout in the options, otherwise failure is never called!
        // this will fetch the position once
        // for continuous monitoring use .watchPosition instead (same arguments)
        myGeoLoc.getCurrentPosition( dispCoordinates, dispNoLuck, myGetCurPosOptions );
    } else {
        // change the status message
        statusMessage('HTML5 Geolocation is not supported');
    }
    // displays the empty table
    dispResults();
}

// wait for everything to load, then start running the script
window.onload = function() {
    init();
}

// Utility Functions

// global variables
var errorMessage = undefined;
var hasError = false;

// check for eventListeners
function getAddEventListener() {
    try {
        if( Boolean(window.addEventListener) ) {
			return window.addEventListener;
		}
    } 
	catch(e) {
        return undefined;
    }
}

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

// display Errors
function dispError( message ) {
    errorMessage = '<p class="error">' + message + '</p>';
    hasError = true;
}

// create the myTable class for displaying tabular information
function myTable( wrap ) {
    // class attributes
	this.wrap = ( wrap == undefined ) ? true : wrap;    // default to true
    this.rows = new Array();
    this.header = [];

	// class methods
    this.setHeader = function( row ) {
        this.header = row;
    };

    this.addRow = function( row ) {
        this.rows.push(row);
    };

    this.updateRow = function( index, row ) {
        this.rows[index] = row;
    }

    this.getRow = function ( index ) {
        return this.rows[index];
    };

    this.countRows = function () {
        return this.rows.length;
    };

    this.getTableHTML = function () {
        var addHtml = '';
        if(this.wrap) {
			addHtml += '<table class="myTable">\n';
		}
        addHtml += this.getHeaderHTML();
        for(var row in this.rows) {
            addHtml += this.getRowHTML(this.rows[row]);
        }
        if(this.wrap) {
			addHtml += '</table>\n';
		}
        return addHtml;
    };

    this.getHeaderHTML = function () {
        if( this.header.length == 0 ) {
			return '';
		}
        var addHtml = '<tr>';
        for( var cell in this.header ) {
            addHtml += '<th>' + this.header[cell] + '</th>';
        }
        addHtml += '</tr>\n';
        return addHtml;
    };

    this.getRowHTML = function ( row ) {
        var addHtml = '<tr>';
        for( var cell in row ) {
            var rowNum = row[cell];
            if( rowNum == null) {
				rowNum = '<span class="red">NULL</span>';
			}
            addHtml += '<td>' + rowNum + '</td>';
        }
        addHtml += '</tr>\n';
        return addHtml;
    };

    this.writeTable = function () {
        document.write(this.getTableHTML());
    };

}
