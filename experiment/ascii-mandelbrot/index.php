<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('ASCII Mandlebrot', 'ASCII Mandlebrot', null); ?>
	<style>
		body {
			line-height: 0.46;
			text-align: center;
		}
	</style>
</head>

<body>
	<header>
		<h1>ASCII Mandlebrot</h1>
	</header>
	<div class="container">
		<pre id="draw"></pre>
	</div>
	<script>
		var el = document.getElementById('draw');
		var str = '';

		// customizations
		var inc = 5;
		var itersAdd = 0;
		var sizeAdd = 0;
		var leftAdd = 0;
		var rightAdd = 0;
		var maxSize = 120;

		// ported from c++: http://www.cygnus-software.com/theory/theory.htm
		var MaxIters =  100
		var SIZE =      400
		var LEFT =      -2.0
		var RIGHT =     1.0
		var TOP =       1.0
		var BOTTOM =    -1.0

		function draw(){
		    var x, y, count;
		    var zr, zi, cr, ci;
		    var rsquared, isquared;

		    // oscillate values
		    var size = SIZE + Math.round(sizeAdd);
		    var left = LEFT + leftAdd;
		    var right = RIGHT + rightAdd;

		    for (y = 0; y < size && y < maxSize; y++) {
		        for (x = 0; x < size && x < maxSize; x++) {
		            zr = 0.0;
		            zi = 0.0;
		            cr = left + x * (right - left) / size;

		            ci = TOP + y * (BOTTOM - TOP) / size;
		            rsquared = zr * zr;
		            isquared = zi * zi;

		            for (count = 0; rsquared + isquared <= 4.0 && count < MaxIters + Math.round(itersAdd); count++)
		            {
		                zi = zr * zi * 2;
		                zi += ci;

		                zr = rsquared - isquared;
		                zr += cr;

		                rsquared = zr * zr;
		                isquared = zi * zi;
		            }

		            if (rsquared + isquared <= 4.0)
		            	str += "*"
		            else
		            	str += "&nbsp;"
		        }
		        str += "<br/>"
		    }
		    el.innerHTML = str;
		}

		function animate() {
			requestAnimationFrame(animate);

			str = '';

			inc += 0.01;
			itersAdd = Math.sin(inc) * 50;
			sizeAdd = Math.sin(inc) * 300;
			leftAdd = 1 + Math.sin(inc) * 0.5;
			rightAdd = 1 + Math.sin(inc) * 1;

			draw();
		}
		requestAnimationFrame(animate);
	</script>
</body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
