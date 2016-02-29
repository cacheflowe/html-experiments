// videos
var cameraEl = document.getElementById('camera-input');

// navigator
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// get sources
MediaStreamTrack.getSources(function(sources) {
  var video_sources = [];
  for(var i=0; i < sources.length; i++) {
    if(sources[i].kind == "video") video_sources.push(sources[i]);
  }
  for(var i=0; i < video_sources.length; i++) {
    console.log(i+': '+video_sources[i].label);
  }

	connect(video_sources[0], cameraEl);
});

// connect
function connect(source, el) {
	navigator.getUserMedia(
		// config
		{
			'video': {
				'optional': [
					{'sourceId': source.id},
					// {'minWidth': 1920}
				]
			}
		},
		// success
		function(stream) {
			el.src = window.URL.createObjectURL(stream);
			el.play();
		},
		// fail
		function() {
			console.log('Stream ' + source.id + ' failed.');
		}
	);
}

function watchVideoInit() {
  if(cameraEl.videoWidth > 0) {
    initPIXI();
  } else {
    requestAnimationFrame(watchVideoInit);
  }
}
watchVideoInit();
