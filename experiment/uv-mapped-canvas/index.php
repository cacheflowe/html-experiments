<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('UV-Mapped Canvas', 'UV-Mapped Canvas', 'http://cacheflowe.com/code/html/experiment/uv-mapped-canvas/preview.gif'); ?>
	<style>
		canvas {
			max-width: 100%;
			margin: 40px auto 20px;
		}
	</style>
</head>

<body>
	<header>
		<h1>UV-Mapped Canvas</h1>
	</header>
	<div class="row">
    <div class="twelve columns">
      <p>&nbsp;</p>
		</div>
		<div id="canvas-holder" class="twelve columns"></div>
	</div>
  <script src="../../javascripts/modeset/canvas-filters.js"></script>
  <script src="../../javascripts/modeset/canvas_util.js"></script>
	<script src="../../javascripts/gif/gif.js"></script>
	<script src="../../javascripts/gif/gif-renderer.js"></script>
	<script>
		// load image into a canvas
		var _loadedImage = null;
    var _canvasHolder = document.getElementById('canvas-holder');

		// create a canvas for drawing
		var _drawCanvas = document.createElement('canvas');
		_drawCanvas.width = 200;
		_drawCanvas.height = 200;
		_drawCtx = CanvasUtil.getCanvasContext(_drawCanvas);
		_canvasHolder.appendChild(_drawCanvas);

		// build a canvas for compositing once the image is loaded
		var _compositeCanvas = document.createElement('canvas');
		_compositeCtx = null;

		// points & uv coordinates
		var textureMapPoints = [
			{x:184.5, y:45, u:0, v:0},
			{x:326, y:57, u:200, v:0},
			{x:303, y:169, u:200, v:200},
			{x:162.3, y:151.5, u:0, v:200}
		];


		var _frameCount = 0;
    var _totalFrames = 40;
		var _gifRenderer = new GifRenderer(_canvasHolder);

		function drawCanvas() {
			// draw shapes from center
			_drawCtx.save();
			_drawCtx.translate(_drawCanvas.width/2, _drawCanvas.height/2);

			var spacing = 10;
			var odd = true;
			for (var size = (_drawCanvas.width * 1.1) + _totalFrames - _frameCount; size > 0; size -= spacing) {
				_drawCtx.beginPath();
				_drawCtx.lineWidth = spacing;
				_drawCtx.fillStyle = (odd == true) ? 'rgba(0,0,0,0.99)' : 'rgba(230,255,230,0.99)';
				_drawCtx.rect(-size/2, -size/2, size, size);
				_drawCtx.fill();
				odd = !odd;
			}
			_drawCtx.restore();


			// "background" gradient overlay
			var my_gradient = _drawCtx.createLinearGradient(0,0,_drawCanvas.width,_drawCanvas.height);
			my_gradient.addColorStop(0,CanvasUtil.hexToCanvasColor("#4c5566", 0.5));
			my_gradient.addColorStop(0.5,CanvasUtil.hexToCanvasColor("#abafa1", 0.76));
			my_gradient.addColorStop(1,CanvasUtil.hexToCanvasColor("#7e8281", 0.68));
			_drawCtx.fillStyle = my_gradient;
			_drawCtx.fillRect(0,0,_drawCanvas.width,_drawCanvas.height);


			var hueVal = (_frameCount % _totalFrames) * (100/_totalFrames);
			CanvasFilters.hue(_drawCanvas, hueVal);
		}

		function mapCanvasToImage() {
			// draw canvas to mapped rect
			_compositeCtx.drawImage(_loadedImage, 0, 0);
			CanvasUtil.textureMap(_compositeCtx, _drawCanvas, textureMapPoints);

			// draw outline
			_compositeCtx.lineWidth = 0.7;
			_compositeCtx.strokeStyle = '#191b18';
			_compositeCtx.beginPath();
			_compositeCtx.moveTo(textureMapPoints[0].x, textureMapPoints[0].y);
			for (var i = 1; i < textureMapPoints.length; i++) {
				_compositeCtx.lineTo(textureMapPoints[i].x, textureMapPoints[i].y);
			}
			_compositeCtx.lineTo(textureMapPoints[0].x, textureMapPoints[0].y);
			_compositeCtx.stroke();

		}

    var animate = function() {
      requestAnimationFrame(animate);
			drawCanvas();
      if(_compositeCtx != null) {
				mapCanvasToImage();
        if(_gifRenderer != null) _gifRenderer.addFrame(_compositeCanvas, _totalFrames);
				_frameCount++;
				if(_frameCount > _totalFrames) _frameCount = 0;
      }

    };
    animate();

    ////////////////////////////
    // Load photo
    ////////////////////////////
		CanvasUtil.loadImageToCanvas( './macportable.jpg', function(canvas, image){
			// store image
			_loadedImage = image;
			_canvasHolder.appendChild(canvas);

			// build composite canvas
			_compositeCanvas.width = canvas.width;
			_compositeCanvas.height = canvas.height;
			_compositeCtx = CanvasUtil.getCanvasContext(_compositeCanvas);
			_canvasHolder.appendChild(_compositeCanvas);

		});

	</script>
</body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
