_catchy.Bush = function() {

  var _sprite,
      _x,
      _y,
      _scale;

  var init = function() {
    _scale = 0.42 * _catchy.screen.scaleV;
    _sprite = _catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.container, 'bush', _catchy.screen.scaleV, getDimensions);
    if(_sprite.height > 0) getDimensions();
  };

  var getDimensions = function() {
    _x = _catchy.screen.width / 2;
    _y = _catchy.screen.height - (_sprite.height * _scale) / 2 - (_catchy.screen.scaleV * 75);
  };

  var update = function(xPercent) {
    _x = _catchy.screen.width - _catchy.screen.width/4 + (-0.5 + _catchy.touchControl.percentX.value()) * (_catchy.screen.width * 0.085);
    _sprite.setScale(_scale);
    _sprite.setPosition(_x, _y);
  };

  init();
  return {
    update : update
  };
};
