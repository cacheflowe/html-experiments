_catchy.Player = function() {

  var _x,
      _y,
      _shadowY,
      _sprites,
      _spriteContainer,
      _shadowSprite,
      _sprite,
      _spriteCatch,
      _spriteHurt,
      _characterIndex,
      _catchFrame,
      _caughtBad,
      _caughtBadCount,
      _score,
      _characterIds,
      _characterColors,
      _spriteRadius,
      _baseScale,
      _mouthX,
      _mouthY,
      CATCH_DIST;

  // testing
  var _startTime = Date.now();

  var init = function() {
    _x = _catchy.screen.width / 2;
    _baseScale = 0.5;
    _shadowSprite = _catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.gameContainer, 'shadow', _catchy.screen.scaleV * _baseScale, getDimensions);

    _spriteContainer = new _catchy.Sprite(_catchy.spriteBuilder.newSpriteContainer(_catchy.screen.gameContainer));
    _spriteContainer.setScale(_catchy.screen.scaleV * _baseScale);

    // build characters library
    _characterIndex = 0;
    _characterIds = ['cherry-chub', 'mama-mouth', 'broomschnauser', 'roberto', 'lil-missy', 'birdie'];
    _characterColors = ['#AD2135', '#118BC5', '#8DA52D', '#9EBAC7', '#ED7DAE', '#FED40A'];
    _sprites = [];
    for(var character in _characterIds) {
      var characterId = _characterIds[character];
      _sprites.push({
        sprite: _catchy.spriteBuilder.getScaledSvgFromSvg(_spriteContainer.el, characterId, _catchy.screen.scaleV, getDimensions),
        spriteCatch: _catchy.spriteBuilder.getScaledSvgFromSvg(_spriteContainer.el, characterId + '-catch', _catchy.screen.scaleV, getDimensions),
        spriteHurt: _catchy.spriteBuilder.getScaledSvgFromSvg(_spriteContainer.el, characterId + '-hurt', _catchy.screen.scaleV, getDimensions)
      });
    }
    // hide all characters to start
    for(var sprite in _sprites) {
      _sprites[sprite].sprite.hide();
      _sprites[sprite].spriteCatch.hide();
      _sprites[sprite].spriteHurt.hide();
    }

    CATCH_DIST = 45 * _catchy.screen.scaleV * _baseScale;
    reset();
  };

  var reset = function() {
    _score = 0;
    _catchFrame = 0;
    _caughtBad = false;
    nextCharacter();
  };

  var nextCharacter = function() {
    if(_sprite != null) _sprite.hide();
    if(_spriteCatch != null) _spriteCatch.hide();
    if(_spriteHurt != null) _spriteHurt.hide();

    _sprite = _sprites[_characterIndex].sprite;
    _sprite.show();
    _spriteCatch = _sprites[_characterIndex].spriteCatch;
    _spriteHurt = _sprites[_characterIndex].spriteHurt;

    _sprite.getSvgDimensions();
    getDimensions();

    _catchy.gameplay.setPlayerColor(_characterColors[_characterIndex], _characterIds[_characterIndex]);

    _characterIndex++;
    if(_characterIndex >= _sprites.length) _characterIndex = 0;
  };

  var getDimensions = function() {
    _spriteRadius = (_sprite.height * _catchy.screen.scaleV * _baseScale) / 2;
    _y = _catchy.screen.height - (37 * _catchy.screen.scaleV) - _spriteRadius;
    _shadowY = _catchy.screen.height - (44 * _catchy.screen.scaleV);
  };

  var update = function(xPercent) {
    var newX = _catchy.touchControl.percentX.value() * _catchy.screen.width;
    var speed = newX - _x;
    _x = newX;

    var rotationAngle = speed / 2;
    var rotationRads = MathUtil.degreesToRadians(rotationAngle);

    _spriteRadius = (_sprite.height * _catchy.screen.scaleV * _baseScale) / 2;
    _mouthX = _x - _spriteRadius * Math.sin(-rotationRads);
    _mouthY = _y - _spriteRadius * Math.cos(-rotationRads);

    _spriteContainer.setRotation(rotationAngle);
    _spriteContainer.setPosition(_x, _y);
    _shadowSprite.setPosition(_x, _shadowY);

    updateSpriteState();
  };

  var updateSpriteState = function() {
    if(_catchy.gameplay.frameCount() < _catchFrame) {
      if(_caughtBad == true && _caughtBadCount % 12 >= 6) {
        _sprite.hide();
        _spriteCatch.hide();
        _spriteHurt.show();
      } else {
        _sprite.hide();
        _spriteCatch.show();
        _spriteHurt.hide();
      }
      if(_caughtBad == true) _caughtBadCount++;
    } else if(_catchFrame > 0) {
      _catchFrame = 0;
      _sprite.show();
      _spriteCatch.hide();
      _spriteHurt.hide();
      _caughtBad = false;
      _caughtBadCount = 0;
    }
  };

  var checkHit = function(droppable) {
    if(droppable && droppable.isActive() == true) {
      var distance = MathUtil.getDistance(_mouthX, _mouthY, droppable.x(), droppable.y());
      if(distance < CATCH_DIST) {
        droppable.caught();
        _catchFrame = _catchy.gameplay.frameCount() + 15;
        if(droppable.isGood() == true) {
          _score += 1;
          _caughtBad = false;
          _catchy.gameplay.setScore(_score);
          _catchy.sounds.playSound(_catchy.sounds.DRIP_LOW);
        } else {
          _score -= 1;
          if(_score < 0) _score = 0;
          _catchy.gameplay.setScore(_score);
          _caughtBad = true;
          _caughtBadCount = 0;
          _catchy.sounds.playSound(_catchy.sounds.BOING_TOM);
        }
        // console.log('_score:',_score);
      }
    }
  };

  init();
  return {
    update : update,
    x : function(){ return _x; },
    y : function(){ return _y; },
    mouthX : function(){ return _mouthX; },
    mouthY : function(){ return _mouthY; },
    checkHit : checkHit,
    reset: reset
  };
};
