_catchy.Droppable = function(sprite) {

  var _sprite = sprite,
      _x,
      _y;

  var init = function() {
    if(_sprite.height > 0) getDimensions();
    _x = _catchy.screen.width * Math.random();
    _y = -_catchy.screen.height * Math.random();
  };

  var getDimensions = function() {
    _x = _catchy.screen.width / 2;
    _y = _catchy.screen.height - _sprite.height / 2;
  };

  var update = function(xPercent) {
    _y += 5 * _catchy.screen.scaleV;
    if(_y > _catchy.screen.height + _sprite.height) {
      _y = -_sprite.height;
    }
    _sprite.setPosition(_x, _y);
  };

  init();
  return {
    update : update
  };
};
