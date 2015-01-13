_catchy.CatchyTapToStartScreen = function() {

  var _el,
      _active = false,
      _buttonClick;

  var init = function() {
    _el = document.getElementById('tap-to-start-screen');
    _buttonClick = new ButtonTouchCallback( _el, function(){
      _catchy.pageManager.setPageActive(_catchy.instructionsScreen);
      _catchy.gameplay.startAnimation();
    }, '' );
  };

  var setActive = function(active) {
    _active = active
    if(_active == true) {
      setTimeout(function(){
        _catchy.screen.gameContainer.classList.add('intro-done');
      }, 1000);
    }
  };

  init();
  return {
    setActive: setActive,
    el: _el
  };
};
