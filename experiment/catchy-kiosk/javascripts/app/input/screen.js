// build static catchy screen object
_catchy.screen = {};

_catchy.screen.init = function() {
  MobileUtil.lockTouchScreen(true);
  _catchy.screen.windowsTouchscreenZoomDisable();

  _catchy.screen.container = document.getElementById('app-container');
  _catchy.screen.gameContainer = document.getElementById('game-container');
  _catchy.screen.containerLeft = 0;
  _catchy.screen.width = _catchy.screen.container.offsetWidth;
  _catchy.screen.height = _catchy.screen.container.offsetHeight;
  _catchy.screen.scaleV = _catchy.screen.height / 680;
  _catchy.screen.aspectRatio = _catchy.screen.width / _catchy.screen.height;

  // keep screen portrait with a letterbox even on wide screens
  if(_catchy.screen.aspectRatio > 0.8) {
    var containerWidth = Math.round(_catchy.screen.height * 0.8);
    _catchy.screen.container.style.width = containerWidth + 'px';
    _catchy.screen.containerLeft = (window.innerWidth - containerWidth) / 2;
    _catchy.screen.container.style.left = Math.round(_catchy.screen.containerLeft) + 'px';
  }

  _catchy.screen.recurseDisableElements(_catchy.screen.container);
  _catchy.screen.disableRightClick(_catchy.screen.container);

  window.addEventListener('resize', _catchy.screen.onResize);
  _catchy.screen.onResize();
};

_catchy.screen.onResize = function(e) {
  _catchy.screen.width = _catchy.screen.gameContainer.offsetWidth;
  _catchy.screen.height = _catchy.screen.gameContainer.offsetHeight;
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