$(document).ready(function(){
  var injectGraphics = function() {
    var svgReplacements = document.querySelectorAll('.inject-svg');
    var injectorOptions = {
      evalScripts: 'once',
      each: function (svg) {
        console.log('SVG injected: ' + svg.getAttribute('id'));
      }
    };
    SVGInjector(svgReplacements, injectorOptions, function (totalSVGsInjected) {
      // Callback after all SVGs are injected
      console.log('We injected ' + totalSVGsInjected + ' SVG(s)!');
      initApp();
    });
  };

  var initApp = function() {
    _catchy.cssHelper = new tts.CSSHelper();
    _catchy.debug.init();
    _catchy.screen.init();
    _catchy.touchControl.init();
    _catchy.sounds = new _catchy.CatchySounds();
    _catchy.spriteBuilder = new _catchy.SpriteBuilder();
    _catchy.pageManager = new _catchy.PageManager();
    _catchy.titleScreen = new _catchy.CatchyTitleScreen();
    _catchy.tapToStartScreen = new _catchy.CatchyTapToStartScreen();
    _catchy.instructionsScreen = new _catchy.CatchyInstructionsScreen();
    _catchy.getReadyScreen = new _catchy.CatchyGetReadyScreen();
    _catchy.gameplay = new _catchy.CatchyGameplay();
    _catchy.screen.onResize();

    // kick off first screen
    _catchy.pageManager.setPageActive(_catchy.titleScreen);

    // clean up svg source
    var svgLib = document.getElementById('svg-lib');
    setTimeout(function(){
      svgLib.parentNode.removeChild(svgLib);
    },10);
  };

  injectGraphics();

});
