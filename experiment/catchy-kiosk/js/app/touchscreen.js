// build static catchy screen object
_catchy.screen = {};

_catchy.screen.init = function() {
  // MobileUtil.lockTouchScreen(true);
  // _catchy.screen.windowsTouchscreenZoomDisable();

  _catchy.screen.width = window.innerWidth;
  _catchy.screen.height = window.innerHeight;
  _catchy.screen.scaleV = _catchy.screen.height / 680;
  _catchy.screen.container = document.getElementById('game-container');

  // _catchy.screen.recurseDisableElements(_catchy.screen.container);
  // _catchy.screen.disableRightClick(_catchy.screen.container);

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

// prevent clicking/dragging on children from interfering with container's dragging
_catchy.screen.disabledElements = "div img".split(' ');
_catchy.screen.recurseDisableElements = function (el) {
  if( el ) {
    // disable clicking/dragging on selected elent types
    if( el.tagName && _catchy.screen.disabledElements.indexOf( el.tagName.toLowerCase() ) != -1 ) {  //  console.log('disabling: = '+el.tagName.toLowerCase());
      try {
        el.onmousedown = function(e){ return false; };
        el.onselectstart = function(){ return false; };
      } catch(err) {}
    }
    // loop through children and do the same
    if( el.childNodes.length > 0 ){
      for( var i=0; i < el.childNodes.length; i++ ) {
        _catchy.screen.recurseDisableElements( el.childNodes[i] );
      }
    }
  }
};

_catchy.screen.disableRightClick = function (el) {
  el.oncontextmenu = function(e){ return false; };
};