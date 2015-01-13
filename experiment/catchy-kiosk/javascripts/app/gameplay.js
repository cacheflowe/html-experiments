_catchy.CatchyGameplay = function() {

  var _el,
      _active,
      _player,
      _mountain,
      _skyline,
      _buildingBear,
      _clocktower,
      _bush,
      _grass,
      _droppables,
      _timer,
      _score,
      _playing,
      _animating,
      _paused,
      _frameCount = 0;

  var init = function() {
    _el = document.getElementById('game-container');
    addDebugCommands();
    _paused = false;
    _playing = false;
    _animating = false;
    setTimeout(function(){
      buildSprites();
      buildShell();
      animate();
    },0);
    // setTimeout(function(){
    //   startGame();
    // }, 100);
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
    _buildingBear = new _catchy.BuildingBear();
    _clocktower = new _catchy.Clocktower();
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
    // _timer.startGame();
  };

  var startAnimation = function() {
    _timer.reset();
    _score.reset();
    _player.reset();
    _droppables.reset();
    _catchy.sounds.stopSound(_catchy.sounds.INTRO_LOOP);
    _catchy.sounds.playSound(_catchy.sounds.WAITING_LOOP, true);
    _animating = true;
  };

  var setActive = function(active) {
    _active = active
    if(_active == true) {
      startGame();
    }
  };


  var startGame = function() {
    _playing = true;
    // _score.reset();
    _timer.startGame();
    // _player.reset();
    // _droppables.reset();
    _catchy.sounds.stopSound(_catchy.sounds.WAITING_LOOP);
    _catchy.sounds.playSound(_catchy.sounds.OHY_LOOP, true);
  };

  var animate = function() {
    window.stats.begin();
    window.requestAnimFrame(animate);
    // window.setTimeout(animate, 200);
    if((_paused == false && _animating == true) || _frameCount < 3) {
      _frameCount++;

      // if(_timer.isActive() == true) {
      _catchy.touchControl.percentX.update();

      // move active game objects
      _player.update();
      _droppables.update(_timer.isActive());

      // move scene objects (removed parallax for now)
      if(_frameCount < 10) {
        _mountain.update();
        _skyline.update();
        _buildingBear.update();
        _clocktower.update();
        _bush.update();
        _grass.update();
      }

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
      _catchy.sounds.stopSound(_catchy.sounds.OHY_LOOP);
      _catchy.sounds.playSound(_catchy.sounds.WIN);
      _playing = false;
      setTimeout(function(){
        _catchy.pageManager.setPageActive(_catchy.titleScreen);
        // startGame();
        _animating = false;
      },2000);
    }
  };

  var isPlaying = function() {
    return _playing;
  };

  init();
  return {
    startAnimation: startAnimation,
    setActive: setActive,
    el: _el,
    animate: animate,
    setScore: setScore,
    setPlayerColor: setPlayerColor,
    gameOver: gameOver,
    isPlaying: isPlaying,
    frameCount: function(){ return _frameCount; }
  };
};
