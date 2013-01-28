
/*global AoAPitch */

// global vars (sorry)
var debug;          // debug logs to screen from anywhere
var objcInterface;	// makes obj-c callbacks available anywhere 
var aoaPitchApp;    // makes available to obj-c calls
var canvasPool;
var canvasPoolCoverflow;

document.observe("dom:loaded", function () {    
	aoaPitchApp = new AoAPitch();
});
