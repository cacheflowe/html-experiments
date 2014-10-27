_catchy.CatchyGame = function() {

  var _player,
      _grass,
      _mountain,
      _droppables;

  var init = function() {
    buildSprites();
    animate();
  };

  var buildSprites = function() {
    _mountain = new _catchy.Mountain();
    _grass = new _catchy.Grass();
    _player = new _catchy.Player();
    _droppables = new _catchy.Droppables();
  };

  var animate = function() {
    window.stats.begin();
    window.requestAnimFrame(animate);

    _catchy.touchControl.percentX.update();

    _player.update();
    _mountain.update();
    _grass.update();
    _droppables.update();
    
    window.stats.end();
  };

  init();
  return {
    animate: animate
  };
};
