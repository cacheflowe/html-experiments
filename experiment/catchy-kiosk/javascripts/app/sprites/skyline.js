_catchy.Skyline = function() {

  var _sprite,
      _x,
      _y,
      _scale;

  var init = function() {
    _sprite = _catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.container, 'skyline', _catchy.screen.scaleV, getDimensions);
    if(_sprite.height > 0) getDimensions();
  };

  var getDimensions = function() {
    _scale = 0.46 * _catchy.screen.scaleV;
    _x = _catchy.screen.width / 2;
    _y = _catchy.screen.height - (_sprite.height * _scale) / 2;
  };

  var update = function(xPercent) {
    _x = _catchy.screen.width/3 * 2 + (-0.5 + _catchy.touchControl.percentX.value()) * (_catchy.screen.width * 0.04);
    _sprite.setPosition(_x, _y);
    _sprite.setScale(_scale);
  };

  init();
  return {
    update : update
  };
};
