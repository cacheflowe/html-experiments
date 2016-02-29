var cameraEl = document.getElementById('camera-input');
var cameraTexture = PIXI.Texture.fromVideo(cameraEl);

var testVideoEl = document.getElementById('video-test');
testVideoEl.volume = 0;
var videoTexture = PIXI.Texture.fromVideo(testVideoEl);
// create a video texture from a path - must be done before video source is connected....

var diffFrame = document.getElementById('diff-frame');


function initPIXI() {

  // init PIXI
  window.renderer = PIXI.autoDetectRenderer(cameraEl.videoWidth, cameraEl.videoHeight, { transparent: true });
  document.body.appendChild(renderer.view);
  var stage = new PIXI.Container();

  // create a new Sprite using the video texture (yes it's that easy)
  window.videoSprite = new PIXI.Sprite(videoTexture);
  videoSprite.width = renderer.width;
  videoSprite.height = renderer.height;
  stage.addChild(videoSprite);

  window.cameraSprite = new PIXI.Sprite(cameraTexture);
  cameraSprite.width = renderer.width;
  cameraSprite.height = renderer.height;
  stage.addChild(cameraSprite);

  // add filters
  var tvFilter = new TVFilter();
  // window.grayFiler = new PIXI.filters.GrayFilter();
  // grayFiler.gray = 1;
  window.chromaFilter = new ChromaColorFilter();
  cameraSprite.filters = [chromaFilter];

  // add sliders for filter
  document.getElementById('colorR').addEventListener('input', function(){
    chromaFilter.colorToReplace = [document.getElementById('colorR').value, document.getElementById('colorG').value, document.getElementById('colorB').value];
  });
  document.getElementById('colorG').addEventListener('input', function(){
    chromaFilter.colorToReplace = [document.getElementById('colorR').value, document.getElementById('colorG').value, document.getElementById('colorB').value];
  });
  document.getElementById('colorB').addEventListener('input', function(){
    chromaFilter.colorToReplace = [document.getElementById('colorR').value, document.getElementById('colorG').value, document.getElementById('colorB').value];
  });
  document.getElementById('thresh').addEventListener('input', function(){
    chromaFilter.thresholdSensitivity = document.getElementById('thresh').value;
  });
  document.getElementById('smooth').addEventListener('input', function(){
    chromaFilter.smoothing = document.getElementById('smooth').value;
  });
  document.getElementById('mode').addEventListener('input', function(){
    chromaFilter.chromaStyle = document.getElementById('mode').value;
  });

  document.getElementById('get-frame').addEventListener('click', function(){
    setDiffFrame();
  });

  window.setDiffFrame = function() {
    diffFrame.width = cameraEl.offsetWidth;
    diffFrame.height = cameraEl.offsetHeight;
    diffFrame.getContext("2d").drawImage(cameraEl, 0, 0, renderer.view.width, renderer.view.height);

    // send canvas as img into diff shader
    var image = new Image();
    image.src = diffFrame.toDataURL();
    image.onload = function(){
      var texture = new PIXI.Texture(new PIXI.BaseTexture(image));
      chromaFilter.diffFrame = texture;
    };

    // renderer.view.getContext("2d").drawImage(cameraEl, 0, 0, renderer.view.width, renderer.view.height);
  }

  // animation loop
  function animate(){
    // render the stage
    renderer.render(stage);
    requestAnimationFrame(animate);
  }
  animate();
}
