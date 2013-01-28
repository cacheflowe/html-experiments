function SoundPlayer( file, context, loadedCallback, analysisAverages ) {
  if(SoundPlayer.hasWebAudio()) {
    this.audioContext = context || new webkitAudioContext();
    this.file = file;
    this.pan = 0;
    this.volume = 1;
    this.loops = false;
    this.loadAudio();
    this.playOnLoad = false;
    this.loadedCallback = loadedCallback;

    if(analysisAverages > 0) this.createAnalyzer(analysisAverages);
  }
}

SoundPlayer.hasWebAudio = function() {
  return ('webkitAudioContext' in window);
}

SoundPlayer.prototype.createAnalyzer = function(analysisAverages) {
  this.analyser = this.audioContext.createAnalyser();
  this.analyser.smoothingTimeConstant = 0.5;
  // create averaged analysis array so we're not always creating new ones
  this.averages = [];
  for(var i=0; i < analysisAverages; i++) this.averages.push(0);
};

SoundPlayer.prototype.playSound = function() {
  if(!SoundPlayer.hasWebAudio()) return;
  if( !this.buffer ) {
    this.playOnLoad = true;
  } else {
    var sourceNode = this.audioContext.createBufferSource();
    sourceNode.buffer = this.buffer;
    sourceNode.loop = this.loops;

    var panner = this.audioContext.createPanner();
    panner.setPosition(this.pan, 0, 0);
    sourceNode.connect(panner);

    var volume = this.audioContext.createGainNode();
    volume.gain.value = this.volume;

    panner.connect(volume);
    if(this.analyser) {
      volume.connect( this.analyser );
      this.analyser.connect( this.audioContext.destination );
    } else {
      volume.connect( this.audioContext.destination );
    }

    this.sound = sourceNode;
    this.sound.noteOn(0);
  }
}

SoundPlayer.prototype.stopSound = function() {
  if (this.sound) this.sound.noteOff(0);
  // this.sound = null;
}

SoundPlayer.prototype.setVolume = function(volume) {
  this.volume = volume;
  console.log(volume);
}

SoundPlayer.prototype.setPan = function(pan) {
  this.pan = pan;
}

SoundPlayer.prototype.setLoops = function(loops) {
  this.loops = loops;
}

SoundPlayer.prototype.loadAudio = function() {
  var self = this;
  var request = new XMLHttpRequest();
  request.open("GET", this.file, true);
  request.responseType = "arraybuffer";
  request.onload = function() {
    self.audioContext.decodeAudioData( request.response, function(buffer) { 
        self.buffer = buffer;
        if( self.playOnLoad ) self.playSound();
        if( self.loadedCallback ) self.loadedCallback( self.file )
    } );
  }
  request.send();
}

SoundPlayer.prototype.getSpectrum = function() {
  var freqByteData = new Uint8Array(this.analyser.frequencyBinCount);
  this.analyser.getByteFrequencyData(freqByteData);
  return freqByteData;
};

SoundPlayer.prototype.getAveragedSpectrum = function() {
  var freqByteData = this.getSpectrum();
  // store averaged data
  var j = 0,
      i = 0,
      step = 0;
  // optimized Math.floor()ing depending on whether the averages are less or greater than system EQ (1024)
  if( freqByteData.length > this.averages.length ) {
    step = Math.floor(freqByteData.length / this.averages.length);
    for(i=0; i < this.averages.length; i++) {
      this.averages[i] = freqByteData[j];
      j += step;
    }
  } else {
    step = freqByteData.length / this.averages.length;
    for(i=0; i < this.averages.length; i++) {
      this.averages[i] = freqByteData[Math.floor(j)];
      j += step;
    }
  }
  return this.averages;
};
