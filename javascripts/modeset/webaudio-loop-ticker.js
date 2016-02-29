var WebAudioLoopTicker = function(url, ticks, vol, debugEl) {
	/////////////////////////////////////
	// tick timing
	/////////////////////////////////////
	var startTime = 0;
	var audioTimeOffset = 0.1; // helps with the visual timing
	var tickTime = 0;
	var curTick = 0;
	var lastTick = 0;
	var tickChanged = false;

	/////////////////////////////////////
	// create webaudio context
	/////////////////////////////////////
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	var context = new AudioContext();


	/////////////////////////////////////
	// set up analyser & beat detection
	/////////////////////////////////////
	var waveData = []; //waveform - from 0 - 1 . no sound is 0.5. Array [binCount]
	var levelsData = []; //levels of each frequecy - from 0 - 1 . no sound is 0. Array [levelsCount]
	var volume = 0; // averaged normalized level from 0 - 1
	var bpmTime = 0; // bpmTime ranges from 0 to 1. 0 = on beat. Based on tap bpm
	var ratedBPMTime = 550;//time between beats (msec) multiplied by BPMRate
	var levelHistory = []; //last 256 ave norm levels
	var bpmStart; //FIXME

	var BEAT_HOLD_TIME = 40; //num of frames to hold a beat
	var BEAT_DECAY_RATE = 0.98;
	var BEAT_MIN = 0.15; //level less than this is no beat

	//BPM STUFF
	var count = 0;
	var msecsFirst = 0;
	var msecsPrevious = 0;
	var msecsAvg = 633; //time between beats (msec)

	var timer;
	var gotBeat = false;

	var debugCtx;
	var debugW = 250;
	var debugH = 200;
	var chartW = 220;
	var chartH = 160;
	var aveBarWidth = 30;
	var bpmHeight = debugH - chartH;
	var debugSpacing = 2;

	var gradient;

	var freqByteData; //bars - bar data is from 0 - 256 in 512 bins. no sound is 0;
	var timeByteData; //waveform - waveform data is from 0-256 for 512 bins. no sound is 128.
	var levelsCount = 16; //should be factor of 512

	var binCount; //512
	var levelBins;

	var isPlayingAudio = false;

	var beatCutOff = 0;
	var beatTime = 0;

	var source;
	var buffer;
	var audioBuffer;
	var dropArea;
	//var processor;
	var analyser;

	var high = 0;

	var usingMic = false;
	var usingAudioFile = false;
	var showingDebug = true;
	var fakeBpmMode = false;
	var volSens = 1;
	var beatHoldTime = 40;
	var beatDecayRate = 0.97;
	var bpmMode =  false;
	var bpmRate = 0;
	var beatHappened = false;

	/////////////////////////////////////
	// build analyser node
	/////////////////////////////////////
	analyser = context.createAnalyser();
	analyser.smoothingTimeConstant = 0.3; //smooths out bar chart movement over time
	analyser.fftSize = 1024;
	// analyser.connect(context.destination);
	binCount = analyser.frequencyBinCount; // = 512
	levelBins = Math.floor(binCount / levelsCount); //number of bins in each level

	freqByteData = new Uint8Array(binCount);
	timeByteData = new Uint8Array(binCount);

	var length = 256;
	for(var i = 0; i < length; i++) {
			levelHistory.push(0);
	}

	// perfect webaudio looping from: http://stackoverflow.com/questions/29882907/how-to-seamlessly-loop-sound-with-web-audio-api
	// var url = 'data:audio/wav;base64,';
	/////////////////////////////////////
	// setup webaudio chain
	/////////////////////////////////////
	var source = context.createBufferSource();
	var gainNode = context.createGain();
	source.connect(gainNode);
	gainNode.gain.value = vol;
	// gainNode.connect(context.destination);
	gainNode.connect(analyser);
	analyser.connect(context.destination);




	// load audio file
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.responseType = 'arraybuffer';
	request.onload = function() {
		context.decodeAudioData(request.response, function(response) {
			source.buffer = response;
			console.log('playing:');
			console.log('source.buffer.duration', source.buffer.duration);
			console.log('context.currentTime', context.currentTime);
		}, function () { console.error('The request failed.'); } );
	}
	request.send();

	function playAudio(){
		source.start(0);
		source.loop = true;
		startTime = context.currentTime;
		tickTime = source.buffer.duration / ticks;
		requestAnimationFrame(animate);
	}

	function update() {
		var playbackTime = (context.currentTime - startTime) % source.buffer.duration + audioTimeOffset;
		curTick = Math.floor(playbackTime / tickTime) % ticks;
		if(debugEl != null) {
			debugEl.querySelector('.debugTxt').innerHTML =
			'context.currentTime = ' + playbackTime + '<br>' +
			'tick = ' + curTick;
		}
		tickChanged = (curTick != lastTick);
		lastTick = curTick;

		updateAnalysis();
		if(debugEl != null) debugDraw();
	}

	function updateAnalysis() {
		// GET DATA
		analyser.getByteFrequencyData(freqByteData);  // <-- bar chart
		analyser.getByteTimeDomainData(timeByteData); // <-- waveform

		// normalize waveform data
		for(var i = 0; i < binCount; i++) {
			waveData[i] = ((timeByteData[i] - 128) /128 )* volSens;
		}

		//normalize levelsData from freqByteData
		for(var i = 0; i < levelsCount; i++) {
			var sum = 0;
			for(var j = 0; j < levelBins; j++) {
				sum += freqByteData[(i * levelBins) + j];
			}
			levelsData[i] = sum / levelBins/256 * volSens; //freqData maxs at 256
		}

		//GET AVG LEVEL
		var sum = 0;
		for(var j = 0; j < levelsCount; j++) {
			sum += levelsData[j];
		}
		volume = sum / levelsCount;

		// high = Math.max(high,level);
		levelHistory.push(volume);
		levelHistory.shift(1);

		//BEAT DETECTION
		if (volume > beatCutOff && volume > BEAT_MIN){
			beatHappened = true;
			beatCutOff = volume *1.1;
			beatTime = 0;
		} else {
			beatHappened = false;
			if (beatTime <= beatHoldTime){
				beatTime ++;
			} else {
				beatCutOff *= beatDecayRate;
				beatCutOff = Math.max(beatCutOff,BEAT_MIN);
			}
		}
		bpmTime = (new Date().getTime() - bpmStart)/msecsAvg;
	}

	function buildDebugDraw() {
		var canvas = document.createElement("canvas");
		canvas.width = debugW;
		canvas.height = debugH;
		debugEl.appendChild(canvas);

		debugCtx = canvas.getContext('2d');
		debugCtx.width = debugW;
		debugCtx.height = debugH;
		debugCtx.fillStyle = "rgb(40, 40, 40)";
		debugCtx.lineWidth=2;
		debugCtx.strokeStyle = "rgb(255, 255, 255)";
		// $('#audio-debugCtx').hide();

		gradient = debugCtx.createLinearGradient(0,0,0,256);
		gradient.addColorStop(1,'#330000');
		gradient.addColorStop(0.75,'#aa0000');
		gradient.addColorStop(0.25,'#aaaa00');
		gradient.addColorStop(0,'#aaaaaa');
	}
	if(debugEl != null) buildDebugDraw();

	function debugDraw() {

		debugCtx.clearRect(0, 0, debugW, debugH);
		//draw chart bkgnd
		debugCtx.fillStyle = "#000";
		debugCtx.fillRect(0,0,debugW,debugH);

		//DRAW BAR CHART
		// Break the samples up into bars
		var barWidth = chartW / levelsCount;
		debugCtx.fillStyle = gradient;
		for(var i = 0; i < levelsCount; i++) {
			debugCtx.fillRect(i * barWidth, chartH, barWidth - debugSpacing, -levelsData[i]*chartH);
		}

		//DRAW AVE LEVEL + BEAT COLOR
		if (beatTime < 6){
			debugCtx.fillStyle="#FFF";
		}
		debugCtx.fillRect(chartW, chartH, aveBarWidth, -volume*chartH);

		//DRAW CUT OFF
		debugCtx.beginPath();
		debugCtx.moveTo(chartW , chartH - beatCutOff*chartH);
		debugCtx.lineTo(chartW + aveBarWidth, chartH - beatCutOff*chartH);
		debugCtx.stroke();

		//DRAW WAVEFORM
		debugCtx.beginPath();
		for(var i = 0; i < binCount; i++) {
			debugCtx.lineTo(i/binCount*chartW, waveData[i]*chartH/2 + chartH/2);
		}
		debugCtx.stroke();
	}

	return {
		playAudio: playAudio,
		update: update,
		numTicks: function() { return ticks; },
		curTick: function() { return curTick; },
		lastTick: function() { return lastTick; },
		tickChanged: function() { return tickChanged; },
		beatHappened: function() { return beatHappened; }
	};
};
