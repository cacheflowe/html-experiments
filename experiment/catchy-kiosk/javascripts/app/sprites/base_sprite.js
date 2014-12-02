_catchy.Sprite = function(divEl, imgEl, svgEl, textEl, loadedCallback) {

  var _x = 0,
      _y = 0,
      _rot = 0,
      _scale = 1,
      _el = divEl || _catchy.spriteBuilder.newSpriteContainer(),
      _img = imgEl,
      _textEl = textEl,
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
        getSvgDimensions();
        if(loadedCallback != null) loadedCallback();
      }, 1);
    }
  };
  
  var setOriginalSize = function(width, height) {
    _interface.width = width;
    _interface.height = height;
    // console.log(_svg.id, width, height);
  };

  var getSvgDimensions = function() {
    // console.log(srcSvg, srcSvg.getBoundingClientRect().width, srcSvg.getBoundingClientRect().width);
    // _interface.width = _svg.getBoundingClientRect().width;
    // _interface.height = _svg.getBoundingClientRect().height;
    // _el.setAttribute("width", parseFloat(_svg.offsetWidth));
    // _el.setAttribute("height", parseFloat(_svg.offsetHeight));
  };

  var setRotation = function(rot) {
    _rot = rot;
  };

  var setScale = function(scale) {
    _scale = scale;
    if(_svg != null) {
    // _interface.width = _svg.getBoundingClientRect().width;
    // _interface.height = _svg.getBoundingClientRect().height;
    }
  };

  var setPosition = function(x, y) {
    _x = x;
    _y = y;
    _catchy.cssHelper.update2DPosition(_el, _x, _y, _scale, _rot, false);
  };

  var setText = function(text) {
    _textEl.innerHTML = text;
  };

  var setTextFontSize = function(size) {
    _textEl.style.fontSize = size;
  };

  var setTextWidth = function(width) {
    _textEl.style.width = width + 'px';
    _textEl.style.marginLeft = (width/-2) + 'px';
  };

  var setTextColor = function(color) {
    _textEl.style.color = color;
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
    setOriginalSize : setOriginalSize,
    setPosition : setPosition,
    setRotation : setRotation,
    setScale : setScale,
    setText : setText,
    setTextFontSize : setTextFontSize,
    setTextWidth : setTextWidth,
    setTextColor : setTextColor,
    getSvgDimensions : getSvgDimensions,
    hide : hide,
    show : show,
    isShowing : isShowing,
    width: (_img != null) ? _img.width : 0,
    height: (_img != null) ? _img.height : 0
  };
  return _interface;
};
