<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('Pattern Rotate Repeat', 'Pattern Rotate Repeat', null); ?>
	<style>
		canvas {
			max-width: 100%;
		}
	</style>
</head>

<body>
	<header>
		<h1>Pattern Rotate Repeat</h1>
	</header>
	<div class="container">
		<p>
			<canvas id="source" width="200" height="200"></canvas>
			<canvas id="pattern" width="800" height="800"></canvas>
		</p>
		<p class="row">
			<a class="button button-primary" href="javascript:window.location.reload()">Randomize</a>
		</p>
	</div>

	<script>
		var canvas = document.getElementById("source");
		var _context = canvas.getContext("2d");
		var canvasPattern = document.getElementById("pattern");
		var _contextPattern = canvasPattern.getContext("2d");

		// set up source and pattern canvases
		var divisions = Math.ceil( Math.random()*5 );
		if( divisions == 3 ) divisions++;
		var patternW = 800;
		var patternH = 800;
		var imgW = patternW / divisions;
		var imgH = patternH / divisions;

		canvas.width = imgW;
		canvas.height = imgH;
		canvasPattern.width = patternW;
		canvasPattern.height = patternH;
		var cols = canvasPattern.width / imgW;
		var rows = canvasPattern.height / imgH;
		canvas.style.border = '1px solid #999';
		canvas.style.display = 'none';
		canvasPattern.style.border = '1px solid #999';

		var _curPointGroup = null;
		var _numRotations = Math.ceil( Math.random() * 30 );
		if( _numRotations % 2 != 0 ) _numRotations++;	// keep even numbers for proper reflection
		var _pointsPerGroup = Math.ceil( Math.random() * 30 );
		var isCurved = ( Math.random() > 0.5 ) ? true : false;

		function Point(){
			var self = this;

			this.reset = function(){
				self.inc = Math.random()*1;
				self.incSpeed = Math.random()*0.02;
				self.radius = Math.random()*50;
				self.x = Math.round( Math.random()*(imgW-1)/1.5 );
				self.y = Math.round( Math.random()*(imgH-1)/1.5 );
				self.baseX = self.x;
				self.baseY = self.y;
			};
			this.reset();
		}

		function PointGroup( numPoints ) {
			var _points = [];
			for( var i = 0; i < numPoints; i++ ) {
				_points.push( new Point() );
			}

			var update = function() {
				var point;
				for( var i=0; i < _points.length; i++ ) {
					point = _points[i];
					point.inc += point.incSpeed;
					point.x = point.baseX + Math.sin(point.inc) * point.radius;
					point.y = point.baseY + Math.cos(point.inc) * point.radius;
				}
			};
			update();

			return {
				points : _points,
				update : update
			};
		}

		var drawPatternFromPoints = function( pointGroup, rotations ) {
			var points = pointGroup.points;

			_context.save();
			for(var r=0; r < rotations; r++) {
				_context.rotate((Math.PI*2) / rotations);
				_context.save();

				_context.fillStyle = 'rgba(0,188,229,0.2)';
				_context.strokeStyle = "#000000";
				_context.lineWidth = 1;
				_context.beginPath();
			    _context.moveTo( points[0].x, points[0].y );
				if( !isCurved ) {
					for( var i = 0; i < points.length; i++ ) {
						_context.lineTo( points[i].x, points[i].y );
					}
				} else {
					for( var i = 1; i < points.length; i+=2 ) {
						_context.quadraticCurveTo( points[i-1].x, points[i-1].y, points[i].x, points[i].y );
					}
				}
			    _context.stroke();
			    _context.closePath();
				//_context.fill();
				_context.restore();
			}
			_context.restore();

		};

		var repeatPattern = function() {
			// repeat the pattern
			var pixelBlock = _context.getImageData(0, 0, imgW, imgH);
			for(var i = 0; i < cols; i++) {
				for(var j = 0; j < rows; j++) {
					_contextPattern.putImageData(pixelBlock, i*imgW, j*imgH);
				}
			}
		};

		var drawPointsAndPattern = function(){
			_context.save();
			_context.translate( imgW / 2, imgH / 2);
			// draw and draw reflection
			drawPatternFromPoints( _curPointGroup, _numRotations );
			_context.save();
			_context.scale(-1,1);
			drawPatternFromPoints( _curPointGroup, _numRotations );
			_context.restore();
			_context.restore();
			// paste into larger canvas
			repeatPattern();
		};

		function createPoints(){
			_curPointGroup = new PointGroup( _pointsPerGroup );
		}

		createPoints();


		function animate() {
			requestAnimationFrame(animate);

			// clear canvases
			_context.clearRect(0, 0, imgW, imgW);
			_contextPattern.clearRect(0, 0, patternW, patternH);
			// redraw and update point positions
			if( _curPointGroup ) {
				drawPointsAndPattern();
				_curPointGroup.update();
			}
		}
		requestAnimationFrame(animate);

	</script>
</body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
