_catchy.CatchyTitleScreen = function() {

  var _el,
      _active = false;

  var init = function() {
    _el = document.getElementById('title-screen');
  };

  var setActive = function(active) {
    _active = active
    if(_active == true) {
      _catchy.sounds.playSound(_catchy.sounds.INTRO_LOOP, true);
      setTimeout(function(){
        _catchy.pageManager.setPageActive(_catchy.tapToStartScreen);
      }, 3000);
    }
  };

  init();
  return {
    setActive: setActive,
    el: _el
  };
};
