_catchy.CatchySounds = function() {

  var init = function() {
    soundManager.setup({
      debugMode: false,
      onready: function() {
        buildSounds();
      }
    });
  };

  var buildSounds = function() {
    _public.BOING_TOM =         soundManager.createSound({multiShot: false, url: './audio/sfx/boing-tom.wav'});
    _public.DRIP_LOW =          soundManager.createSound({multiShot: false, url: './audio/sfx/drip-low.wav'});
    _public.LONG_NOTE_END =     soundManager.createSound({multiShot: false, url: './audio/sfx/long-note-end.wav'});
    _public.LONG_NOTE =         soundManager.createSound({multiShot: false, url: './audio/sfx/long-note.wav'});
    _public.MISTAKE =           soundManager.createSound({multiShot: false, url: './audio/sfx/mistake.wav'});
    _public.PLAYERS_DETECTED =  soundManager.createSound({multiShot: false, url: './audio/sfx/players-detected.wav'});
    _public.RING =              soundManager.createSound({multiShot: false, url: './audio/sfx/ring-2.wav'});
    _public.STEP_OUT =          soundManager.createSound({multiShot: false, url: './audio/sfx/step-out.wav'});
    _public.TA_DA_FLUTE =       soundManager.createSound({multiShot: false, url: './audio/sfx/ta-da-flute-2.wav'});
    _public.INTRO_LOOP =        soundManager.createSound({multiShot: false, loops: true,url: './audio/soundtrack/catchy-intro-loop.wav'});
    _public.WAITING_LOOP =      soundManager.createSound({multiShot: false, loops: true,url: './audio/soundtrack/catchy-waiting-loop.wav'});
    _public.OHY_LOOP =          soundManager.createSound({multiShot: false, loops: true, url: './audio/soundtrack/ohy-loop.wav'});
    _public.WIN =               soundManager.createSound({multiShot: false, url: './audio/soundtrack/win.wav'});
  };

  var playSound = function(sound, loops) {
    if(loops == true) {
      sound.play({ loops: 999 });
    } else {
      sound.play();
    }
  };

  var stopSound = function(sound) {
    sound.stop();
  };

  _public = {
    playSound: playSound,
    stopSound: stopSound
  };
  init();
  return _public;
};

