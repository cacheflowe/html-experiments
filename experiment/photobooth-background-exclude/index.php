<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('Photobooth Background Exclude', 'Photobooth Background Exclude', null); ?>
	<style>
		#container {
			width: 100%;
			height: 100%;
		}
		#camera-input,
		#video-test,
		#diff-frame {
			/*display: none;*/
		}
		.debug-els {
			transform: scale(0.3);
			position: absolute;
			top: 0;
			left: 0;
			width: 0px;
			height: 100px;
		}
		#controls {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
		}
		#controls label {
			display: inline-block;
		}
		canvas {
			background-color: #f00;
		}
	</style>
</head>

<body>
	<header>
		<h1>Photobooth Background Exclude</h1>
	</header>
	<div class="debug-els">
		<video id="camera-input"></video>
		<video id="video-test" src="test-mov.m4v" autoplay="true" loop="true"></video>
		<canvas id="diff-frame"></canvas>
	</div>
	<div id="controls">
		<button id="get-frame">Get Frame</button>
		<label for="colorR">colorR</label>
		<input type="range" min="0" max="1" step="0.01" value="0" id="colorR">
		<label for="colorG">colorG</label>
		<input type="range" min="0" max="1" step="0.01" value="0" id="colorG">
		<label for="colorB">colorB</label>
		<input type="range" min="0" max="1" step="0.01" value="0" id="colorB">
		<label for="thresh">thresh</label>
		<input type="range" min="0" max="1" step="0.01" value="0" id="thresh">
		<label for="smooth">smooth</label>
		<input type="range" min="0" max="1" step="0.01" value="0" id="smooth">
		<label for="mode">mode</label>
		<input type="range" min="0" max="1" step="1" value="0" id="mode">
	</div>
	<script type="text/javascript" src="./pixi.js"></script>
	<script type="text/javascript" src="./tv-filter.js"></script>
	<script type="text/javascript" src="./chroma-color.js"></script>
	<script type="text/javascript" src="./camera.js"></script>
	<script type="text/javascript" src="./video.js"></script>

</body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
