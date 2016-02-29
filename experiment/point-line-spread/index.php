<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('Point Line Spread', 'Point Line Spread', 'http://cacheflowe.com/code/html/experiment/point-line-spread/preview.jpg'); ?>
</head>

<body>
	<header>
		<h1>Point Line Spread</h1>
	</header>
	<canvas id="source" class="full-width" width="400" height="400"></canvas>
  <script src="../../javascripts/modeset/math_util.js"></script>
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
      for (var i = 0; i < numLines; i++) {
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
			for (var i = 0; i < numLines; i++) {
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

    var frames = 100;
    var frame = 1;

		var renderer = null; // new GifRenderer();

		function animate() {
	    var halfW = canvas.width / 2;
	    var halfH = canvas.height / 2;
	    var midLinesNum = 200;
	    var shiftedLinesNum = 150;

      var progress = (frame % frames) / frames;
			requestAnimationFrame(animate);

			_context.fillStyle = "rgba(255,255,255,0.2)";
			_context.fillRect(0, 0, canvas.width, canvas.height);
      _context.strokeStyle = "rgba(0,0,0,0.3)";
  		_context.lineWidth = 1;
      drawPointToLine(halfW, halfH, 0, 0, canvas.width, 0, midLinesNum + Math.sin(progress * Math.PI*2) * shiftedLinesNum);
      drawPointToLine(halfW, halfH, canvas.width, 0, canvas.width, canvas.height, midLinesNum + Math.sin(progress * Math.PI*2 + Math.PI/2) * shiftedLinesNum);
      drawPointToLine(halfW, halfH, canvas.width, canvas.height, 0, canvas.height, midLinesNum + Math.sin(progress * Math.PI*2 + Math.PI) * shiftedLinesNum);
      drawPointToLine(halfW, halfH, 0, canvas.height, 0, 0, midLinesNum + Math.sin(progress * Math.PI*2 + (Math.PI/2)*3) * shiftedLinesNum);

			if(renderer != null && frame > 20) renderer.addFrame(canvas, frames);
      frame++;
		}
		requestAnimationFrame(animate);

		window.addEventListener('resize', function() {
			canvas.width = window.innerWidth;
	    canvas.height = window.innerHeight;
		}, false);
	</script>
</body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
