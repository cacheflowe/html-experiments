$(document).ready(function(){
  _catchy.cssHelper = new tts.CSSHelper();
  _catchy.debug.init();
  _catchy.screen.init();
  _catchy.touchControl.init();
  _catchy.spriteBuilder = new _catchy.SpriteBuilder();
  _catchy.game = new _catchy.CatchyGame();
  _catchy.screen.onResize();

  // clean up svg source
  var svgLib = document.getElementById('svg-lib');
  // svgLib.parentNode.removeChild(svgLib);

});
