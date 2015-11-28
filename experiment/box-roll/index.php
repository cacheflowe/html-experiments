<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('Box Roll', 'Box Roll', null); ?>
	<style>
		canvas {
			max-width: 100%;
			border: 1px solid #999;
			background: rgba(255,255,255,0.3);
		}
	</style>
</head>

<body>
	<header>
		<h1>Box Roll</h1>
	</header>
	<div class="container">
		<canvas id="draw" width="800" height="500"></canvas>
	  <div id="fps"></div>
	</div>

	<script type="text/javascript" src="../../javascripts/modeset/math_util.js"></script>
  <script type="text/javascript" src="../../javascripts/modeset/canvas_util.js"></script>
  <script type="text/javascript" src="../../javascripts/modeset/elastic-point-3.js"></script>
  <script type="text/javascript" src="../../javascripts/modeset/pointer-pos.js"></script>

	<script>
		var _canvas = document.getElementById("draw");
		var _context = _canvas.getContext("2d");
		var _contextSource = null;
		var _width = _canvas.width;
		var _height = _canvas.height;

		var diameter = 100;
		var radius = diameter / 2;
		var circumference = Math.PI * diameter;
		var speed = 3;
		var boxX = 0;
		var ballX = _width / 2;
		var ballY = 450;
		var boxY = 475;
		var boxSize = radius;
		var boxDiag = Math.sqrt(2) * (boxSize);
		var yTravel = boxDiag - boxSize/2;

		var gradient = _context.createLinearGradient(0, 0, radius, radius);
		gradient.addColorStop(0, '#8ED6FF');
		// gradient.addColorStop(0.25, '#8ED6FF');
		// gradient.addColorStop(0.5, '#004CB3');
		gradient.addColorStop(1, '#004CB3');

		_context.strokeStyle = 'rgba(0,0,0,0)';

		var _frameLength = 20;
		var _lastFrame = 0;
		var _fps = document.getElementById('fps');

		var _mousePos = new ElasticPoint( 0, 0, 0, 0.3, 0.2 );

		var render = function() {
				var responseRatio = _width / _canvas.getBoundingClientRect().width;
				var roundedBoxX = pointerPos.x(_canvas) - ( pointerPos.x(_canvas) % (circumference/4) );
				roundedBoxX *= responseRatio;
				_mousePos.setTarget(roundedBoxX, pointerPos.y(_canvas), 0);
				_mousePos.update();


				boxX += 2;
				ballX += 2;
				if( boxX > _width + radius ) boxX = -radius;
				if( ballX > _width + radius ) ballX = -radius;

				boxX = _mousePos.x(); //_mouseX;

				_context.clearRect(0,0,_width,_height);
				_context.fillStyle = gradient;

				// draw ball
				_context.save();
				_context.translate( ballX, ballY );
				var rotations = ballX / circumference;
				_context.rotate( MathUtil.degreesToRadians( rotations * 360 ) );
				CanvasUtil.drawCircle( _context, 0, 0, radius );
				_context.restore();

				// draw box
				_context.save();
				var rotations = boxX / circumference;
				var rotationProgress = (rotations % 0.25)/0.25; // percent of progress through quarter rotation
				var yAdd = Math.sin(rotationProgress * Math.PI) * yTravel/4;
				_context.translate( boxX, boxY - yAdd );
				_context.rotate( MathUtil.degreesToRadians( rotations * 360 ) );
				_context.fillRect( -boxSize/2, -boxSize/2, boxSize, boxSize );
				_context.restore();

			// }
			requestAnimationFrame(render);
		};
		requestAnimationFrame(render);

		var saw = function( rads ) {
			rads += Math.PI / 2;                 // add to sync up with sin(0)
			var percent = ( rads % Math.PI ) / Math.PI;
			var dir = ( rads % (Math.PI * 2) > Math.PI ) ? -1 : 1;
			percent *= 2 * dir;
			percent -= dir;
			return percent;
		};

		// If the radius is r, the outer rectangle size will be r*2.
		// The inner rectangle will have size equals to 2*sqrt(2*r).
		// So the diff will be equals to 2*(r-sqrt(2*r^2)).
	</script>
</body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
