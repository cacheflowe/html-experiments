_catchy.Droppables = function() {

  var _items,
      _lastDropFrame,
      _nextDropIndex,
      _x,
      _y,
      _xIncrement,
      _spriteContainer,
      _sprite,
      _spriteAlmost,
      _spriteReady,
      _spriteX,
      _scale,
      _player;

  var _goodItems = ['ice-cream', 'diamond', 'coin', 'candy', 'apple'];
  // _goodItems = _goodItems.concat(_goodItems);
  // _goodItems = _goodItems.concat(_goodItems);
  // _goodItems = _goodItems.concat(_goodItems);
  var _badItems = ['bomb', 'sword', 'dirty-sock', 'brick'];
  // _badItems = _badItems.concat(_badItems);
  // _badItems = _badItems.concat(_badItems);

  var init = function() {
    _xIncrement = _catchy.screen.width / 10;
    buildDroppables();
    buildDropper();
    reset();
  };

  var buildDropper = function() {
    _scale = 0.42 * _catchy.screen.scaleV;
    _spriteX = new EasingFloat(0.5, 5, 0.001);

    _spriteContainer = new _catchy.Sprite(_catchy.spriteBuilder.newSpriteContainer(_catchy.screen.gameContainer));
    _spriteContainer.setScale(_catchy.screen.scaleV * _scale);

    _sprite = _catchy.spriteBuilder.getScaledSvgFromSvg(_spriteContainer.el, 'dropper', _catchy.screen.scaleV, getDimensions)
    _spriteAlmost = _catchy.spriteBuilder.getScaledSvgFromSvg(_spriteContainer.el, 'dropper-almost', _catchy.screen.scaleV, getDimensions);
    _spriteReady = _catchy.spriteBuilder.getScaledSvgFromSvg(_spriteContainer.el, 'dropper-ready', _catchy.screen.scaleV, getDimensions);
    if(_sprite.height > 0) getDimensions();
  };

  var getDimensions = function() {
    _scale = 0.42 * _catchy.screen.scaleV;
    _spriteContainer.setScale(_scale);
    _x = _catchy.screen.width / 2;
    _y = (_sprite.height * _scale) / 2;
    _spriteX.setTarget(_x);
    _spriteX.setValue(_x);
  };

  var buildDroppables = function() {
    _items = [];
    for (var i = 0; i < _goodItems.length; i++) {
      var item = new _catchy.Droppable(_catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.gameContainer, _goodItems[i], _catchy.screen.scaleV, null), true);
      _items.push(item);
    };
    for (var i = 0; i < _badItems.length; i++) {
      var item = new _catchy.Droppable(_catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.gameContainer, _badItems[i], _catchy.screen.scaleV, null), false);
      _items.push(item);
    };
  };

  // var buildDroppables = function() {
  //   _items = [];
  //   console.log('buildDroppables', _items);
  //   _items.push(new _catchy.Droppable(_catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.gameContainer, _goodItems[0], _catchy.screen.scaleV, null), true));
  // };

  var reset = function() {
    for (var i = _items.length - 1; i >= 0; i--) {
      _items[i].reset();
    }
    shuffleItems();
    _x = _catchy.screen.width / 2;
    _spriteX.setTarget(_x);
    _spriteX.setValue(_x);
    _lastDropFrame = _catchy.gameplay.frameCount();
    _nextDropIndex = 0;

    _sprite.show();
    _spriteAlmost.hide();
    _spriteReady.hide();
  };

  var shuffleItems = function() {
    for (var i = 0; i < _items.length; i++) {
      var randIndex = MathUtil.randRange(0,_items.length-1);
      var tmpItem = _items[i];
      var randItem = _items[randIndex];
      _items[i] = randItem;
      _items[randIndex] = tmpItem;
    };
  };

  var update = function(isActive) {
    if(_player == null) return;
    // update dropper
    _spriteX.update();
    _spriteContainer.setPosition(_spriteX.value(), _y);
    _spriteContainer.setScale(_scale);
    if(_catchy.gameplay.frameCount() == _lastDropFrame + 15) {
      // _spriteReady.show();
      // _spriteAlmost.hide();
    }

    // update droppables
    for (var i = _items.length - 1; i >= 0; i--) {
      if(_items[i] && _items[i].update) _items[i].update(); // _player.x(), _player.y()
    }
    // interval between drops
    if(isActive == true) {
      if(_catchy.gameplay.frameCount() > _lastDropFrame + 20) newDrop();
    }
    // check hit with player
    var isDone = true;
    if(_player) {
      for (var i = 0; i < _items.length; i++) {
        if(_items[i].isActive() == true && _items[i].isCaught() == false) {
          var didCatch = _player.checkHit(_items[i]);
          isDone = false;
        }
        if(_items[i].isCaught() == true) {
          _items[i].updateCaughtPosition(_player.mouthX(), _player.mouthY());
        }
      };
    }
    if(_catchy.gameplay.isPlaying() == true && _nextDropIndex > 0 && isDone == true) {
      _catchy.gameplay.gameOver();
    }
  };

  var newDrop = function() {
    // move drop x
    var moveX = (Math.random() > 0.5) ? -1 : 1;
    _x += moveX * _xIncrement;
    if(_x > _catchy.screen.width - _xIncrement) _x -= _xIncrement;
    if(_x < _xIncrement) _x += _xIncrement;

    _spriteX.setTarget(_x);

    _lastDropFrame = _catchy.gameplay.frameCount();
    var newDroppable = _items[_nextDropIndex];
    newDroppable.launch(_x, (_sprite.height * _scale));
    _nextDropIndex++;
    if(_nextDropIndex > _items.length - 1) _nextDropIndex = 0;

    // dropper should make a face for the right type of droppable
    if(newDroppable.isGood() == true) {
      _sprite.show();
      _spriteReady.hide();
      _spriteAlmost.hide();
    } else {
      _sprite.hide();
      _spriteReady.hide();
      _spriteAlmost.show();
    }
  };

  var isGood = function(item) {
    if(_goodItems.indexOf(item.id()) != -1) 
      return true;
    else
      return false;
  }

  var setPlayer = function(player) {
    _player = player;
  };

  init();
  return {
    reset : reset,
    update : update,
    setPlayer : setPlayer
  };
};
