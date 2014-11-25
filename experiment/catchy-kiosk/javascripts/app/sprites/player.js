_catchy.Player = function() {

  var _x,
      _y,
      _shadowY,
      _spriteContainer,
      _shadowSprite,
      _sprite,
      _spriteCatch,
      _spriteHurt,
      _catchFrame,
      _caughtBad,
      _caughtBadCount,
      _score,
      _spriteRadius,
      _baseScale,
      _mouthX,
      _mouthY,
      CATCH_DIST;

  // testing
  var _startTime = Date.now();

  var init = function() {
    _baseScale = 0.5;
    _shadowSprite = _catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.container, 'shadow', _catchy.screen.scaleV * _baseScale, getDimensions);

    _spriteContainer = new _catchy.Sprite(_catchy.spriteBuilder.newSpriteContainer(_catchy.screen.container));
    _spriteContainer.setScale(_catchy.screen.scaleV * _baseScale);
    _sprite = _catchy.spriteBuilder.getScaledSvgFromSvg(_spriteContainer.el, 'birdie', _catchy.screen.scaleV, getDimensions);
    _spriteCatch = _catchy.spriteBuilder.getScaledSvgFromSvg(_spriteContainer.el, 'birdie-catch', _catchy.screen.scaleV, getDimensions);
    _spriteHurt = _catchy.spriteBuilder.getScaledSvgFromSvg(_spriteContainer.el, 'birdie-hurt', _catchy.screen.scaleV, getDimensions);
    _spriteCatch.hide();
    _spriteHurt.hide();

    CATCH_DIST = 45 * _catchy.screen.scaleV * _baseScale;
    reset();
  };

  var reset = function() {
    _score = 0;
    _catchFrame = 0;
    _caughtBad = false;
  };

  var getDimensions = function() {
    _spriteRadius = (_sprite.height * _catchy.screen.scaleV * _baseScale) / 2;
    _x = _catchy.screen.width / 2;
    _y = _catchy.screen.height - _spriteRadius - (37 * _catchy.screen.scaleV);
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
    if(_catchy.game.frameCount() < _catchFrame) {
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
        _catchFrame = _catchy.game.frameCount() + 15;
        if(droppable.isGood() == true) {
          _score += 1;
          _caughtBad = false;
        } else {
          _score -= 1;
          if(_score < 0) _score = 0;
          _caughtBad = true;
          _caughtBadCount = 0;
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
