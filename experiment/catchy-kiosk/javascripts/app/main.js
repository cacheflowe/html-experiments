$(document).ready(function(){
  _catchy.cssHelper = new tts.CSSHelper();
  _catchy.debug.init();
  _catchy.screen.init();
  _catchy.touchControl.init();
  _catchy.spriteBuilder = new _catchy.SpriteBuilder();
  _catchy.gameplay = new _catchy.CatchyGameplay();
  _catchy.screen.onResize();

  // clean up svg source
  var svgLib = document.getElementById('svg-lib');
  setTimeout(function(){
    svgLib.parentNode.removeChild(svgLib);
  },10);

});
