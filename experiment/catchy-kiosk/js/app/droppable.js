_catchy.Droppable = function(sprite) {

  var _sprite = sprite,
      _x,
      _y,
      _active = false;

  var init = function() {
    if(_sprite.height > 0) getDimensions();
  };

  var getDimensions = function() {
    _x = _catchy.screen.width / 2;
    _y = _catchy.screen.height - _sprite.height / 2;
    reset();
  };

  var reset = function() {
    _x = _catchy.screen.width * Math.random();
    _y = -_sprite.height / 2;
    _sprite.setPosition(_x, _y);
  };

  var launch = function(xPos) {
    _x = xPos;
    _y = -_sprite.height / 2;
    _active = true;
  };

  var update = function(xPercent) {
    if(_active == false) return;
    _y += 5 * _catchy.screen.scaleV;
    if(_y > _catchy.screen.height + _sprite.height) {
      _y = -_sprite.height;
      _active = false;
    }
    _sprite.setPosition(_x, _y);
  };

  init();
  return {
    update : update,
    launch : launch,
    reset : reset
  };
};
