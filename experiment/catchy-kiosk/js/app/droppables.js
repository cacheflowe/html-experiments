_catchy.Droppables = function() {

  var _items;

  var _goodItems = ['ice-cream', 'diamond', 'coin', 'candy', 'apple'];
  var _badItems = ['bomb', 'sword', 'dirty-sock', 'brick'];

  var init = function() {
    _items = [];
    for (var i = _goodItems.length - 1; i >= 0; i--) {
      _items.push(new _catchy.Droppable(_catchy.spriteBuilder.getScaledImageFromSVG(_catchy.screen.container, _goodItems[i], _catchy.screen.scaleV, null)));
    };
    for (var i = _badItems.length - 1; i >= 0; i--) {
      _items.push(new _catchy.Droppable(_catchy.spriteBuilder.getScaledImageFromSVG(_catchy.screen.container, _goodItems[i], _catchy.screen.scaleV, null)));
    };
  };

  var update = function(xPercent) {
    for (var i = _items.length - 1; i >= 0; i--) {
      _items[i].update();
    }
  };

  init();
  return {
    update : update
  };
};
