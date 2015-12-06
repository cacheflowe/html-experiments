<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('Lines to Lines', 'Lines to Lines', 'http://cacheflowe.com/code/html/experiment/point-line-spread/preview.jpg'); ?>
</head>

<body>
	<header>
		<h1>Lines to Lines</h1>
	</header>
	<canvas id="source" class="full-width" width="400" height="400"></canvas>
  <script src="../../javascripts/modeset/math_util.js"></script>
	<script src="../../javascripts/modeset/pointer-pos.js"></script>
	<!-- <script src="../../javascripts/gif/gif.js"></script>
	<script src="../../javascripts/gif/gif-renderer.js"></script> -->
	<script>
		var canvas = document.getElementById("source");
		var _context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    _context.fillStyle = "rgba(255,255,255)";
    _context.fillRect(0, 0, canvas.width, canvas.height);

    function drawPointToLine(pointX, pointY, lineX1, lineY1, lineX2, lineY2, numLines) {
      for (var i = 0; i <= numLines; i++) {
        var pointPercent = 1/numLines * i;
        var curLineX = MathUtil.lerp(lineX1, lineX2, pointPercent);
        var curLineY = MathUtil.lerp(lineY1, lineY2, pointPercent);
        _context.beginPath();
        _context.moveTo(pointX, pointY);
        _context.lineTo(curLineX, curLineY);
        _context.stroke();
      }
    }

		function drawLineToLine(line1X1, line1Y1, line1X2, line1Y2, line2X1, line2Y1, line2X2, line2Y2, numLines) {
			for (var i = 0; i <= numLines; i++) {
				var linePercent = 1/numLines * i;
				var line1X = MathUtil.lerp(line1X1, line1X2, linePercent);
				var line1Y = MathUtil.lerp(line1Y1, line1Y2, linePercent);
				var line2X = MathUtil.lerp(line2X1, line2X2, linePercent);
				var line2Y = MathUtil.lerp(line2Y1, line2Y2, linePercent);
				_context.beginPath();
				_context.moveTo(line1X, line1Y);
				_context.lineTo(line2X, line2Y);
				_context.stroke();
			}
		}

		function drawMandala(progress) {
			_context.fillStyle = "rgba(255,255,255,1)";
			_context.fillRect(0, 0, canvas.width, canvas.height);
      _context.strokeStyle = "rgba(0,0,0,0.95)";
  		_context.lineWidth = 0.7;

			var twoPi = Math.PI * 2;
			var vertices = 4 + 2 * Math.ceil(window.pointerPos.xPercent() * 30);
			var vertexRadians = (Math.PI * 2) / vertices;
			var radius = (window.innerWidth > window.innerHeight) ? window.innerHeight : window.innerWidth;
			radius *= 0.15;
			for (var i = 0; i < vertices; i+=2) {
				// level 1
				var curRadians = i * vertexRadians;
				var nextRadians = (i+1) * vertexRadians;
				var nextNextRadians = (i+2) * vertexRadians;
				var radiusAltDepth_1 = 0.5 + 0.04 * Math.sin(progress * twoPi);

      	drawPointToLine(
					halfW,
					halfH,
					halfW + Math.sin(curRadians) * radius,
					halfH + Math.cos(curRadians) * radius,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_1,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_1,
					10
				);
				drawPointToLine(
					halfW,
					halfH,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_1,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_1,
					halfW + Math.sin(nextNextRadians) * radius,
					halfH + Math.cos(nextNextRadians) * radius,
					10
				);

				// level 2
				radiusAltDepth_2 = radiusAltDepth_1 + 0.3 + 0.02 * Math.sin(progress * twoPi + Math.PI);
				drawPointToLine(
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_2,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_2,
					halfW + Math.sin(curRadians) * radius,
					halfH + Math.cos(curRadians) * radius,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_1,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_1,
					10
				);
				drawPointToLine(
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_2,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_2,
					halfW + Math.sin(nextNextRadians) * radius,
					halfH + Math.cos(nextNextRadians) * radius,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_1,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_1,
					10
				);

				// level 3
				radiusAltDepth_3 = radiusAltDepth_2 + 0.85 + 0.02 * Math.cos(progress * twoPi - Math.PI/2);
				drawPointToLine(
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_2,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_2,
					halfW + Math.sin(curRadians) * radius,
					halfH + Math.cos(curRadians) * radius,
					halfW + Math.sin(curRadians) * radius * radiusAltDepth_3,
					halfH + Math.cos(curRadians) * radius * radiusAltDepth_3,
					10
				);
				drawPointToLine(
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_2,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_2,
					halfW + Math.sin(nextNextRadians) * radius,
					halfH + Math.cos(nextNextRadians) * radius,
					halfW + Math.sin(nextNextRadians) * radius * radiusAltDepth_3,
					halfH + Math.cos(nextNextRadians) * radius * radiusAltDepth_3,
					10
				);

				// level 4
				radiusAltDepth_4 = radiusAltDepth_3 - 0.25 + 0.02 * Math.sin(progress * twoPi - Math.PI/2);
				drawPointToLine(
					halfW + Math.sin(curRadians) * radius * radiusAltDepth_3,
					halfH + Math.cos(curRadians) * radius * radiusAltDepth_3,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_2,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_2,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_4,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_4,
					10
				);
				drawPointToLine(
					halfW + Math.sin(nextNextRadians) * radius * radiusAltDepth_3,
					halfH + Math.cos(nextNextRadians) * radius * radiusAltDepth_3,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_2,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_2,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_4,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_4,
					10
				);
				radiusAltDepth_5 = radiusAltDepth_3 + 0.25 + 0.02 * Math.cos(progress * twoPi + Math.PI/2);
				drawPointToLine(
					halfW + Math.sin(curRadians) * radius * radiusAltDepth_3,
					halfH + Math.cos(curRadians) * radius * radiusAltDepth_3,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_5,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_5,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_4,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_4,
					10
				);
				drawPointToLine(
					halfW + Math.sin(nextNextRadians) * radius * radiusAltDepth_3,
					halfH + Math.cos(nextNextRadians) * radius * radiusAltDepth_3,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_5,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_5,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_4,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_4,
					10
				);

				// level 5
				radiusAltDepth_6 = radiusAltDepth_5 + 0.3 + 0.02 * Math.cos(progress * twoPi + Math.PI/2);
				radiusAltDepth_7 = radiusAltDepth_6 + 0.3 + 0.02 * Math.cos(progress * twoPi - Math.PI/2);
				radiusAltDepth_8 = radiusAltDepth_7 + 0.4 + 0.02 * Math.cos(progress * twoPi + Math.PI);
				drawLineToLine(
					halfW + Math.sin(curRadians) * radius * radiusAltDepth_3,
					halfH + Math.cos(curRadians) * radius * radiusAltDepth_3,
					halfW + Math.sin(curRadians) * radius * radiusAltDepth_8,
					halfH + Math.cos(curRadians) * radius * radiusAltDepth_8,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_5,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_5,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_7,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_7,
					20
				);
				drawLineToLine(
					halfW + Math.sin(nextNextRadians) * radius * radiusAltDepth_3,
					halfH + Math.cos(nextNextRadians) * radius * radiusAltDepth_3,
					halfW + Math.sin(nextNextRadians) * radius * radiusAltDepth_8,
					halfH + Math.cos(nextNextRadians) * radius * radiusAltDepth_8,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_5,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_5,
					halfW + Math.sin(nextRadians) * radius * radiusAltDepth_7,
					halfH + Math.cos(nextRadians) * radius * radiusAltDepth_7,
					20
				);
			}
		}

    var frames = 100;
    var frame = 1;
    var halfW = canvas.width / 2;
    var halfH = canvas.height / 2;
    var midLinesNum = 200;
    var shiftedLinesNum = 150;

		var renderer = null; // new GifRenderer();

		function animate() {
      var progress = (frame % frames) / frames;
			requestAnimationFrame(animate);
			drawMandala(progress);
			if(renderer != null && frame > 20) renderer.addFrame(canvas, frames);
      frame++;
		}
		requestAnimationFrame(animate);
	</script>
</body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
