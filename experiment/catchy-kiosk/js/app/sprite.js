_catchy.Sprite = function(divEl, imgEl, loadedCallback) {

  var _x = 0,
      _y = 0,
      _rot = 0,
      _el = divEl || _catchy.spriteBuilder.newSpriteContainer(),
      _img = imgEl;

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
  };

  var setRotation = function(rot) {
    _rot = rot;
  };

  var setPosition = function(x, y) {
    _x = x;
    _y = y;
    _catchy.cssHelper.update2DPosition(_el, _x, _y, 1, _rot, false);
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
    hide : hide,
    show : show,
    isShowing : isShowing,
    width: (_img != null) ? _img.width : 0,
    height: (_img != null) ? _img.height : 0
  };
  return _interface;
};
