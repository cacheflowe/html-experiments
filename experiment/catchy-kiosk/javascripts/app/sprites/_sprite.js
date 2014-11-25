_catchy.Sprite = function(divEl, imgEl, svgEl, loadedCallback) {

  var _x = 0,
      _y = 0,
      _rot = 0,
      _scale = 1,
      _el = divEl || _catchy.spriteBuilder.newSpriteContainer(),
      _img = imgEl,
      _svg = svgEl;

  var init = function() {
    if(_img != null) {
      _img.onload = function(){
        setTimeout(function(){
          _interface.width = _img.width;
          _interface.height = _img.height;
          if(loadedCallback != null) loadedCallback();
        }, 1);
      };
    }
    if(_svg != null) {
      setTimeout(function(){
        _interface.width = _svg.offsetWidth;
        _interface.height = _svg.offsetHeight;
        // _el.setAttribute("width", parseFloat(_svg.offsetWidth));
        // _el.setAttribute("height", parseFloat(_svg.offsetHeight));
        if(loadedCallback != null) loadedCallback();
      }, 1);
    }
  };

  var setRotation = function(rot) {
    _rot = rot;
  };

  var setScale = function(scale) {
    _scale = scale;
    console.log(_scale);
    if(_svg != null) {
      _interface.width = _svg.offsetWidth;
      _interface.height = _svg.offsetHeight;
    }
  };

  var setPosition = function(x, y) {
    _x = x;
    _y = y;
    _catchy.cssHelper.update2DPosition(_el, _x, _y, _scale, _rot, false);
  };

  var hide = function() {
    _el.classList.add('hidden');
  };

  var show = function() {
    _el.classList.remove('hidden');
  };

  var isShowing = function() {
    return _el.classList.contains('hidden') == false;
  };

  init();
  var _interface = {
    el: _el,
    setPosition : setPosition,
    setRotation : setRotation,
    setScale : setScale,
    hide : hide,
    show : show,
    isShowing : isShowing,
    width: (_img != null) ? _img.width : 0,
    height: (_img != null) ? _img.height : 0
  };
  return _interface;
};
