_catchy.Droppable = function(sprite, isGood) {

  var _sprite = sprite,
      _spriteShadow,
      _x,
      _y,
      _height,
      _shadowY,
      _missedY,
      _scale,
      _baseScale,
      _speed,
      _active = false,
      _isCaught = false,
      _isGood;

  var init = function() {
    _baseScale = _catchy.screen.scaleV * 0.4;
    _scale = new EasingFloat(1, 5, 0.001);
    _speed = 5 * _catchy.screen.scaleV;
    _isGood = isGood;
    _spriteShadow = _catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.container, 'shadow', _catchy.screen.scaleV * _baseScale, getDimensions);
    _shadowY = _catchy.screen.height - (44 * _catchy.screen.scaleV);
    _missedY = _catchy.screen.height - (88 * _catchy.screen.scaleV);
    if(_sprite.height > 0) getDimensions();
  };

  var getDimensions = function() {
    if(_sprite.height != 0) _height = _sprite.height;
    _x = _catchy.screen.width / 2;
    _y = _catchy.screen.height - _sprite.height / 2;
    reset();
    _spriteShadow.setScale(_scale.value());
    update(0,0);
  };

  var reset = function() {
    _x = _catchy.screen.width * Math.random();
    _y = -_height;
    _scale.setTarget(_baseScale);
    _scale.setValue(0.01);

    _sprite.setRotation(MathUtil.randRangeDecimel(-20, 20));
    _sprite.setScale(0.01);
    _sprite.setPosition(_x, _y);
    _sprite.hide();

    _spriteShadow.hide();
    _spriteShadow.setPosition(_x, _y);

    _active = false;
    _isCaught = false;
  };

  var launch = function(xPos, yPos) {
    _x = xPos;
    _y = yPos - (_height / 2);
    _active = true;
    _spriteShadow.show();
    _scale.setValue(0.01);
    _sprite.setScale(_scale.value());
    _sprite.show();
  };

  var update = function() {
    if(_active == false) return;
    _scale.update();
    // update droppable
    _y += _speed;
    _sprite.setScale(_scale.value());
    _sprite.setPosition(_x, _y);
    if(_y > _catchy.screen.height + _height * 2) {
      reset();
    }
    // shrink down if not caught
    if(_y > _missedY) _scale.setTarget(0);
    if(_scale.value() < 0.05) {
      reset();
    }
    // update shadow
    _spriteShadow.setScale(_scale.value());
    _spriteShadow.setPosition(_x, _shadowY);
  };

  var updateCaughtPosition = function(catchX, catchY) {
    _x = MathUtil.easeTo(_x, catchX, 5);
    _y = MathUtil.easeTo(_y, catchY, 5);
  };

  var caught = function() {
    if(_isCaught == true) return;
    _isCaught = true;
    _scale.setTarget(0);
  };

  init();
  var _interface = {
    update : update,
    x : function(){ return _x; },
    y : function(){ return _y; },
    isActive : function(){ return _active; },
    isCaught : function(){ return _isCaught; },
    isGood : function(){ return _isGood; },
    launch : launch,
    reset : reset,
    caught: caught,
    updateCaughtPosition: updateCaughtPosition
  };
  return _interface;
};
