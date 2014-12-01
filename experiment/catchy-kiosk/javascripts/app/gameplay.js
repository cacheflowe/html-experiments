_catchy.CatchyGameplay = function() {

  var _player,
      _mountain,
      _skyline,
      _building,
      _bush,
      _grass,
      _droppables,
      _timer,
      _score,
      _playing,
      _paused,
      _frameCount = 0;

  var init = function() {
    addDebugCommands();
    _paused = false;
    _playing = false;
    setTimeout(function(){
      buildSprites();
      buildShell();
      animate();
    },0);
    setTimeout(function(){
      startGame();
    }, 100);
  };

  var addDebugCommands = function() {
    window.onkeyup = function(e) {
      var key = e.keyCode ? e.keyCode : e.which;
      if (key == 80) {
        _paused = !_paused;
      }
    }
  };

  var buildSprites = function() {
    _mountain = new _catchy.Mountain();
    _skyline = new _catchy.Skyline();
    _building = new _catchy.Building();
    _bush = new _catchy.Bush();
    _grass = new _catchy.Grass();
    _droppables = new _catchy.Droppables();
    _player = new _catchy.Player();

    // post-creation linking
    _droppables.setPlayer(_player);
  };

  var buildShell = function() {
    _score = new _catchy.Score();
    _timer = new _catchy.Timer();
    _timer.startGame();
  };

  var startGame = function() {
    _playing = true;
    _score.reset();
    _timer.startGame();
    _player.reset();
    _droppables.reset();
  };

  var animate = function() {
    window.stats.begin();
    window.requestAnimFrame(animate);
    // window.setTimeout(animate, 200);
    if(_paused == false) {    
      _frameCount++;

      // if(_timer.isActive() == true) {
      _catchy.touchControl.percentX.update();

      _player.update();
      _mountain.update();
      _skyline.update();
      _building.update();
      _bush.update();
      _grass.update();
      _droppables.update(_timer.isActive());

      _timer.update();
    }
    window.stats.end();
  };

  var setScore = function(score) {
    if(_score) _score.setScore(score);
  };

  var setPlayerColor = function(colorHex, characterId) {
    if(_score) _score.setColor(colorHex, characterId);
  };

  var gameOver = function() {
    if(_playing == true) {
      _playing = false;
      setTimeout(function(){
        startGame();
      },2000);
    }
  };

  var isPlaying = function() {
    return _playing;
  };

  init();
  return {
    animate: animate,
    setScore: setScore,
    setPlayerColor: setPlayerColor,
    gameOver: gameOver,
    isPlaying: isPlaying,
    frameCount: function(){ return _frameCount; }
  };
};
