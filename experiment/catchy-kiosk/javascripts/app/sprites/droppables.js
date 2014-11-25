_catchy.Droppables = function() {

  var _items,
      _lastDropFrame,
      _nextDropIndex,
      _curX,
      _xIncrement,
      _player;

  var _goodItems = ['ice-cream', 'diamond', 'coin', 'candy', 'apple'];
  var _badItems = ['bomb', 'sword', 'dirty-sock', 'brick'];

  var init = function() {
    _xIncrement = _catchy.screen.width / 10;
    _items = [];
    for (var i = _goodItems.length - 1; i >= 0; i--) {
      _items.push(new _catchy.Droppable(_catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.container, _goodItems[i], _catchy.screen.scaleV, null), true));
    };
    for (var i = _badItems.length - 1; i >= 0; i--) {
      _items.push(new _catchy.Droppable(_catchy.spriteBuilder.getScaledSvgFromSvg(_catchy.screen.container, _badItems[i], _catchy.screen.scaleV, null), false));
    };
    reset();
  };

  var reset = function() {
    for (var i = _items.length - 1; i >= 0; i--) {
      _items[i].reset();
    }
    _curX = _catchy.screen.width / 2;
    _lastDropFrame = _catchy.game.frameCount();
    _nextDropIndex = 0;
  };

  var update = function() {
    if(_player == null) return;
    // update droppables
    for (var i = _items.length - 1; i >= 0; i--) {
      _items[i].update(_player.x(), _player.y());
    }
    // interval between drops
    if(_catchy.game.frameCount() > _lastDropFrame + 20) newDrop();
    // check hit with player
    if(_player) {
      for (var i = 0; i < _items.length; i++) {
        if(_items[i].isActive() == true && _items[i].isCaught() == false) {
          var didCatch = _player.checkHit(_items[i]);
        }
        if(_items[i].isCaught() == true) {
          _items[i].updateCaughtPosition(_player.mouthX(), _player.mouthY());
        }
      };
    }
  };

  var newDrop = function() {
    // move drop x
    var moveX = (Math.random() > 0.5) ? -1 : 1;
    _curX += moveX * _xIncrement;
    if(_curX > _catchy.screen.width - _xIncrement) _curX -= _xIncrement;
    if(_curX < _xIncrement) _curX += _xIncrement;

    _lastDropFrame = _catchy.game.frameCount();
    _items[_nextDropIndex].launch(_curX);
    _nextDropIndex++;
    if(_nextDropIndex > _items.length - 1) _nextDropIndex = 0;
  };

  var isGood = function(item) {
    if(_goodItems.indexOf(item) != -1) 
      return true;
    else
      return false;
  }

  var setPlayer = function(player) {
    _player = player;
  };

  init();
  return {
    update : update,
    setPlayer : setPlayer
  };
};
