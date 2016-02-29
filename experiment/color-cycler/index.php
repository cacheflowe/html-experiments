<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('Color Cycler', 'Color Cycler', 'http://cacheflowe.com/code/html/experiment/color-cycler/preview.gif'); ?>
	<style>
		canvas {
			max-width: 100%;
			margin: 40px auto 20px;
		}
    button {
      position: relative;
    }
    input[type="file"] {
      width: 100%;
      height: 100%;
      position: absolute;
      background-color: #f00;
      opacity: 0;
      top: 0;
      left: 0;
    }
    #instructions.hidden {
			display: none;
		}
		#saved {
			padding: 40px;
		}
		#saved img {
			width: 100%;
			max-width: 700px;
			margin: 0 auto;
		}
	</style>
</head>

<body>
	<header>
		<h1>Color Cycler</h1>
	</header>
	<div class="row">
    <div class="twelve columns">
      <p>&nbsp;</p>
		</div>
		<div id="canvas-holder" class="twelve columns">
		</div>
		<div class="twelve columns">
      <button id="load-photo" class="button dark"><span>Load Image</span><input id="take-photo" type="file" accept="image/*;capture=camera" name="imagefile" /></button>
		</div>
		<div class="twelve columns">
			<div id="instructions" class="hidden">Tap and hold or right click to save the .gif below</div>
			<div id="saved"></div>
		</div>
	</div>
  <script src="../../javascripts/vendor/load-image.all.min.js"></script>
  <script src="../../javascripts/modeset/canvas_util.js"></script>
  <script src="../../javascripts/modeset/canvas-filters.js"></script>
	<script src="../../javascripts/gif/gif.js"></script>
	<script src="../../javascripts/gif/gif-renderer.js"></script>
	<script>
    ////////////////////////////
    // Color cycler
    ////////////////////////////
    var _canvas = null;
    var _canvasCopy = null;
    var _frameCount = 0;
    var _totalFrames = 50;
    var canvasHolder = document.getElementById('canvas-holder');
    var instructionsShown = false;
		var savedGifHolder = document.getElementById('saved');
		var loadPhotoButton = document.getElementById('load-photo');

    var _gifRenderer = null;

    var animate = function() {
      requestAnimationFrame(animate);
      if(_canvas != null) {
        CanvasUtil.copyPixels(CanvasUtil.getCanvasContext(_canvasCopy), CanvasUtil.getCanvasContext(_canvas));
        var hueVal = (_frameCount % _totalFrames) * (100/_totalFrames);
        CanvasFilters.hue(_canvas, hueVal);
        if(_gifRenderer != null) _gifRenderer.addFrame(_canvas, _totalFrames);
        _frameCount++;
        if(_frameCount > _totalFrames) {
          _canvas = null;
          _frameCount = 0;
        }
      }

      // show instructions
      if(savedGifHolder.childNodes.length > 0) {
        if(instructionsShown == false) {
          instructionsShown = true;
          document.getElementById('instructions').classList.remove('hidden');
          loadPhotoButton.querySelector('span').innerHTML = 'Load Image';
          canvasHolder.innerHTML = '';
        }
      }
    };
    animate();

    ////////////////////////////
    // Load photo
    ////////////////////////////
    function userImageLoaded(canvas) {
      _gifRenderer = new GifRenderer(savedGifHolder);
      instructionsShown = false;
      loadPhotoButton.querySelector('span').innerHTML = 'Wait...';
      document.getElementById('instructions').classList.add('hidden');

      _canvas = canvas;
      _canvasCopy = CanvasUtil.cloneCanvas(_canvas);
      canvasHolder.innerHTML = '';
      savedGifHolder.innerHTML = '';
      canvasHolder.appendChild(_canvas);
    }

    function onFileInputChanged(e) {
      var file = e.target.files[0];
      // get rotation from metadata
      loadImage.parseMetaData(file, function (data) {
        var options = {
          maxWidth: 500,
          maxHeight: 500,
          crop: false,
          canvas: true,
        }
        if (data.exif) options.orientation = data.exif.get('Orientation');
        // load the image with correct metadata
        loadImage(
          file,
          function (canvas) {
            userImageLoaded(canvas);
          },
          options
        );
      });
    }
    loadPhotoButton.addEventListener('change', onFileInputChanged);

	</script>
</body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
