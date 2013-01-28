// global vars (sorry)
var debug;          // debug logs to screen from anywhere
var multitouch;

document.observe("dom:loaded", function () {    
	multitouch = new MultiTouchTracker( $("page_container") );
});

// hide address bar initially
Event.observe(window, 'load', function() {
  setTimeout( function(){ window.scrollTo(0,1); }, 500);
});
