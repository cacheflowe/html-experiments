_catchy.Score = function() {

  var _sprite,
      _spriteText,
      _spriteBgFill,
      _charId,
      _x,
      _y,
      _score;

  var init = function() {
    _sprite = _catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.container, 'score-bg', _catchy.screen.scaleV, getDimensions);
    _spriteText = _catchy.spriteBuilder.getTextField(_catchy.screen.container, _catchy.screen.scaleV, "0");
    _spriteBgFill = document.getElementById('score-color-bg');
    if(_sprite.height > 0) getDimensions();
    reset();
  };

  var getDimensions = function() {
    _scale = 0.46 * _catchy.screen.scaleV;
    var padding = _catchy.screen.scaleV * 20;
    _x = (_sprite.width * _scale) / 2 + padding;
    _y = (_sprite.height * _scale) / 2 + padding;
    _sprite.setScale(_scale);
    _sprite.setPosition(_x, _y);

    _spriteText.setScale(_catchy.screen.scaleV * 0.63);
    _spriteText.setTextFontSize('48px');
    _spriteText.setTextWidth(150);
    _spriteText.setPosition(_x + _catchy.screen.scaleV * 0, _y - _catchy.screen.scaleV * 14);
  };

  var reset = function() {
    _score = 0;
    setScore(0);
  };

  var setScore = function(score) {
    _score = score;
    _spriteText.setText(_score);
  };

  var setColor = function(colorHex, characterId) {
    _spriteText.setTextColor(colorHex);
    if(_spriteBgFill != null && _spriteBgFill.classList != null) _spriteBgFill.classList.remove(_charId);
    _charId = characterId;
    if(_spriteBgFill != null && _spriteBgFill.classList != null) _spriteBgFill.classList.add(_charId);
  };

  init();
  return {
    reset : reset,
    setScore : setScore,
    setColor : setColor
  };
};
