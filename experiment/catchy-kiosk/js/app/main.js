$(document).ready(function(){
  _catchy.cssHelper = new tts.CSSHelper();
  _catchy.debug.init();
  _catchy.screen.init();
  _catchy.touchControl.init();
  _catchy.spriteBuilder = new _catchy.SpriteBuilder();
  _catchy.game = new _catchy.CatchyGame();
  _catchy.screen.onResize();
  _catchy.spriteBuilder.cleanUpSvgSource();
});


////////////////////////////////////////////////////////////////////////////////////////////
// ACCELEROMETER ///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
/*
// add accelerometer event listener and store values as they come in ------------------------------
// for more info: http://www.html5rocks.com/en/tutorials/device/orientation/
var tiltZAxis = 0;
var tiltXAxis = 0;
var compass = 0;
var updateOrientation = function( e ) {
  // store accelerometer values
  tiltZAxis = parseFloat( e.gamma );
  tiltXAxis = parseFloat( e.beta );
  compass = parseFloat( e.alpha );

  if( !isNaN(tiltZAxis) && !isNaN(tiltXAxis) && tiltZAxis != 0 && tiltXAxis != 0 ) {
    _usingAccelerometer = true;
  }
  _percentX.setTarget( -tiltZAxis/50 );
};
window.addEventListener('deviceorientation', updateOrientation, false);

// let the user know if there's no accelerometer data available after 1 second of listening
// (for desktops and non-capable mobile devices).
// This would be a good place to conditionally fall back to touch-based controls
setTimeout(function(){
  if( (isNaN(tiltZAxis) && isNaN(tiltXAxis)) || (tiltZAxis == 0 && tiltXAxis == 0) ) {
    // alert('You don\'t seem to have an accelerometer, which is required for this demo.');
  }
},1000);
*/



