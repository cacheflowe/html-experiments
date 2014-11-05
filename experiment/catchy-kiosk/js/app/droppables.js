_catchy.Droppables = function() {

  var _items,
      _lastDrop,
      _nextDropIndex,
      _curX,
      _xIncrement;

  var _goodItems = ['ice-cream', 'diamond', 'coin', 'candy', 'apple'];
  var _badItems = ['bomb', 'sword', 'dirty-sock', 'brick'];

  var init = function() {
    _xIncrement = _catchy.screen.width / 10;
    _items = [];
    for (var i = _goodItems.length - 1; i >= 0; i--) {
      _items.push(new _catchy.Droppable(_catchy.spriteBuilder.getScaledImageFromSVG(_catchy.screen.container, _goodItems[i], _catchy.screen.scaleV, null)));
    };
    for (var i = _badItems.length - 1; i >= 0; i--) {
      _items.push(new _catchy.Droppable(_catchy.spriteBuilder.getScaledImageFromSVG(_catchy.screen.container, _goodItems[i], _catchy.screen.scaleV, null)));
    };
    reset();
  };

  var reset = function() {
    for (var i = _items.length - 1; i >= 0; i--) {
      _items[i].reset();
    }
    _curX = _catchy.screen.width / 2;
    _lastDrop = Date.now();
    _nextDropIndex = 0;
  };

  var update = function(xPercent) {
    for (var i = _items.length - 1; i >= 0; i--) {
      _items[i].update();
    }
    if(Date.now() > _lastDrop + 1000) newDrop();
  };

  var newDrop = function() {
    // move drop x
    var moveX = (Math.random() > 0.5) ? -1 : 1;
    _curX += moveX * _xIncrement;
    if(_curX > _catchy.screen.width - _xIncrement) _curX -= _xIncrement;
    if(_curX < _xIncrement) _curX += _xIncrement;

    _lastDrop = Date.now();
    _items[_nextDropIndex].launch(_curX);
    _nextDropIndex++;
    if(_nextDropIndex > _items.length - 1) _nextDropIndex = 0;
  };

  init();
  return {
    update : update
  };
};
