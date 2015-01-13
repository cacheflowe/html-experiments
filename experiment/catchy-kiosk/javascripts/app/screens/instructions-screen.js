_catchy.CatchyInstructionsScreen = function() {

  var _el,
      _active = false,
      _buttonClick;

  var init = function() {
    _el = document.getElementById('instructions-screen');
  };

  var setActive = function(active) {
    _active = active
    if(_active == true) {
      setTimeout(function(){
        _catchy.pageManager.setPageActive(_catchy.getReadyScreen);
      }, 5000);
    }
  };

  init();
  return {
    setActive: setActive,
    el: _el
  };
};
