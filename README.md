# html5-geo-location
This repository includes demonstrations of html5 geo location functionality:
- a simple test to check if geo location is supported by the device.
- fetching the coordinates with .getCurrentPosition.
- displaying the position on a map using .watchPosition and the Google Maps API.

Be aware: you need to test this on a non-local server (no file refs in the browser) with SSL. And of course you will to allow the browser to use geo location.

### The HTML
The HTML is heavily commented to make identifying the elements easy and to understand their function. This is a very basic html file.

Be aware: the Google Maps API needs an API Key for full functionality. Without it, there is an error message and dark overlay.
Get a key and change the call into:
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap" async defer></script>

### The CSS
The CSS is heavily commented to explain the individual rules.

### The JavaScript
The JavaScript libraries are external files, called from the html file. They contain all functions necessary for making the geo location API work.

All JavaScript is heavily commented, almost on a line-by-line basis, explaining what is going on.

Be aware: if Geo Location is giving you too many timeout failures, you could test the script by changing a few things:
1) comment the myWatchID = ... statement in line 117
2) add dispMap(); below this statement
3) comment lines 49 & 50.
4) directly below these put: var myLatitude = 52.3812;
5) directly below that put: var myLogitude = 4.6361;
6) if you want to, you can use other coordinates of course.

## [Take a look at the live working version of this demo.](https://vincentklijn.github.io/html5-geo-location/)
