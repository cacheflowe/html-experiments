_catchy.Mountain = function() {

  var _sprite = _catchy.spriteBuilder.getScaledImageFromSVG(_catchy.screen.container, 'mountain', _catchy.screen.scaleV);

  var _x = _catchy.screen.width / 2;
  var _y = _catchy.screen.height - _sprite.height / 2;

  var init = function() {

  };

  var update = function(xPercent) {
    _x = _catchy.screen.width/2 + (-0.5 + _catchy.touchControl.percentX.value()) * (_catchy.screen.width * 0.1);
    _sprite.setPosition(_x, _y);
  };

  init();
  return {
    update : update
  };
};
