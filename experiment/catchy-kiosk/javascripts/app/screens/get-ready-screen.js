_catchy.CatchyGetReadyScreen = function() {

  var _el,
      _active = false,
      _buttonClick;

  var init = function() {
    _el = document.getElementById('get-ready-screen');
  };

  var setActive = function(active) {
    _active = active
    if(_active == true) {
      setTimeout(function(){
        _catchy.pageManager.setPageActive(_catchy.gameplay);
      }, 3000);
    }
  };

  init();
  return {
    setActive: setActive,
    el: _el
  };
};
