_catchy.Mountain = function() {

  var _sprite,
      _x,
      _y,
      _baseScale;

  var init = function() {
    _baseScale = 0.46;
    _sprite = _catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.container, 'mountain', _catchy.screen.scaleV * _baseScale, getDimensions);
    if(_sprite.height > 0) getDimensions();
  };

  var getDimensions = function() {
    _x = _catchy.screen.width / 2;
    _y = _catchy.screen.height - (_sprite.height * _baseScale) / 2;
  };

  var update = function(xPercent) {
    _x = _catchy.screen.width/2 + (-0.5 + _catchy.touchControl.percentX.value()) * (_catchy.screen.width * 0.02);
    _sprite.setPosition(_x, _y);
  };

  init();
  return {
    update : update
  };
};
