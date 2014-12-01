_catchy.Sprite = function(divEl, imgEl, svgEl, text, loadedCallback) {

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
    if(text != null) {
      _el.innerHTML = text;
    }
  };

  var setRotation = function(rot) {
    _rot = rot;
  };

  var setScale = function(scale) {
    _scale = scale;
    if(_svg != null) {
      if(_svg.offsetWidth != 0) _interface.width = _svg.offsetWidth;
      if(_svg.offsetHeight != 0) _interface.height = _svg.offsetHeight;
    }
  };

  var setPosition = function(x, y) {
    _x = x;
    _y = y;
    _catchy.cssHelper.update2DPosition(_el, _x, _y, _scale, _rot, false);
  };
  
  var setText = function(text) {
    _el.innerHTML = text;
  };

  var setTextFontSize = function(size) {
    _el.setAttribute('font-size', size);
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
    setText : setText,
    setText: setText,
    width: (_img != null) ? _img.width : 0,
    height: (_img != null) ? _img.height : 0
  };
  return _interface;
};
