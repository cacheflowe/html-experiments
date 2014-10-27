// build static catchy screen object
_catchy.screen = {};

_catchy.screen.init = function() {
  MobileUtil.lockTouchScreen(true);
  _catchy.screen.windowsTouchscreenZoomDisable();

  _catchy.screen.width = window.innerWidth;
  _catchy.screen.height = window.innerHeight;
  _catchy.screen.scaleV = _catchy.screen.height / 680;
  _catchy.screen.container = document.getElementById('game-container');

  window.addEventListener('resize', _catchy.screen.onResize);
  _catchy.screen.onResize();
};

_catchy.screen.onResize = function(e) {
  _catchy.screen.width = window.innerWidth;
  _catchy.screen.height = window.innerHeight;
  _catchy.screen.scaleV = _catchy.screen.height / 680;
};

_catchy.screen.windowsTouchscreenZoomDisable = function() {
  $(document).keydown(function(event) {
    if (event.ctrlKey==true && (event.which == '107' || event.which == '109')) {
      event.preventDefault();
    }
  });
};
