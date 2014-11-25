_catchy.CatchyGame = function() {

  var _player,
      _grass,
      _mountain,
      _droppables,
      _frameCount = 0;

  var init = function() {
    setTimeout(function(){
      buildSprites();
      animate();
    },0);
  };

  var buildSprites = function() {
    _mountain = new _catchy.Mountain();
    _skyline = new _catchy.Skyline();
    _building = new _catchy.Building();
    _grass = new _catchy.Grass();
    _player = new _catchy.Player();
    _droppables = new _catchy.Droppables();

    // post-creation linking
    _droppables.setPlayer(_player);
  };

  var animate = function() {
    window.stats.begin();
    window.requestAnimFrame(animate);
    _frameCount++;

    _catchy.touchControl.percentX.update();

    _player.update();
    _mountain.update();
    _skyline.update();
    _building.update();
    _grass.update();
    _droppables.update();
    
    window.stats.end();
  };

  init();
  return {
    animate: animate,
    frameCount: function(){ return _frameCount; }
  };
};
