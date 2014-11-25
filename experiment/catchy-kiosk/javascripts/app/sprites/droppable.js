_catchy.Droppable = function(sprite, isGood) {

  var _sprite = sprite,
      _x,
      _y,
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
    if(_sprite.height > 0) getDimensions();
  };

  var getDimensions = function() {
    _x = _catchy.screen.width / 2;
    _y = _catchy.screen.height - _sprite.height / 2;
    reset();
    update(0,0);
  };

  var reset = function() {
    _x = _catchy.screen.width * Math.random();
    _y = -_sprite.height;
    _sprite.setPosition(_x, _y);
    _sprite.setRotation(MathUtil.randRangeDecimel(-20, 20));
    _scale.setTarget(_baseScale);
    _scale.setValue(_baseScale);
    _active = false;
    _isCaught = false;
  };

  var launch = function(xPos) {
    _x = xPos;
    _y = -_sprite.height / 2;
    _active = true;
  };

  var update = function(playerX, playerY) {
    if(_active == false) return;
    _scale.update();
    _y += _speed;
    _sprite.setPosition(_x, _y);
    _sprite.setScale(_scale.value());
    if(_y > _catchy.screen.height + _sprite.height * 2) {
      reset();
    }
    if(_scale.value() < 0.05) {
      reset();
    }
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
  return {
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
};
