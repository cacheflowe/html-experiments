_catchy.Grass = function() {

  var _sprite,
      _x,
      _y;

  var init = function() {
    _sprite = _catchy.spriteBuilder.getScaledImageFromSVG(_catchy.screen.container, 'grass', _catchy.screen.scaleV, getDimensions);
    if(_sprite.height > 0) getDimensions();
  };

  var getDimensions = function() {
    _x = _catchy.screen.width / 2;
    _y = _catchy.screen.height - _sprite.height / 2;
  };

  var update = function(xPercent) {
    _x = _catchy.screen.width/2 + (-0.5 + _catchy.touchControl.percentX.value()) * (_catchy.screen.width * 0.2);
    _sprite.setPosition(_x, _y);
  };

  init();
  return {
    update : update
  };
};
