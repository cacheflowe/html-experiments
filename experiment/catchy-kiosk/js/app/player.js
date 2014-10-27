_catchy.Player = function() {

  var _x,
      _y,
      _shadowY,
      _spriteContainer,
      _shadowSprite,
      _sprite,
      _spriteCatch;

  // testing
  var _startTime = Date.now();

  var init = function() {
    _shadowSprite = _catchy.spriteBuilder.getScaledImageFromSVG(_catchy.screen.container, 'shadow', _catchy.screen.scaleV, getDimensions);

    _spriteContainer = new _catchy.Sprite(_catchy.spriteBuilder.newSpriteContainer(_catchy.screen.container));
    _sprite = _catchy.spriteBuilder.getScaledImageFromSVG(_spriteContainer.el, 'birdie', _catchy.screen.scaleV, getDimensions);
    _spriteCatch = _catchy.spriteBuilder.getScaledImageFromSVG(_spriteContainer.el, 'birdie-catch', _catchy.screen.scaleV, getDimensions);
    _spriteCatch.hide();
  };

  var getDimensions = function() {
    _x = _catchy.screen.width / 2;
    _y = _catchy.screen.height - _sprite.height / 2 - (17 * _catchy.screen.scaleV);
    _shadowY = _catchy.screen.height - (22 * _catchy.screen.scaleV);
  };

  var update = function(xPercent) {
    var newX = _catchy.touchControl.percentX.value() * _catchy.screen.width;
    var speed = newX - _x;
    _x = newX;

    _spriteContainer.setRotation(speed/2);
    _spriteContainer.setPosition(_x, _y);
    _shadowSprite.setPosition(_x, _shadowY);

    // testing: toggle sprite state
    if(Date.now() > _startTime + 500) {
      _startTime = Date.now();
      if(_sprite.isShowing() == true) {
        _sprite.hide();
        _spriteCatch.show();
      } else {
        _sprite.show();
        _spriteCatch.hide();
      }
    }

  };

  init();
  return {
    update : update
  };
};
