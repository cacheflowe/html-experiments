_catchy.Timer = function() {

  var _sprite,
      _spriteText,
      _x,
      _y,
      _seconds,
      _lastSeconds,
      _curTime,
      _active,
      GAME_TIME = 30000;

  var init = function() {
    _active = false;
    _sprite = _catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.container, 'time-banner', _catchy.screen.scaleV, getDimensions);
    _spriteText = _catchy.spriteBuilder.getTextField(_catchy.screen.container, _catchy.screen.scaleV, "0:00");
    if(_sprite.height > 0) getDimensions();
  };

  var getDimensions = function() {
    _scale = 0.46 * _catchy.screen.scaleV;
    var padding = _catchy.screen.scaleV * 20;
    _x = _catchy.screen.width - (_sprite.width * _scale) / 2 - padding;
    _y = (_sprite.height * _scale) / 2 + padding;
    _sprite.setScale(_scale);
    _sprite.setPosition(_x, _y);

    _spriteText.setScale(_catchy.screen.scaleV * 0.63);
    _spriteText.setTextFontSize('48px');
    _spriteText.setTextWidth(150);
    _spriteText.setPosition(_x + _catchy.screen.scaleV * 8, _y - _catchy.screen.scaleV * 5);
  };

  var startGame = function() {
    _endTime = Date.now() + GAME_TIME;
    _active = true;
  };

  var isActive = function() {
    return _active;
  };

  var update = function(xPercent) {
    if(_active == false) return;
    _seconds = Math.round((_endTime - Date.now()) / 1000);
    if(_seconds <= 0) {
      _seconds = 0;
      _active = false;
    }
    if(_seconds != _lastSeconds) {
      if(_seconds > 9) 
        _spriteText.setText("0:"+_seconds);
      else
        _spriteText.setText("0:0"+_seconds);
    }
    _lastSeconds = _seconds;


  };

  init();
  return {
    update : update,
    startGame : startGame,
    isActive : isActive
  };
};
